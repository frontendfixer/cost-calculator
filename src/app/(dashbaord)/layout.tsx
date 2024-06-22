import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ScrollArea } from '~/components/ui/scroll-area';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid h-screen grid-cols-1 grid-rows-[auto_1fr_auto] p-2">
      <Header />
      <ScrollArea className="h-full">{children}</ScrollArea>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
