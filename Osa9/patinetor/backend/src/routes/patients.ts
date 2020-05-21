import express from 'express';
import patientService from '../services/patients';

const router = express.Router();

router.get('/', (_req, res) => {
    res.json(patientService.getPatients());
});

router.post('/', (req, res) => {
    try {
        const newPatient = patientService.addPatient(req.body);
        res.json(newPatient)
    } catch (e) {
        res.status(400).send(e.message)
    }
});

router.get('/:id', (req, res) => {
    try {
        res.json(patientService.getPatient(req.params.id))
    } catch (e) {
        res.status(400).send(e.message)
    }
});

router.post('/:id/entries', (req, res) => {
    try {
        res.json(patientService.addEntry(req.params.id, req.body))
    } catch (e) {
        res.status(400).send(e.message)
    }
});

export default router;