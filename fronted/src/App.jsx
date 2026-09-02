import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { HealthStoreProvider } from './context/HealthStoreContext';
import { AppRouter } from './routes/AppRouter';
import { useState } from 'react';
function App() {
    const [dark, setDark] = useState(false);
    const toggleTheme = () => {
        setDark(!dark);
        document.documentElement.classList.toggle("dark");
    };
    return (<BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <HealthStoreProvider>
              <AppRouter /> 
            </HealthStoreProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>);
}
export default App;
