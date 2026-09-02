import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Home, Calendar, FileText, ClipboardList, Pill, MessageSquare, Bot, Settings, LogOut, Sun, Moon, Globe, Menu, X, ArrowLeft, Users, ShieldCheck, HeartPulse, Building2, Bell, ShieldAlert, Video } from 'lucide-react';
import { Badge } from '../components/Badge';
import { HealthcareBackground } from '../components/HealthcareBackground';
export const DashboardLayout = () => {
    const { user, role, logout, switchRole } = useAuth();
    const { language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Referral Status Updated', desc: 'Referral to Shimla District Hospital has been approved.', time: '2 hrs ago', unread: true },
        { id: 2, title: 'New Prescription Uploaded', desc: 'Dr. Arvind Sharma issued Metformin.', time: '1 day ago', unread: false }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);
    // If not logged in, redirect to login
    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    if (!user || !role)
        return null;
    // Sidebar Links based on User Role
    const roleLinks = {
        patient: [
            { label: 'Patient Dashboard', href: '/portal/patient', icon: <Home className="h-5 w-5"/> },
            { label: 'Video Consult 📹', href: '/portal/patient/teleconsult', icon: <Video className="h-5 w-5 text-emerald-500 font-bold"/> },
            { label: 'Emergency Dispatch 🚨', href: '/portal/patient/emergency', icon: <ShieldAlert className="h-5 w-5 text-rose-500 animate-pulse"/> },
            { label: 'Book Consultations', href: '/portal/patient/book', icon: <Calendar className="h-5 w-5"/> },
            { label: 'Medical Records', href: '/portal/patient/records', icon: <FileText className="h-5 w-5"/> },
            { label: 'Prescriptions', href: '/portal/patient/prescriptions', icon: <Pill className="h-5 w-5"/> },
            { label: 'Doctor Chat', href: '/portal/patient/chat', icon: <MessageSquare className="h-5 w-5"/> },
            { label: 'HealthAssist AI Bot', href: '/portal/patient/bot', icon: <Bot className="h-5 w-5 text-emerald-500 animate-bounce"/> },
            { label: 'Portal Settings', href: '/portal/patient/settings', icon: <Settings className="h-5 w-5"/> }
        ],
        doctor: [
            { label: 'Doctor Dashboard', href: '/portal/doctor', icon: <Home className="h-5 w-5"/> },
            { label: 'Video Consult Room 📹', href: '/portal/doctor/teleconsult', icon: <Video className="h-5 w-5 text-emerald-500 font-bold"/> },
            { label: 'Patient Inflow Queue', href: '/portal/doctor/patients', icon: <Users className="h-5 w-5"/> },
            { label: 'Referrals Manager', href: '/portal/doctor/referrals', icon: <ClipboardList className="h-5 w-5"/> },
            { label: 'Schedule Settings', href: '/portal/doctor/schedule', icon: <Calendar className="h-5 w-5"/> }
        ],
        hospital: [
            { label: 'Hospital Dashboard', href: '/portal/hospital', icon: <Building2 className="h-5 w-5"/> },
            { label: 'Pharmacy Inventory', href: '/portal/hospital/inventory', icon: <Pill className="h-5 w-5"/> },
            { label: 'H2H Communication', href: '/portal/hospital/h2h', icon: <MessageSquare className="h-5 w-5"/> }
        ],
        admin: [
            { label: 'Central Admin Panel', href: '/portal/admin', icon: <ShieldCheck className="h-5 w-5"/> },
            { label: 'User Verification Registry', href: '/portal/admin/users', icon: <Users className="h-5 w-5"/> },
            { label: 'System Audit Logs', href: '/portal/admin/audit', icon: <ClipboardList className="h-5 w-5"/> }
        ]
    };
    const handleRoleToggle = (newRole) => {
        switchRole(newRole);
        navigate(`/portal/${newRole}`);
    };
    const links = roleLinks[role];
    return (<div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-200 relative overflow-hidden">
      <HealthcareBackground />
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-850/80 transition-colors z-10">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-850/80">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-xs shadow-rose-500/20">
              <HeartPulse className="h-4 w-4"/>
            </div>
            <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
              Abhimanyu Health
            </span>
          </Link>
        </div>

        {/* User Info Card */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-850/80 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center gap-3">
            {user.avatar && user.avatar.startsWith('http') ? (<img src={user.avatar} alt={user.name} onError={(e) => {
                e.currentTarget.style.display = 'none';
            }} className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"/>) : (<div className="text-2xl bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs shrink-0">
                👨‍⚕️
              </div>)}
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.name}</h4>
              <p className="text-xs text-slate-500 truncate">{user.abhaId || user.specialty || 'Health Officer'}</p>
            </div>
          </div>
          
          <div className="mt-3 flex">
            <Badge color={role === 'patient' ? 'primary' : role === 'doctor' ? 'info' : role === 'hospital' ? 'success' : 'danger'}>
              {role.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (<Link key={link.label} to={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300 font-bold border-l-4 border-rose-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-950 dark:hover:text-slate-200'}`}>
                {link.icon}
                <span>{link.label}</span>
              </Link>);
        })}
        </nav>

        {/* Quick Simulator Switch in Sidebar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-850/80 bg-slate-50/30 dark:bg-slate-900/20">
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Simulate Journey Toggles</label>
          <div className="grid grid-cols-2 gap-1.5">
            {['patient', 'doctor', 'hospital', 'admin'].map(r => (<button key={r} onClick={() => handleRoleToggle(r)} className={`text-[10px] py-1 px-1.5 rounded border text-center transition-all ${role === r
                ? 'bg-medical-600 border-medical-600 text-white font-bold'
                : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                {r.toUpperCase()}
              </button>))}
          </div>
        </div>

        {/* Sidebar Footer Log out */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-850/80">
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all">
            <LogOut className="h-5 w-5"/>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Dashboard Nav */}
        <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850/80 flex items-center justify-between px-4 sm:px-6 transition-colors">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-slate-500 hover:text-medical-600 dark:text-slate-400">
              <Menu className="h-6 w-6"/>
            </button>
            
            <Link to="/" className="text-xs text-slate-500 hover:text-medical-600 dark:text-slate-400 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3"/> Public Website
            </Link>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Notifications Feed */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg text-slate-500 hover:text-medical-600 dark:text-slate-400 dark:hover:text-medical-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors relative">
                <Bell className="h-4.5 w-4.5"/>
                {notifications.some(n => n.unread) && (<span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-ping"/>)}
              </button>

              {showNotifications && (<div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-50">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">System Notifications</span>
                    <button onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))} className="text-[10px] text-medical-600 dark:text-medical-400 hover:underline font-semibold">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map(n => (<div key={n.id} className={`p-3 border-b border-slate-50 dark:border-slate-900 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 ${n.unread ? 'bg-medical-50/20 dark:bg-medical-950/10' : ''}`}>
                        <div className="flex justify-between items-start gap-2 mb-0.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{n.desc}</p>
                      </div>))}
                  </div>
                </div>)}
            </div>

            {/* Language Selection */}
            <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="p-2 rounded-lg text-slate-500 hover:text-medical-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-xs font-bold uppercase">
              <Globe className="h-4.5 w-4.5 inline sm:mr-1"/>
              <span className="hidden sm:inline">{language}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-500 hover:text-medical-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5"/> : <Moon className="h-4.5 w-4.5"/>}
            </button>

            {/* User Mini Profile */}
            <div className="flex items-center gap-2 border-l border-slate-100 dark:border-slate-800 pl-3 sm:pl-4">
              {user.avatar && user.avatar.startsWith('http') ? (<img src={user.avatar} alt={user.name} onError={(e) => {
                e.currentTarget.style.display = 'none';
            }} className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"/>) : (<span className="text-lg">👨‍⚕️</span>)}
              <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                {user.name.split(' ')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Main Outlet (Content) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Drawer Navigation Backdrop */}
      {sidebarOpen && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 md:hidden" onClick={() => setSidebarOpen(false)}/>)}

      {/* Mobile Drawer Navigation Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-850 flex flex-col
        transform transition-transform duration-300 md:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-850">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded bg-gradient-to-tr from-medical-600 to-hospital-600 flex items-center justify-center text-white">
              <HeartPulse className="h-4 w-4"/>
            </div>
            <span className="text-sm font-bold text-slate-850 dark:text-slate-100">Abhimanyu Health</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-6 w-6"/>
          </button>
        </div>

        {/* Mobile User Profile info */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-850/80 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center gap-3">
            {user.avatar && user.avatar.startsWith('http') ? (<img src={user.avatar} alt={user.name} onError={(e) => {
                e.currentTarget.style.display = 'none';
            }} className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"/>) : (<div className="text-3xl bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
                👨‍⚕️
              </div>)}
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{user.name}</h4>
              <p className="text-[10px] text-slate-500 leading-tight">{user.abhaId || user.specialty}</p>
            </div>
          </div>
          <div className="mt-2 flex">
            <Badge color={role === 'patient' ? 'primary' : role === 'doctor' ? 'info' : role === 'hospital' ? 'success' : 'danger'}>
              {role.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Mobile Sidebar links */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (<Link key={link.label} to={link.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                    ? 'bg-medical-50 text-medical-600 dark:bg-medical-950/20 dark:text-medical-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-950 dark:hover:text-slate-200'}`}>
                {link.icon}
                <span>{link.label}</span>
              </Link>);
        })}
        </nav>

        {/* Sidebar Simulator Switch (Mobile) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-850/80 bg-slate-50/30 dark:bg-slate-900/20">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Simulate Journey (Mobile)</label>
          <div className="grid grid-cols-2 gap-1.5">
            {['patient', 'doctor', 'hospital', 'admin'].map(r => (<button key={r} onClick={() => {
                handleRoleToggle(r);
                setSidebarOpen(false);
            }} className={`text-[10px] py-1.5 px-1.5 rounded border text-center transition-all ${role === r
                ? 'bg-medical-600 border-medical-600 text-white font-bold'
                : 'bg-white border-slate-250 dark:bg-slate-900 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}>
                {r.toUpperCase()}
              </button>))}
          </div>
        </div>

        {/* Mobile logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-850/80">
          <button onClick={() => {
            logout();
            navigate('/');
            setSidebarOpen(false);
        }} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all">
            <LogOut className="h-5 w-5"/>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

    </div>);
};
