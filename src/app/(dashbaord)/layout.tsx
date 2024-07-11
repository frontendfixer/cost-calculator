import React, { Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid h-screen grid-cols-1 grid-rows-[auto_1fr_auto] p-2">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
