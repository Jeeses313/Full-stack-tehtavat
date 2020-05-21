import React from "react";
import { useParams } from "react-router-dom";
import { useStateValue, updatePatient } from "../state";
import { Patient } from "../types";
import HealthRatingBar from "../components/HealthRatingBar";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Icon, Button } from "semantic-ui-react";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

const SinglePatientPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [{ patients, diagnosis }, dispatch] = useStateValue();
    const [patient, setPatient] = React.useState<Patient | null>(null);
    React.useEffect(() => {
        const patientToView = patients[id]
        if (patientToView) {
            if (!patientToView.ssn) {
                const fetchPatient = async () => {
                    try {
                        const { data: patientFromApi } = await axios.get<Patient>(
                            `${apiBaseUrl}/patients/${id}`
                        );
                        dispatch(updatePatient(patientFromApi));
                        setPatient(patientFromApi)
                    } catch (e) {
                        console.error(e);
                    }
                };
                fetchPatient();
            } else {
                setPatient(patientToView)
            }
        } else {
            console.error('Patient does not exist')
        }
    }, [dispatch, id, patients]);


    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | undefined>();
    const openModal = (): void => setModalOpen(true);
    const closeModal = (): void => {
        setModalOpen(false);
        setError(undefined);
    };
    const submitNewEntry = async (values: EntryFormValues, type: string) => {
        values.type = type as any;
        try {
            const { data: updatedPatient } = await axios.post<Patient>(
                `${apiBaseUrl}/patients/${id}/entries`,
                values
            );
            dispatch(updatePatient(updatedPatient));
            closeModal();
        } catch (e) {
            console.error(e.response.data);
            setError(e.response.data.error);
        }
    };
    return (
        <>
            {patient ?
                <>
                    <h2>{patient.name}</h2>
                    <div>ssn: {patient.ssn}</div>
                    <div>gender: {patient.gender}</div>
                    <div>occupation: {patient.occupation}</div>
                    <div>
                        <HealthRatingBar showText={false} rating={1} />
                    </div>
                    <h3>Entries</h3>
                    {patient.entries?.map(entry => {
                        switch (entry.type) {
                            case "HealthCheck":
                                return (
                                    <div key={entry.id}>
                                        <Icon name="stethoscope" size="big" />
                                        <div>{entry.date}</div>
                                        <div>{entry.description}</div>
                                        <div>{entry.specialist}</div>
                                        <div>health check rating: {entry.healthCheckRating}</div>
                                        <div>codes:</div>
                                        <ul>{entry.diagnosisCodes?.map(code => <li key={code}>{code} {diagnosis[code].name}</li>)}</ul>
                                    </div>
                                );
                            case "Hospital":
                                return (
                                    <div key={entry.id}>
                                        <Icon name="hospital" size="big" />
                                        <div>{entry.date}</div>
                                        <div>{entry.description}</div>
                                        <div>{entry.specialist}</div>
                                        <div>discharge: {entry.discharge.date} {entry.discharge.criteria}</div>
                                        <div>codes:</div>
                                        <ul>{entry.diagnosisCodes?.map(code => <li key={code}>{code} {diagnosis[code].name}</li>)}</ul>
                                    </div>
                                );
                            case "OccupationalHealthcare":
                                return (
                                    <div key={entry.id}>
                                        <Icon name="user md" size="big" />
                                        <div>{entry.date}</div>
                                        <div>{entry.description}</div>
                                        <div>{entry.specialist}</div>
                                        {entry.sickLeave ?
                                            <div>sick leave: {entry.sickLeave.startDate}-{entry.sickLeave.endDate}</div>
                                            :
                                            <></>
                                        }
                                        <div>codes:</div>
                                        <ul>{entry.diagnosisCodes?.map(code => <li key={code}>{code} {diagnosis[code].name}</li>)}</ul>
                                    </div>
                                );
                            default:
                                return (
                                    <>
                                    </>
                                );
                        }
                    })}
                    <AddEntryModal
                        modalOpen={modalOpen}
                        onSubmit={submitNewEntry}
                        error={error}
                        onClose={closeModal}
                    />
                    <Button onClick={() => openModal()}>Add New Entry</Button>
                </>
                :
                <></>
            }
        </>
    )
};

export default SinglePatientPage;