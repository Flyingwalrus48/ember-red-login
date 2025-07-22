// src/components/GlobalLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation'; // Correctly imports the navigation bar

const GlobalLayout = () => {
  const bottomNavHeight = '64px'; // Or whatever your nav bar's height is

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: bottomNavHeight }}
      >
        <Outlet />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default GlobalLayout;