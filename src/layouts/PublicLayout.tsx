import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Globe, Shield, HeartPulse, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { HealthcareBackground } from '../components/HealthcareBackground';


export const PublicLayout: React.FC = () => {
  const { user, switchRole, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(true);

  const navigation = [
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.doctors'), href: '/doctors' },
    { name: t('nav.hospitals'), href: '/hospitals' },
    { name: t('nav.emergency'), href: '/emergency' },
    { name: t('nav.about'), href: '/about' },
  ];

  const rolesList: { role: UserRole; label: string; icon: string; desc: string }[] = [
    { role: 'patient', label: 'Patient Portal', icon: '👨‍🌾', desc: 'Book consultations, view ABHA & journey' },
    { role: 'doctor', label: 'Doctor Portal', icon: '👨‍⚕️', desc: 'Consult, prescribe, and write referrals' },
    { role: 'hospital', label: 'Hospital Portal', icon: '🏥', desc: 'Beds, inventory stock, inbound referrals' },
    { role: 'admin', label: 'Admin Desk', icon: '👩‍💼', desc: 'Audit logs, register verifying authorities' }
  ];

  const handleQuickSwitch = (role: UserRole) => {
    switchRole(role);
    navigate(`/portal/${role}`);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200 relative overflow-hidden">
      <HealthcareBackground />
      {/* Quick Access Portal Switcher Bar */}
      {showRoleSwitcher && (
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white py-2 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-medium flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> 
              <span><strong>Testing Simulation Bar:</strong> Directly jump into any portal role to test the journey:</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {rolesList.map(r => (
                <button
                  key={r.role}
                  onClick={() => handleQuickSwitch(r.role)}
                  className={`px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-all font-semibold flex items-center gap-1 ${
                    user?.role === r.role ? 'ring-2 ring-white bg-white/20' : ''
                  }`}
                >
                  <span>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              ))}
              <button 
                onClick={() => setShowRoleSwitcher(false)}
                className="ml-2 hover:opacity-80"
                title="Hide simulation bar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2.5">
                <div className="h-9 w-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs shadow-rose-500/20">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {t('landing.title')}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-rose-600 dark:text-rose-400 border-b-2 border-rose-600 dark:border-rose-400 font-bold py-1' 
                        : 'text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="p-2 rounded-lg text-slate-500 hover:text-medical-600 dark:text-slate-400 dark:hover:text-medical-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                title="Toggle Language"
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">{language}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 hover:text-medical-600 dark:text-slate-400 dark:hover:text-medical-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/portal/${user.role}`)}
                    leftIcon={<span>{user.avatar}</span>}
                  >
                    {t('nav.dashboard')}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => { logout(); navigate('/'); }}>
                    {t('nav.logout')}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      {t('nav.login')}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">
                      {t('nav.register')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              {/* Mobile Language Button */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="p-1 text-slate-500 dark:text-slate-400"
              >
                <Globe className="h-4 w-4 inline mr-1" />
                <span className="text-xs font-bold uppercase">{language}</span>
              </button>
              
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1 text-slate-500 dark:text-slate-400"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-500 hover:text-medical-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-3 shadow-lg transition-all">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-medical-600 dark:hover:text-medical-400"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="border-t border-slate-100 dark:border-slate-850 pt-3">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400">
                    <span>{user.avatar}</span>
                    <span className="font-semibold">{user.name}</span>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="primary"
                    onClick={() => {
                      navigate(`/portal/${user.role}`);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Go to Portal Dashboard
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      logout();
                      navigate('/');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('nav.logout')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" variant="outline">{t('nav.login')}</Button>
                  </Link>
                  <Link to="/register" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" variant="primary">{t('nav.register')}</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Quick switcher in mobile menu */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <p className="text-xs font-semibold text-slate-400 mb-2 px-3 uppercase">Direct Portal Switch (Mock)</p>
              <div className="grid grid-cols-2 gap-2 px-2">
                {rolesList.map(r => (
                  <button
                    key={r.role}
                    onClick={() => handleQuickSwitch(r.role)}
                    className="text-xs py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-left bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 hover:bg-medical-50 dark:hover:bg-medical-950/20"
                  >
                    <span>{r.icon}</span>
                    <span>{r.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                  <HeartPulse className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold text-white tracking-wide">
                  {t('landing.title')}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Empowering tier-structured health assistants connecting primary centers, district hubs, and super specialists across India.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Portals</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => handleQuickSwitch('patient')} className="hover:text-white transition-colors">Patient Health Desk</button></li>
                <li><button onClick={() => handleQuickSwitch('doctor')} className="hover:text-white transition-colors">Doctor E-Consult Portal</button></li>
                <li><button onClick={() => handleQuickSwitch('hospital')} className="hover:text-white transition-colors">Hospital Bed & Referral Desk</button></li>
                <li><button onClick={() => handleQuickSwitch('admin')} className="hover:text-white transition-colors">National Admin Dashboard</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">India Digital Health</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://abdm.gov.in/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">ABDM Guidelines</a></li>
                <li><Link to="/about" className="hover:text-white transition-colors">ABHA Registry Card</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Healthcare Tiers in India</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">PM-JAY Scheme Info</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-850 mt-10 pt-6 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 Abhimanyu Health Assistants Platform. Ministry of Health & Family Welfare, Govt of India simulation.</p>
            <p>Designed for Abhimanyu Health Assistants Mission</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
