const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { currentPatient, currentDoctor } = require('../utils/access');

exports.create = asyncHandler(async (req, res, next) => {
    const patient = await currentPatient(req.user._id);
    if (!patient) return next(ApiError.forbidden('Patient profile required'));
    const doctor = await Doctor.findById(req.body.doctor);
    if (!doctor || !doctor.isAvailable) return next(ApiError.badRequest('Doctor is unavailable'));
    const data = { ...req.body, patient: patient._id, facility: req.body.facility || doctor.facility, consultationFee: req.body.consultationFee ?? doctor.consultationFee ?? 0, createdBy: req.user._id };
    const duplicate = await Appointment.findOne({ patient: patient._id, doctor: data.doctor, appointmentDate: new Date(data.appointmentDate), appointmentTime: data.appointmentTime, status: { $nin: ['CANCELLED'] } });
    if (duplicate) return next(ApiError.conflict('An appointment already exists for this slot'));
    const conflict = await Appointment.findOne({ doctor: data.doctor, appointmentDate: new Date(data.appointmentDate), appointmentTime: data.appointmentTime, status: { $nin: ['CANCELLED'] } });
    if (conflict) return next(ApiError.conflict('This doctor time slot is unavailable'));
    const appointment = await Appointment.create(data);
    res.status(201).json({ success: true, message: 'Appointment booked', data: appointment });
});
exports.my = asyncHandler(async (req, res) => {
    const patient = await currentPatient(req.user._id);
    const filter = patient ? { patient: patient._id } : {};
    const appointments = await Appointment.find(filter).populate('doctor', 'specialization facility').populate('facility', 'name address').sort({ appointmentDate: -1 });
    res.json({ success: true, message: 'Appointments retrieved', data: appointments });
});
exports.doctorAppointments = asyncHandler(async (req, res, next) => {
    const doctor = await currentDoctor(req.user._id);
    if (!doctor || (doctor._id.toString() !== req.params.id && req.user.role !== 'admin')) return next(ApiError.forbidden('Not allowed to access these appointments'));
    const data = await Appointment.find({ doctor: req.params.id }).populate('patient').sort({ appointmentDate: 1, appointmentTime: 1 });
    res.json({ success: true, message: 'Appointments retrieved', data });
});
exports.cancel = asyncHandler(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);
    const patient = await currentPatient(req.user._id);
    if (!appointment) return next(ApiError.notFound('Appointment not found'));
    if (req.user.role !== 'admin' && (!patient || appointment.patient.toString() !== patient._id.toString())) return next(ApiError.forbidden('Not allowed to cancel this appointment'));
    if (['COMPLETED', 'CANCELLED'].includes(appointment.status)) return next(ApiError.badRequest('This appointment cannot be cancelled'));
    appointment.status = 'CANCELLED'; appointment.cancelledBy = req.user._id; await appointment.save();
    res.json({ success: true, message: 'Appointment cancelled', data: appointment });
});
