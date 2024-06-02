import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid h-screen grid-cols-1 grid-rows-[auto_1fr_auto] p-2">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
