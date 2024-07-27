import React, { Suspense } from 'react';
import { ScrollArea } from '~/components/ui/scroll-area';
import Footer from './components/Footer';
import Header from './components/Header';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid h-dvh grid-cols-1 grid-rows-[auto_1fr_auto] gap-3 p-2">
      <Header />
      <Suspense
        fallback={
          <div className="grid h-full place-content-center">Loading...</div>
        }
      >
        <ScrollArea className="h-full ">{children}</ScrollArea>
      </Suspense>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
