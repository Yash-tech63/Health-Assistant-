const ApiError = require('./ApiError');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

async function currentPatient(userId) {
    return Patient.findOne({ user: userId });
}

async function currentDoctor(userId) {
    return Doctor.findOne({ user: userId });
}

async function requirePatientAccess(req, patientId) {
    if (req.user.role === 'admin' || req.user.role === 'health_worker') return;
    if (req.user.role === 'patient') {
        const patient = await currentPatient(req.user._id);
        if (patient && patient._id.toString() === String(patientId)) return;
    }
    if (req.user.role === 'doctor') return;
    throw ApiError.forbidden('You are not allowed to access this patient resource');
}

module.exports = { currentPatient, currentDoctor, requirePatientAccess };
