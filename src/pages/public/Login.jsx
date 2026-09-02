import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardBody } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Key, User } from 'lucide-react';
import { Alert } from '../../components/Alert';
export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('patient');
    const [email, setEmail] = useState('patient@swasthya.in');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const roleDetails = {
        patient: { label: 'Patient Desk', email: 'patient@swasthya.in', avatar: '👨‍🌾', desc: 'Rajesh Kumar (ABHA cardholder)' },
        doctor: { label: 'Doctor E-Consult', email: 'doctor@swasthya.in', avatar: '👨‍⚕️', desc: 'Dr. Arvind Sharma (Cardiologist)' },
        hospital: { label: 'Hospital Admissions', email: 'hospital@swasthya.in', avatar: '🏥', desc: 'Shimla District Hospital Desk' },
        admin: { label: 'National Authority', email: 'admin@swasthya.in', avatar: '👩‍💼', desc: 'Central Health Director' }
    };
    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setEmail(roleDetails[role].email);
        setError('');
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setTimeout(() => {
            const success = login(email, selectedRole);
            setLoading(false);
            if (success) {
                navigate(`/portal/${selectedRole}`);
            }
            else {
                setError('Invalid credentials for the selected portal role.');
            }
        }, 800);
    };
    return (<div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Sign In to Swasthya Portal</h1>
        <p className="text-xs text-slate-500">
          Enter mock credentials or select a pre-configured role profile card to simulate clinical access.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardBody className="space-y-6">
          {error && <Alert type="error">{error}</Alert>}

          {/* Role selector tiles */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Portal Role</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(roleDetails).map(r => (<button key={r} type="button" onClick={() => handleRoleSelect(r)} className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center gap-2 ${selectedRole === r
                ? 'border-medical-500 bg-medical-50/30 dark:bg-medical-950/20 ring-1 ring-medical-500'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850'}`}>
                  <span className="text-2xl">{roleDetails[r].avatar}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white leading-tight">{roleDetails[r].label}</p>
                    <p className="text-[9px] text-slate-450 truncate">{roleDetails[r].desc.split(' ')[0]}</p>
                  </div>
                </button>))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="login-email" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. patient@swasthya.in" leftIcon={<User className="h-4 w-4"/>} required/>
            
            <Input id="login-password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" leftIcon={<Key className="h-4 w-4"/>} required/>

            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-[10px] text-slate-500">
              💡 <strong>Developer Hint:</strong> Password is standard <code>password</code> or any input for the simulation.
            </div>

            <Button type="submit" className="w-full" isLoading={loading} variant="primary">
              Sign In to {roleDetails[selectedRole].label}
            </Button>
          </form>

        </CardBody>
      </Card>

    </div>);
};
