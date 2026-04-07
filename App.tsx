
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CityGrid from './components/CityGrid';
import FeatureSection from './components/FeatureSection';
import UserJourney from './components/UserJourney';
import CanadaSection from './components/CanadaSection';
import Stats from './components/Stats';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import DashboardProfessional from './components/DashboardProfessional';
import DashboardCompany from './components/DashboardCompany';
import LeadFormPage from './components/LeadFormPage';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    // Ouvir mudanças na auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setCurrentPage('home');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
      if (currentPage === 'home') {
        setCurrentPage(data.user_type === 'professional' ? 'dashboard-professional' : 'dashboard-company');
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderContent = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'dashboard-professional':
        return <DashboardProfessional onNavigate={setCurrentPage} profile={profile} />;
      case 'dashboard-company':
        return <DashboardCompany onNavigate={setCurrentPage} profile={profile} />;
      case 'lead':
        return <LeadFormPage onNavigate={setCurrentPage} />;
      default:
        return (
          <>
            <Hero />
            <UserJourney />
            <CityGrid />
            <FeatureSection />
            <CanadaSection />
            <Stats />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-green selection:text-white">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} profile={profile} />
      <main>
        {renderContent()}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;
