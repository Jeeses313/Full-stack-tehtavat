export interface Diagnose {
    code: string;
    name: string;
    latin?: string;
}

interface BaseEntry {
    id: string;
    description: string;
    date: Date;
    specialist: string;
    diagnosisCodes?: Array<Diagnose['code']>;
}

interface HospitalEntry extends BaseEntry {
    type: 'Hospital';
    discharge: {
        date: Date;
        criteria: String;
    };
}

interface OccupationalHealthcareEntry extends BaseEntry {
    type: 'OccupationalHealthcare';
    sickLeave?: {
        startDate: Date;
        endDate: Date;
    };
}

interface HealthCheckEntry extends BaseEntry {
    type: 'HealthCheck';
    healthCheckRating: Number;
}

export type Entry = | HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

export interface Patient {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string;
    entries: Entry[];
}

export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other'
}

export type PublicPatient = Omit<Patient, 'ssn' | 'entries'>