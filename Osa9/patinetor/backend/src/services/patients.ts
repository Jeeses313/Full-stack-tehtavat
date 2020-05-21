/* eslint-disable @typescript-eslint/no-explicit-any */
import patientData from '../../data/patients';
import { Patient, Gender, PublicPatient, Entry } from '../types';
import { v4 as uuid } from 'uuid';

const parseName = (name: any): string => {
    if (!name || !isString(name)) {
        throw new Error('Incorrect or missing name: ' + name);
    }
    return name;
}

const parseOccupation = (occupation: any): string => {
    if (!occupation || !isString(occupation)) {
        throw new Error('Incorrect or missing occupation: ' + occupation);
    }
    return occupation;
}

const parseDateOfBirth = (date: any): string => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date of birth: ' + date);
    }
    return date;
}

const parseSnn = (ssn: any): string => {
    if (!ssn || !isString(ssn)) {
        throw new Error('Incorrect or missing ssn: ' + ssn);
    }
    return ssn;
}

const parseGender = (gender: any): Gender => {
    if (!gender || !isGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    }
    return gender;
}

const isGender = (param: any): param is Gender => {
    return Object.values(Gender).includes(param);
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const isString = (text: any): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isNumber = (num: any): num is number => {
    return !isNaN(Number(num));
};

const parseEntry = (entry: any): Entry => {
    const assertNever = (value: never): never => {
        throw new Error(
            `Unhandled discriminated union member: ${JSON.stringify(value)}`
        );
    };
    if (!entry.type || !isString(entry.type)) {
        throw new Error('Incorrect entry type: ' + entry.type);
    }
    if (!entry.description || !isString(entry.description)) {
        throw new Error('Incorrect entry description: ' + entry.description);
    }
    if (!entry.date || !isDate(entry.date)) {
        throw new Error('Incorrect entry date: ' + entry.date);
    }
    if (!entry.specialist || !isString(entry.specialist)) {
        throw new Error('Incorrect entry specialist: ' + entry.specialist);
    }
    const usedEntry: Entry = entry;
    switch (usedEntry.type) {
        case "HealthCheck":
            if (typeof usedEntry.healthCheckRating === 'undefined' || !isNumber(usedEntry.healthCheckRating)) {
                throw new Error('Incorrect entry health check rating: ' + usedEntry.healthCheckRating);
            }
            return usedEntry;
        case "Hospital":
            if (!usedEntry.discharge || !usedEntry.discharge.date || !usedEntry.discharge.criteria || !isDate(`${usedEntry.discharge.date}`) || !isString(usedEntry.discharge.criteria)) {
                throw new Error('Incorrect entry discharge: ' + usedEntry.discharge);
            }
            return usedEntry;
        case "OccupationalHealthcare":
            if (usedEntry.sickLeave && !isDate(`${usedEntry.sickLeave.startDate}`) && !isDate(`${usedEntry.sickLeave.endDate}`)) {
                throw new Error('Incorrect entry sick leave: ' + usedEntry.sickLeave);
            }
            return usedEntry;
        default:
            return assertNever(usedEntry);
    };
}

const parseEntries = (entries: any): Entry[] => {
    if (!entries) {
        return [];
    } else {
        const usedEntries = entries.map((entry: any) => parseEntry(entry))
        return usedEntries;
    }
}

const toNewPatient = (object: any, id: string): Patient => {
    return {
        id: id,
        name: parseName(object.name),
        dateOfBirth: parseDateOfBirth(object.dateOfBirth),
        ssn: parseSnn(object.ssn),
        gender: parseGender(object.gender),
        occupation: parseOccupation(object.occupation),
        entries: parseEntries(object.entries)
    };
};

let patients: Array<Patient> = patientData.map(obj => {
    const object = toNewPatient(obj, obj.id) as Patient;
    return object;
});



const getPatients = (): PublicPatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({ id, name, dateOfBirth, gender, occupation }));
};

const getPatient = (id: string): Patient => {
    const foundPatient = patients.filter(patient => patient.id === id);
    if (foundPatient.length === 0) {
        throw new Error('Patient with given id not found: ' + id);
    }
    return foundPatient[0];
};

const addPatient = (patient: any): PublicPatient => {
    let newPatient = toNewPatient(patient, uuid());
    patients.push(newPatient);
    delete newPatient.ssn;
    delete newPatient.entries;
    return newPatient;
}

const addEntry = (id: string, entry: any): Patient => {
    const foundPatient = patients.filter(patient => patient.id === id);
    if (foundPatient.length === 0) {
        throw new Error('Patient with given id not found: ' + id);
    }
    const newEntry: Entry = parseEntry(entry);
    newEntry.id = uuid();
    patients = patients.map(patient => patient.id === id ? (patient.entries ? { ...patient, entries: patient.entries.concat(newEntry) } : { ...patient, entries: patient.entries = [newEntry] }) : patient);
    return patients.filter(patient => patient.id === id)[0];
}



export default {
    getPatients,
    addPatient,
    getPatient,
    addEntry
};