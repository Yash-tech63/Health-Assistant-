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
    const { login, registerReal } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [bloodGroup, setBloodGroup] = useState('O+Pos');
    const [password, setPassword] = useState('Patient@123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    const [generatedAbha, setGeneratedAbha] = useState('');

    const handleNextStep = (e) => {
        e.preventDefault();
        setError('');
        if (!name || !age || !phone || !location) {
            setError('Please fill out all required fields.');
            return;
        }
        const randomBlock = () => Math.floor(1000 + Math.random() * 9000).toString();
        const abha = `91-${randomBlock()}-${randomBlock()}-${randomBlock().slice(0, 2)}`;
        setGeneratedAbha(abha);
        setStep(2);
    };

    const handleFinalize = async () => {
        setLoading(true);
        setError('');
        try {
            // Attempt real Axios registration
            await registerReal({
                name,
                fullName: name,
                phone: phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`,
                password,
                confirmPassword: password,
                role: 'patient',
                dateOfBirth: new Date(Date.now() - (parseInt(age || '30') * 365 * 86400000)).toISOString().split('T')[0],
                gender: gender.toLowerCase(),
                bloodGroup: bloodGroup.replace('Pos', '+').replace('Neg', '-'),
                address: { city: location }
            }).catch(() => {});
        } catch (err) {
            console.warn('Axios Register note:', err.message);
        }

        // Create Patient in health store & log in
        createPatient({
            name,
            age: parseInt(age),
            gender,
            abhaId: generatedAbha,
            phone,
            location,
            bloodGroup
        });

        login(phone || 'patient@swasthya.in', 'patient');
        setLoading(false);
        navigate('/portal/patient');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Register for ABHA Health Account</h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    Create your digital health record profile to secure seamless referrals and track medical prescriptions.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 space-y-6">
                    <Card className="shadow-lg border-t-4 border-t-emerald-600">
                        <CardBody className="space-y-6">
                            {error && <Alert type="error">{error}</Alert>}

                            {step === 1 ? (
                                <form onSubmit={handleNextStep} className="space-y-4">
                                    <Input
                                        id="reg-name"
                                        label="Full Name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g. Ramesh Kumar"
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            id="reg-age"
                                            label="Age"
                                            type="number"
                                            value={age}
                                            onChange={e => setAge(e.target.value)}
                                            placeholder="e.g. 35"
                                            required
                                        />

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gender</label>
                                            <select
                                                value={gender}
                                                onChange={e => setGender(e.target.value)}
                                                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            id="reg-phone"
                                            label="Phone Number"
                                            placeholder="+919876543219"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            required
                                        />

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Blood Group</label>
                                            <select
                                                value={bloodGroup}
                                                onChange={e => setBloodGroup(e.target.value)}
                                                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                                            >
                                                <option value="O+Pos">O +</option>
                                                <option value="O-Neg">O -</option>
                                                <option value="A+Pos">A +</option>
                                                <option value="A-Neg">A -</option>
                                                <option value="B+Pos">B +</option>
                                                <option value="B-Neg">B -</option>
                                                <option value="AB+Pos">AB +</option>
                                                <option value="AB-Neg">AB -</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Input
                                        id="reg-loc"
                                        label="District Location (City/Village)"
                                        placeholder="e.g. Shimla, Himachal Pradesh"
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                        required
                                    />

                                    <Input
                                        id="reg-pass"
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />

                                    <Button type="submit" variant="primary" className="w-full font-bold py-3">
                                        Verify & Generate ABHA Card
                                    </Button>
                                </form>
                            ) : (
                                <div className="space-y-6 text-center">
                                    <div className="mx-auto h-16 w-16 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-600 rounded-full flex items-center justify-center text-3xl">
                                        💳
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">ABHA Health Card Created</h3>
                                        <p className="text-xs text-slate-500">Your health ID card has been issued under the digital mission.</p>
                                    </div>

                                    <div className="bg-gradient-to-tr from-emerald-700 to-teal-800 text-white rounded-2xl p-5 text-left border border-emerald-500/50 shadow-md">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <span className="text-[9px] uppercase font-bold text-white/80 tracking-wider">Government of India</span>
                                                <h4 className="font-extrabold text-sm tracking-tight">{name}</h4>
                                            </div>
                                            <Badge color="secondary" className="bg-white/20 text-white border-transparent text-[8px]">ABHA Card</Badge>
                                        </div>
                                        <div className="mt-6 flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[8px] text-white/60 block leading-none">ABHA Health Account Number</span>
                                                <span className="font-mono text-sm tracking-widest font-bold">{generatedAbha}</span>
                                            </div>
                                            <span className="text-[10px] font-bold bg-white text-slate-900 px-2 py-0.5 rounded uppercase">{bloodGroup.replace('Pos', ' +').replace('Neg', ' -')}</span>
                                        </div>
                                    </div>

                                    <Button variant="primary" className="w-full font-bold py-3" isLoading={loading} onClick={handleFinalize}>
                                        Sign In to Patient Dashboard
                                    </Button>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-lg space-y-4">
                        <Badge color="success" className="px-3 py-1 text-xs">
                            ℹ️ About Abhimanyu Health
                        </Badge>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                            Understanding India's 3-Tier Digital Public Healthcare Grid
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Abhimanyu Health models the three-tier public health model under the Ayushman Bharat Digital Health Mission (ABDM). We connect village centers, block clinics, district hospitals, and super-specialty cath labs on a single diagnostic grid.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-t-4 border-t-teal-500">
                            <CardBody className="p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-teal-50 dark:bg-teal-950/40 text-teal-600 rounded-lg flex items-center justify-center font-bold text-xs">T1</div>
                                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Primary (PHC)</h4>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-normal">
                                    Rural grassroots clinics providing initial check-ups, vaccines, ECG diagnostics, and generating digital referrals.
                                </p>
                            </CardBody>
                        </Card>

                        <Card className="border-t-4 border-t-indigo-500">
                            <CardBody className="p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs">T2</div>
                                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">District (CHC)</h4>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-normal">
                                    Intermediate referral hospitals with inpatient wards, emergency beds, 2D echocardiograms, and specialist clinics.
                                </p>
                            </CardBody>
                        </Card>

                        <Card className="border-t-4 border-t-rose-500">
                            <CardBody className="p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-lg flex items-center justify-center font-bold text-xs">T3</div>
                                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Specialist Tiers</h4>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-normal">
                                    Super-specialty medical research centers (IGMC, AIIMS) with cardiac catheterization units and complex surgeries.
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
