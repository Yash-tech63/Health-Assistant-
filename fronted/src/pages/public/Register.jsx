import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthStore } from '../../context/HealthStoreContext';
import { useAuth } from '../../context/AuthContext';

import { Card, CardBody } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Alert } from '../../components/Alert';

export const Register = () => {
    const { createPatient } = useHealthStore();
    const { registerReal } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');

    // FIX: Backend-compatible blood group
    const [bloodGroup, setBloodGroup] = useState('O+');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);

    // =========================
    // FORMAT PHONE NUMBER
    // =========================

    const formatPhoneNumber = (phoneNumber) => {
        const cleanPhone = phoneNumber.replace(/\D/g, '');

        if (cleanPhone.length === 10) {
            return `+91${cleanPhone}`;
        }

        if (
            cleanPhone.length === 12 &&
            cleanPhone.startsWith('91')
        ) {
            return `+${cleanPhone}`;
        }

        return phoneNumber.trim();
    };

    // =========================
    // AGE TO DATE OF BIRTH
    // =========================

    const calculateDateOfBirth = () => {
        const today = new Date();

        const birthDate = new Date(
            today.getFullYear() - Number(age),
            today.getMonth(),
            today.getDate()
        );

        return birthDate.toISOString().split('T')[0];
    };

    // =========================
    // STEP 1 VALIDATION
    // =========================

    const handleNextStep = (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter your full name.');
            return;
        }

        if (!age || Number(age) < 1 || Number(age) > 120) {
            setError('Please enter a valid age.');
            return;
        }

        const cleanPhone = phone.replace(/\D/g, '');

        if (
            cleanPhone.length !== 10 &&
            !(
                cleanPhone.length === 12 &&
                cleanPhone.startsWith('91')
            )
        ) {
            setError('Please enter a valid phone number.');
            return;
        }

        if (!location.trim()) {
            setError('Please enter your location.');
            return;
        }

        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setStep(2);
    };

    // =========================
    // REGISTER API CALL
    // =========================

    const handleFinalize = async () => {
        setLoading(true);
        setError('');

        try {
            const formattedPhone = formatPhoneNumber(phone);

            // =========================
            // FINAL BACKEND PAYLOAD
            // =========================

            const registrationPayload = {
                name: name.trim(),
                fullName: name.trim(),

                phone: formattedPhone,

                password: password,
                confirmPassword: confirmPassword,

                role: 'patient',

                dateOfBirth: calculateDateOfBirth(),

                gender: gender.toLowerCase(),

                // FIX:
                // Sends A+, B+, O+, AB+ directly
                bloodGroup: bloodGroup,

                address: {
                    city: location.trim()
                },

                preferredLanguage: 'hi'

                // IMPORTANT:
                // preferredCommunication REMOVED
                // Backend rejected "phone"
            };

            console.log(
                'FINAL PAYLOAD:',
                JSON.stringify(registrationPayload, null, 2)
            );

            // BACKEND API CALL
            const response = await registerReal(
                registrationPayload
            );

            console.log(
                'REGISTRATION SUCCESS:',
                response
            );

            // SAVE LOCAL DATA
            if (createPatient) {
                createPatient({
                    name: name.trim(),
                    age: Number(age),
                    gender: gender,
                    phone: formattedPhone,
                    location: location.trim(),
                    bloodGroup: bloodGroup
                });
            }

            // REDIRECT OTP PAGE
            navigate('/verify-otp', {
                state: {
                    phone: formattedPhone,
                    user:
                        response?.data?.user ||
                        response?.user ||
                        null
                }
            });

        } catch (err) {

            console.error(
                'REGISTRATION ERROR:',
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                'Registration failed. Please try again.';

            setError(message);
            setStep(1);

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // BACK BUTTON
    // =========================

    const handleBack = () => {
        setError('');
        setStep(1);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">

            <div className="text-center max-w-2xl mx-auto space-y-2">

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    Register for ABHA Health Account
                </h1>

                <p className="text-xs sm:text-sm text-slate-500">
                    Create your digital health record profile.
                </p>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                <div className="lg:col-span-5">

                    <Card className="shadow-lg border-t-4 border-t-emerald-600">

                        <CardBody className="space-y-6">

                            {error && (
                                <Alert type="error">
                                    {error}
                                </Alert>
                            )}

                            {step === 1 ? (

                                <form
                                    onSubmit={handleNextStep}
                                    className="space-y-4"
                                >

                                    <Input
                                        id="reg-name"
                                        label="Full Name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="e.g. Varsha Rani"
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-4">

                                        <Input
                                            id="reg-age"
                                            label="Age"
                                            type="number"
                                            min="1"
                                            max="120"
                                            value={age}
                                            onChange={(e) =>
                                                setAge(e.target.value)
                                            }
                                            placeholder="e.g. 21"
                                            required
                                        />

                                        <div>

                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                                Gender
                                            </label>

                                            <select
                                                value={gender}
                                                onChange={(e) =>
                                                    setGender(e.target.value)
                                                }
                                                className="w-full text-sm rounded-lg border border-slate-300 p-2.5"
                                            >
                                                <option value="Male">
                                                    Male
                                                </option>

                                                <option value="Female">
                                                    Female
                                                </option>

                                                <option value="Other">
                                                    Other
                                                </option>
                                            </select>

                                        </div>

                                    </div>

                                    <div className="grid grid-cols-2 gap-4">

                                        <Input
                                            id="reg-phone"
                                            label="Phone Number"
                                            placeholder="9876543210"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                            required
                                        />

                                        <div>

                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                                Blood Group
                                            </label>

                                            <select
                                                value={bloodGroup}
                                                onChange={(e) =>
                                                    setBloodGroup(e.target.value)
                                                }
                                                className="w-full text-sm rounded-lg border border-slate-300 p-2.5"
                                            >

                                                {/* FIXED VALUES */}

                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>

                                            </select>

                                        </div>

                                    </div>

                                    <Input
                                        id="reg-location"
                                        label="District Location (City/Village)"
                                        placeholder="e.g. Bhopal"
                                        value={location}
                                        onChange={(e) =>
                                            setLocation(e.target.value)
                                        }
                                        required
                                    />

                                    <Input
                                        id="reg-password"
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter password"
                                        required
                                    />

                                    <Input
                                        id="reg-confirm-password"
                                        label="Confirm Password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        placeholder="Confirm password"
                                        required
                                    />

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full font-bold py-3"
                                    >
                                        Continue Registration
                                    </Button>

                                </form>

                            ) : (

                                <div className="space-y-6 text-center">

                                    <div className="mx-auto h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl">
                                        🏥
                                    </div>

                                    <div>

                                        <h3 className="font-bold text-lg">
                                            Confirm Registration
                                        </h3>

                                        <p className="text-sm text-slate-500">
                                            OTP will be sent to your registered mobile number.
                                        </p>

                                    </div>

                                    <div className="bg-emerald-700 text-white rounded-xl p-5 text-left space-y-3">

                                        <div>
                                            <p className="text-xs opacity-70">
                                                Name
                                            </p>

                                            <p className="font-bold">
                                                {name}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs opacity-70">
                                                Phone
                                            </p>

                                            <p className="font-bold">
                                                {formatPhoneNumber(phone)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs opacity-70">
                                                Blood Group
                                            </p>

                                            <p className="font-bold">
                                                {bloodGroup}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs opacity-70">
                                                Location
                                            </p>

                                            <p className="font-bold">
                                                {location}
                                            </p>
                                        </div>

                                    </div>

                                    <Button
                                        variant="primary"
                                        className="w-full font-bold py-3"
                                        isLoading={loading}
                                        onClick={handleFinalize}
                                    >
                                        Register & Send OTP
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={handleBack}
                                        disabled={loading}
                                    >
                                        Back to Edit Details
                                    </Button>

                                </div>

                            )}

                        </CardBody>

                    </Card>

                </div>

                <div className="lg:col-span-7">

                    <div className="bg-slate-900 text-white p-8 rounded-3xl">

                        <Badge color="success">
                            ℹ️ About Abhimanyu Health
                        </Badge>

                        <h2 className="text-2xl font-bold mt-4">
                            India's Digital Healthcare Platform
                        </h2>

                        <p className="text-sm text-slate-300 mt-3">
                            Abhimanyu Health connects patients, doctors,
                            healthcare workers and healthcare facilities
                            through a unified digital platform.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};