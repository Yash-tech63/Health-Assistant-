export interface Facility {
  id: string;
  name: string;
  type: 'PHC' | 'CHC' | 'District' | 'Specialist';
  location: string;
  bedsAvailable?: number;
  totalBeds?: number;
  image?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  facilityId: string;
  facilityName: string;
  availability: string[]; // ['Mon 9-1', 'Wed 2-5', etc.]
  rating: number;
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  abhaId: string;
  phone: string;
  location: string;
  bloodGroup: string;
  assignedFacilityId?: string;
  avatar?: string;
}

export interface AmbulanceUnit {
  id: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  stationFacilityName: string;
  type: 'ALS Emergency' | 'BLS Ambulance' | 'Mobile PHC Response';
  status: 'Available' | 'Dispatched' | 'En-Route Hospital' | 'Maintenance';
  activePatientName?: string;
  etaMins?: number;
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  abhaId: string;
  fromFacilityId: string;
  fromFacilityName: string;
  toFacilityId: string;
  toFacilityName: string;
  reason: string;
  referredByDoctorId: string;
  referredByDoctorName: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  date: string;
  notes: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorName: string;
  facilityName: string;
  date: string;
  medicines: {
    name: string;
    dosage: string; // e.g. "1-0-1" (morning-afternoon-night)
    duration: string; // e.g. "5 days"
    instructions: string;
  }[];
  notes?: string;
  referralId?: string;
}

export interface DiagnosticReport {
  id: string;
  patientId: string;
  testName: string;
  facilityName: string;
  date: string;
  status: 'Pending' | 'Completed';
  result?: string;
  normalRange?: string;
  isUrgent?: boolean;
}

export interface MedicineInventoryItem {
  id: string;
  name: string;
  facilityId: string;
  stock: number;
  minStockThreshold: number;
  category: 'Antibiotic' | 'Cardiac' | 'Analgesic' | 'Diabetic' | 'Ayurvedic' | 'Other';
  price: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  facilityId: string;
  facilityName: string;
  date: string;
  timeSlot: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  type: 'General Consultation' | 'Referral Consultation' | 'Follow-up';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  details: string;
  timestamp: string;
}

