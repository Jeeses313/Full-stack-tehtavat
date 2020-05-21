"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patients_1 = __importDefault(require("../services/patients"));
const router = express_1.default.Router();
router.get('/', (_req, res) => {
    res.json(patients_1.default.getPatients());
});
router.post('/', (req, res) => {
    try {
        const newPatient = patients_1.default.addPatient(req.body);
        res.json(newPatient);
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});
exports.default = router;
