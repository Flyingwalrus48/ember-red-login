// src/components/BottomNavigation.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, User, Map, BrainCircuit, Briefcase } from 'lucide-react';

// This is the list of all your navigation links.
// You can add, remove, or change items here anytime.
const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/path', label: 'PATH', icon: Map },
  { href: '/fireai', label: 'FIREAI', icon: BrainCircuit },
  { href: '/servicedin', label: 'ServicedIn', icon: Briefcase },
  { href: '/quizzes', label: 'Quizzes', icon: ClipboardList },
  { href: '/profile', label: 'Profile', icon: User },
];

const BottomNavigation = () => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-background border-t">
      <div className="flex justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full text-sm font-medium transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`
            }
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;