// Initial Indian Healthcare datasets
export const initialFacilities: Facility[] = [
  { id: 'F-PHC-01', name: 'Dhami Rural Primary Health Centre', type: 'PHC', location: 'Dhami Village, Shimla District, HP', bedsAvailable: 4, totalBeds: 6, image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600&auto=format&fit=crop' },
  { id: 'F-CHC-01', name: 'Sunni Community Health Centre', type: 'CHC', location: 'Sunni Block, Shimla District, HP', bedsAvailable: 12, totalBeds: 20, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop' },
  { id: 'F-DIST-01', name: 'Shimla District General Hospital', type: 'District', location: 'Shimla Town, HP', bedsAvailable: 85, totalBeds: 120, image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop' },
  { id: 'F-SPEC-01', name: 'Indira Gandhi Medical College & Specialist Hospital (IGMC)', type: 'Specialist', location: 'Shimla Ridge, HP', bedsAvailable: 154, totalBeds: 300, image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop' }
];

export const initialDoctors: Doctor[] = [
  { id: 'D-201', name: 'Dr. Ramesh Chauhan', specialty: 'Rural General Medicine', facilityId: 'F-PHC-01', facilityName: 'Dhami Rural Primary Health Centre', availability: ['Mon 9:00 AM - 1:00 PM', 'Tue 9:00 AM - 1:00 PM', 'Thu 9:00 AM - 1:00 PM'], rating: 4.6, avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80' },
  { id: 'D-202', name: 'Dr. Sunita Patil', specialty: 'Gynaecology & Paediatrics', facilityId: 'F-CHC-01', facilityName: 'Sunni Community Health Centre', availability: ['Mon 10:00 AM - 3:00 PM', 'Wed 10:00 AM - 3:00 PM', 'Fri 10:00 AM - 3:00 PM'], rating: 4.8, avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80' },
  { id: 'D-205', name: 'Dr. Arvind Sharma', specialty: 'Cardiology & General Medicine', facilityId: 'F-DIST-01', facilityName: 'Shimla District General Hospital', availability: ['Mon 2:00 PM - 6:00 PM', 'Tue 10:00 AM - 2:00 PM', 'Thu 10:00 AM - 2:00 PM', 'Fri 2:00 PM - 6:00 PM'], rating: 4.9, avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80' },
  { id: 'D-206', name: 'Dr. Vikram Sen', specialty: 'Interventional Cardiology & Surgery', facilityId: 'F-SPEC-01', facilityName: 'Indira Gandhi Medical College & Specialist Hospital (IGMC)', availability: ['Wed 11:00 AM - 4:00 PM', 'Thu 11:00 AM - 4:00 PM'], rating: 5.0, avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80' }
];

export const initialPatients: Patient[] = [
  { id: 'P-101', name: 'Rajesh Kumar', age: 42, gender: 'Male', abhaId: '91-8273-9281-2831', phone: '+91 98160 54321', location: 'Dhami Village, Shimla District', bloodGroup: 'O+Pos', assignedFacilityId: 'F-PHC-01', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
  { id: 'P-102', name: 'Priya Sharma', age: 29, gender: 'Female', abhaId: '88-1234-5678-9012', phone: '+91 94180 87654', location: 'Sunni Block, Shimla District', bloodGroup: 'B+Pos', assignedFacilityId: 'F-CHC-01', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop' },
  { id: 'P-103', name: 'Amit Singh', age: 65, gender: 'Male', abhaId: '54-9876-5432-1098', phone: '+91 88942 12345', location: 'Totu Village, Shimla District', bloodGroup: 'A+Pos', assignedFacilityId: 'F-PHC-01', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop' }
];

export const initialReferrals: Referral[] = [
  {
    id: 'R-701',
    patientId: 'P-101',
    patientName: 'Rajesh Kumar',
    abhaId: '91-8273-9281-2831',
    fromFacilityId: 'F-PHC-01',
    fromFacilityName: 'Dhami Rural Primary Health Centre',
    toFacilityId: 'F-DIST-01',
    toFacilityName: 'Shimla District General Hospital',
    reason: 'Frequent episodes of angina (chest pain) with high blood pressure, ECG abnormal. Needs cardiac profiling.',
    referredByDoctorId: 'D-201',
    referredByDoctorName: 'Dr. Ramesh Chauhan',
    status: 'Approved',
    date: '2026-08-20',
    notes: 'Transferred for Echocardiography and specialist assessment.'
  },
  {
    id: 'R-702',
    patientId: 'P-101',
    patientName: 'Rajesh Kumar',
    abhaId: '91-8273-9281-2831',
    fromFacilityId: 'F-DIST-01',
    fromFacilityName: 'Shimla District General Hospital',
    toFacilityId: 'F-SPEC-01',
    toFacilityName: 'Indira Gandhi Medical College & Specialist Hospital (IGMC)',
    reason: 'Angiography indicated. Suspected double vessel coronary artery disease. Needs specialist intervention.',
    referredByDoctorId: 'D-205',
    referredByDoctorName: 'Dr. Arvind Sharma',
    status: 'Pending',
    date: '2026-08-24',
    notes: 'Urgent referral request for Cath Lab procedure.'
  }
];

export const initialPrescriptions: Prescription[] = [
  {
    id: 'PR-801',
    patientId: 'P-101',
    doctorName: 'Dr. Ramesh Chauhan',
    facilityName: 'Dhami Rural Primary Health Centre',
    date: '2026-08-20',
    medicines: [
      { name: 'Sorbilate (Isosorbide Dinitrate) 5mg', dosage: '1-0-1 (Under tongue if pain)', duration: '10 days', instructions: 'Take post meals' },
      { name: 'Aspirin 75mg', dosage: '0-1-0', duration: '15 days', instructions: 'Take after lunch' }
    ],
    notes: 'Urgent referral written to District Hospital Shimla.'
  },
  {
    id: 'PR-802',
    patientId: 'P-101',
    doctorName: 'Dr. Arvind Sharma',
    facilityName: 'Shimla District General Hospital',
    date: '2026-08-23',
    medicines: [
      { name: 'Atorvastatin (Lipivas) 20mg', dosage: '0-0-1', duration: '30 days', instructions: 'Take at night before bed' },
      { name: 'Metformin 500mg (Glycomet)', dosage: '1-0-1', duration: '30 days', instructions: 'Take before meals' },
      { name: 'Clopidogrel 75mg', dosage: '0-1-0', duration: '30 days', instructions: 'Post-lunch' }
    ],
    notes: 'Echocardiogram done. Refer for angiogram at IGMC.',
    referralId: 'R-701'
  }
];

export const initialDiagnostics: DiagnosticReport[] = [
  { id: 'DR-901', patientId: 'P-101', testName: 'Electrocardiogram (ECG)', facilityName: 'Dhami Rural Primary Health Centre', date: '2026-08-20', status: 'Completed', result: 'ST-Segment depression in V4-V6 leads, suggestive of ischaemia', normalRange: 'Normal Sinus Rhythm', isUrgent: true },
  { id: 'DR-902', patientId: 'P-101', testName: '2D Echocardiogram (Echo)', facilityName: 'Shimla District General Hospital', date: '2026-08-22', status: 'Completed', result: 'LVEF 48%, hypokinesia in anterior wall', normalRange: 'LVEF 55% - 70%', isUrgent: false },
  { id: 'DR-903', patientId: 'P-101', testName: 'Coronary Angiography', facilityName: 'Indira Gandhi Medical College & Specialist Hospital (IGMC)', date: '2026-08-26', status: 'Pending', isUrgent: true }
];

export const initialInventory: MedicineInventoryItem[] = [
  // District Hospital stock
  { id: 'INV-01', name: 'Atorvastatin (Lipivas) 20mg', facilityId: 'F-DIST-01', stock: 150, minStockThreshold: 30, category: 'Cardiac', price: 12.5 },
  { id: 'INV-02', name: 'Metformin 500mg (Glycomet)', facilityId: 'F-DIST-01', stock: 12, minStockThreshold: 40, category: 'Diabetic', price: 6.8 }, // LOW STOCK
  { id: 'INV-03', name: 'Aspirin 75mg', facilityId: 'F-DIST-01', stock: 450, minStockThreshold: 50, category: 'Cardiac', price: 2.1 },
  { id: 'INV-04', name: 'Paracetamol 500mg (Crocin)', facilityId: 'F-DIST-01', stock: 1200, minStockThreshold: 100, category: 'Analgesic', price: 1.5 },
  { id: 'INV-05', name: 'Amoxicillin 250mg (Mox)', facilityId: 'F-DIST-01', stock: 8, minStockThreshold: 25, category: 'Antibiotic', price: 18.0 }, // LOW STOCK
  
  // Dhami PHC stock
  { id: 'INV-06', name: 'Paracetamol 500mg (Crocin)', facilityId: 'F-PHC-01', stock: 80, minStockThreshold: 50, category: 'Analgesic', price: 1.5 },
  { id: 'INV-07', name: 'Sorbilate (Isosorbide Dinitrate) 5mg', facilityId: 'F-PHC-01', stock: 18, minStockThreshold: 20, category: 'Cardiac', price: 4.2 }, // LOW STOCK
  { id: 'INV-08', name: 'Aspirin 75mg', facilityId: 'F-PHC-01', stock: 5, minStockThreshold: 15, category: 'Cardiac', price: 2.1 }, // LOW STOCK
  { id: 'INV-09', name: 'Chyawanprash (Dabur)', facilityId: 'F-PHC-01', stock: 35, minStockThreshold: 10, category: 'Ayurvedic', price: 120.0 }
];

export const initialAppointments: Appointment[] = [
  { id: 'A-601', patientId: 'P-101', patientName: 'Rajesh Kumar', doctorId: 'D-201', doctorName: 'Dr. Ramesh Chauhan', facilityId: 'F-PHC-01', facilityName: 'Dhami Rural Primary Health Centre', date: '2026-08-20', timeSlot: '10:00 AM - 10:30 AM', status: 'Completed', type: 'General Consultation' },
  { id: 'A-602', patientId: 'P-101', patientName: 'Rajesh Kumar', doctorId: 'D-205', doctorName: 'Dr. Arvind Sharma', facilityId: 'F-DIST-01', facilityName: 'Shimla District General Hospital', date: '2026-08-23', timeSlot: '11:00 AM - 11:30 AM', status: 'Completed', type: 'Referral Consultation' },
  { id: 'A-603', patientId: 'P-101', patientName: 'Rajesh Kumar', doctorId: 'D-206', doctorName: 'Dr. Vikram Sen', facilityId: 'F-SPEC-01', facilityName: 'Indira Gandhi Medical College & Specialist Hospital (IGMC)', date: '2026-08-27', timeSlot: '12:00 PM - 12:30 PM', status: 'Scheduled', type: 'Referral Consultation' }
];

export const initialMessages: ChatMessage[] = [
  { id: 'M-501', senderId: 'P-101', senderName: 'Rajesh Kumar', receiverId: 'D-205', content: 'Namaste Doctor, I am having mild dizziness after taking Atorvastatin at night. Is this normal?', timestamp: '2026-08-24T18:30:00Z', isRead: true },
  { id: 'M-502', senderId: 'D-205', senderName: 'Dr. Arvind Sharma', receiverId: 'P-101', content: 'Namaste Rajesh ji. Mild dizziness can happen initially. Keep hydrated. Do not miss the medicine. If it worsens, let me know. See you at IGMC on the 27th.', timestamp: '2026-08-24T19:00:00Z', isRead: false }
];

export const initialAuditLogs: AuditLog[] = [
  { id: 'LOG-001', action: 'Patient Registration', actorName: 'Dhami PHC Registry Desk', actorRole: 'hospital', details: 'Created ABHA record for Amit Singh (abhaId: 54-9876-5432-1098)', timestamp: '2026-08-21T09:12:00Z' },
  { id: 'LOG-002', action: 'Referral Created', actorName: 'Dr. Ramesh Chauhan', actorRole: 'doctor', details: 'Created Outbound Referral R-701 to Shimla District Hospital for Rajesh Kumar', timestamp: '2026-08-20T10:45:00Z' },
  { id: 'LOG-003', action: 'Medicine Stock Update', actorName: 'District Hospital Pharmacy', actorRole: 'hospital', details: 'Issued 60 Metformin tablets. Stock dropped below critical threshold (12 left)', timestamp: '2026-08-24T14:22:00Z' },
  { id: 'LOG-004', action: 'Ambulance 108 Dispatch', actorName: 'Emergency Dispatch Desk', actorRole: 'admin', details: 'Dispatched Unit HP-01-A-108 to Dhami Village for Rajesh Kumar', timestamp: '2026-08-26T08:30:00Z' }
];

export const initialAmbulances: AmbulanceUnit[] = [
  { id: 'AMB-101', vehicleNo: 'HP-01-A-108', driverName: 'Vikram Thakur', driverPhone: '+91 98160 11223', stationFacilityName: 'Dhami Rural PHC', type: 'ALS Emergency', status: 'Dispatched', activePatientName: 'Rajesh Kumar (Angina Triage)', etaMins: 8 },
  { id: 'AMB-102', vehicleNo: 'HP-02-B-108', driverName: 'Suresh Verma', driverPhone: '+91 94180 44556', stationFacilityName: 'Sunni Community CHC', type: 'BLS Ambulance', status: 'Available', etaMins: 0 },
  { id: 'AMB-103', vehicleNo: 'HP-03-C-108', driverName: 'Rakesh Sharma', driverPhone: '+91 88942 77889', stationFacilityName: 'Shimla District General Hospital', type: 'ALS Emergency', status: 'En-Route Hospital', activePatientName: 'Priya Sharma (Maternal Transit)', etaMins: 14 },
  { id: 'AMB-104', vehicleNo: 'HP-04-D-108', driverName: 'Kuldeep Singh', driverPhone: '+91 98055 33445', stationFacilityName: 'IGMC Specialist Hospital', type: 'Mobile PHC Response', status: 'Available', etaMins: 0 },
];
