import React, { useState } from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Search, Calendar, Star, MapPin, CheckCircle } from 'lucide-react';

export const DoctorDiscovery: React.FC = () => {
  const { doctors, facilities, bookAppointment } = useHealthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  
  // Booking form states
  const [bookingDoc, setBookingDoc] = useState<typeof doctors[0] | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('10:00 AM - 10:30 AM');
  const [bookingType, setBookingType] = useState<'General Consultation' | 'Referral Consultation' | 'Follow-up'>('General Consultation');
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const specialties = ['All', 'Rural General Medicine', 'Gynaecology & Paediatrics', 'Cardiology & General Medicine', 'Interventional Cardiology & Neurology'];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoc || !bookingDate) return;

    bookAppointment({
      patientId: 'P-101',
      patientName: 'Rajesh Kumar',
      doctorId: bookingDoc.id,
      doctorName: bookingDoc.name,
      facilityId: bookingDoc.facilityId,
      facilityName: bookingDoc.facilityName,
      date: bookingDate,
      timeSlot: bookingSlot,
      type: bookingType
    });

    setBookingDoc(null);
    setSuccessModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Discover & Book Doctors</h1>
        <p className="text-xs text-slate-500">Book virtual or physical consults across national health facility nodes.</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input 
          id="disc-search"
          placeholder="Search by physician name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Specialty</label>
          <select 
            value={selectedSpecialty}
            onChange={e => setSelectedSpecialty(e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 outline-none focus:ring-2 focus:ring-medical-500"
          >
            {specialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map(doc => (
          <Card key={doc.id}>
            <CardBody className="flex gap-4">
              {doc.avatar ? (
                <img 
                  src={doc.avatar} 
                  alt={doc.name} 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'text-2xl bg-medical-50 dark:bg-medical-950/40 p-2.5 h-14 w-14 rounded-2xl flex items-center justify-center border border-medical-200 dark:border-medical-900 shrink-0 font-bold text-medical-700 dark:text-medical-300';
                      fallback.innerText = '👩‍⚕️';
                      parent.appendChild(fallback);
                    }
                  }}
                  className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"
                />
              ) : (
                <div className="text-3xl bg-slate-50 dark:bg-slate-900 p-3 h-14 w-14 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0">
                  👨‍⚕️
                </div>
              )}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{doc.name}</h3>
                    <p className="text-xs text-medical-600 dark:text-medical-400 font-semibold mt-0.5">{doc.specialty}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {doc.facilityName}</p>
                </div>

                <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center gap-4">
                  <span className="text-[10px] text-slate-400 font-semibold">Available Mon/Wed/Fri</span>
                  <Button variant="primary" size="sm" onClick={() => setBookingDoc(doc)}>
                    Book Consultation
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Booking Form Modal */}
      {bookingDoc && (
        <Modal 
          isOpen={!!bookingDoc} 
          onClose={() => setBookingDoc(null)}
          title={`Book Consultation: ${bookingDoc.name}`}
        >
          <form onSubmit={handleBook} className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs space-y-1 border border-slate-150 dark:border-slate-800">
              <p><strong>Department:</strong> {bookingDoc.specialty}</p>
              <p><strong>Location:</strong> {bookingDoc.facilityName}</p>
            </div>

            <Input 
              id="book-date"
              label="Select Appointment Date"
              type="date"
              value={bookingDate}
              onChange={e => setBookingDate(e.target.value)}
              required
            />

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Time Slot</label>
              <select 
                value={bookingSlot} 
                onChange={e => setBookingSlot(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 outline-none focus:ring-2 focus:ring-medical-500"
              >
                <option value="09:00 AM - 09:30 AM">09:00 AM - 09:30 AM</option>
                <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Consultation Category</label>
              <select 
                value={bookingType} 
                onChange={e => setBookingType(e.target.value as any)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 outline-none focus:ring-2 focus:ring-medical-500"
              >
                <option value="General Consultation">General Consultation (First Visit)</option>
                <option value="Referral Consultation">Referral Consultation (Brought Referral Slip)</option>
                <option value="Follow-up">Routine Follow-up</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="secondary" type="button" onClick={() => setBookingDoc(null)}>Cancel</Button>
              <Button variant="primary" type="submit">Confirm Appointment</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Booking Success Modal */}
      <Modal 
        isOpen={successModalOpen} 
        onClose={() => setSuccessModalOpen(false)}
        title="Appointment Confirmed"
      >
        <div className="text-center space-y-4 py-4">
          <div className="mx-auto h-12 w-12 bg-hospital-50 dark:bg-hospital-950/20 text-hospital-600 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-slate-950 dark:text-white">Your Slot has been Reserved!</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Your appointment has been registered on the Swasthya grid and linked with your ABHA record. Please show your health card at the clinic check-in desk.
          </p>
          <Button variant="success" onClick={() => setSuccessModalOpen(false)}>Okay, Great</Button>
        </div>
      </Modal>

    </div>
  );
};
