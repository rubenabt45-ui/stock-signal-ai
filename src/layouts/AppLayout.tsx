
import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNavigation } from '@/components/BottomNavigation';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-tradeiq-navy">
      <main className="pb-16">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
