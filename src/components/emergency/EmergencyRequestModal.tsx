import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import { MapPin, Loader2, Check, AlertTriangle, Phone, User, ShieldAlert } from 'lucide-react';

export interface AmbulanceFormData {
  patientName: string;
  mobileNumber: string;
  emergencyType: string;
  description: string;
  pickupLocation: string;
}

interface EmergencyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: AmbulanceFormData & { requestId: string }) => void;
}

export const EmergencyRequestModal: React.FC<EmergencyRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<AmbulanceFormData>({
    patientName: '',
    mobileNumber: '',
    emergencyType: '',
    description: '',
    pickupLocation: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'confirm' | 'loading'>('form');

  const emergencyTypes = [
    'Accident',
    'Serious Injury',
    'Breathing Difficulty',
    'Chest Pain',
    'Unconscious Patient',
    'Severe Illness',
    'Other',
  ];

  const handleInputChange = (field: keyof AmbulanceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleUseCurrentLocation = () => {
    setLocating(true);
    setLocationMessage('Detecting location...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocating(false);
          const detected = `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)} (Dhami Sector 4)`;
          setFormData((prev) => ({ ...prev, pickupLocation: detected }));
          setLocationMessage('Location detected successfully');
          if (errors.pickupLocation) {
            setErrors((prev) => ({ ...prev, pickupLocation: '' }));
          }
        },
        (error) => {
          setLocating(false);
          setLocationMessage('Unable to access your location. Please enter the pickup location manually.');
        },
        { timeout: 8000 }
      );
    } else {
      setLocating(false);
      setLocationMessage('Unable to access your location. Please enter the pickup location manually.');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required.';
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required.';
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Enter a valid mobile number.';
    }
    if (!formData.emergencyType) {
      newErrors.emergencyType = 'Please select an emergency type.';
    }
    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('confirm');
    }
  };

  const handleConfirmSubmission = () => {
    setStep('loading');
    setIsSubmitting(true);

    // Simulate dispatch processing
    setTimeout(() => {
      setIsSubmitting(false);
      const reqId = `#AMB-${Math.floor(1000 + Math.random() * 9000)}`;
      onSuccess({ ...formData, requestId: reqId });
      setStep('form');
      setFormData({
        patientName: '',
        mobileNumber: '',
        emergencyType: '',
        description: '',
        pickupLocation: '',
      });
      onClose();
    }, 2200);
  };

  const handleResetModal = () => {
    setStep('form');
    setErrors({});
    setLocationMessage(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetModal}
      title="🚑 Request Emergency Ambulance"
      size="lg"
    >
      <div className="space-y-6">
        <p className="text-xs text-slate-500">
          Provide the emergency details below so assistance can be arranged immediately.
        </p>

        {step === 'loading' && (
          <div className="py-12 text-center space-y-4">
            <div className="relative inline-block">
              <span className="absolute -inset-4 rounded-full bg-rose-500/20 animate-ping" />
              <div className="relative h-16 w-16 rounded-full bg-rose-600 text-white flex items-center justify-center text-3xl shadow-xl mx-auto">
                🚑
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-rose-600" />
                <span>Finding the nearest available ambulance...</span>
              </h3>
              <p className="text-xs text-slate-500">
                Contacting central dispatch unit & matching nearest available driver.
              </p>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-sm">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                Please Verify Emergency Details
              </span>
              <p className="leading-relaxed">
                Please verify the patient details, emergency type and pickup location before requesting an ambulance.
              </p>
            </div>

            {/* Summary Review */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Patient Name</span>
                <strong className="text-slate-900 dark:text-white">{formData.patientName}</strong>
              </div>

              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Mobile Number</span>
                <strong className="text-slate-900 dark:text-white">{formData.mobileNumber}</strong>
              </div>

              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Emergency Type</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                  {formData.emergencyType}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Pickup Location</span>
                <strong className="text-slate-900 dark:text-white text-right truncate max-w-[220px]">
                  {formData.pickupLocation}
                </strong>
              </div>

              {formData.description && (
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Description</span>
                  <span className="text-slate-700 dark:text-slate-300 text-right truncate max-w-[220px]">
                    {formData.description}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setStep('form')}>
                Back / Edit
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmSubmission}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 font-bold"
              >
                🚑 CONFIRM AMBULANCE REQUEST
              </Button>
            </div>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleNextToConfirm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Patient Name */}
              <Input
                label="Patient Name *"
                placeholder="Enter patient name"
                value={formData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                error={errors.patientName}
                leftIcon={<User className="h-4 w-4 text-slate-400" />}
              />

              {/* Mobile Number */}
              <Input
                label="Mobile Number *"
                placeholder="Enter mobile number"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                error={errors.mobileNumber}
                leftIcon={<Phone className="h-4 w-4 text-slate-400" />}
              />
            </div>

            {/* Emergency Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Emergency Type *
              </label>
              <select
                value={formData.emergencyType}
                onChange={(e) => handleInputChange('emergencyType', e.target.value)}
                className={`
                  w-full px-3.5 py-2.5 rounded-xl text-xs font-medium 
                  bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 
                  border ${errors.emergencyType ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} 
                  focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition-colors
                `}
              >
                <option value="">-- Select Emergency Type --</option>
                {emergencyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.emergencyType && (
                <p className="text-[10px] font-bold text-red-500 mt-1">{errors.emergencyType}</p>
              )}
            </div>

            {/* Pickup Location & Geolocation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pickup Location *
                </label>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={locating}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  {locating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5" />
                  )}
                  <span>📍 Use My Current Location</span>
                </button>
              </div>

              <Input
                placeholder="Enter pickup location address or landmark..."
                value={formData.pickupLocation}
                onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                error={errors.pickupLocation}
                leftIcon={<MapPin className="h-4 w-4 text-slate-400" />}
              />

              {locationMessage && (
                <p
                  className={`text-[10px] font-semibold mt-1 flex items-center gap-1 ${
                    locationMessage.includes('Unable')
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {locationMessage.includes('Unable') ? (
                    <AlertTriangle className="h-3 w-3" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                  <span>{locationMessage}</span>
                </p>
              )}
            </div>

            {/* Emergency Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Emergency Description (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Briefly describe the emergency condition or symptoms..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition-colors resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="secondary" onClick={handleResetModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 font-bold"
              >
                Proceed to Review
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
