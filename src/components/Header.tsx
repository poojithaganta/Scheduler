import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-brand-700' : 'text-gray-600 hover:text-gray-900'}`;

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="container-px mx-auto">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-brand-700">TARDUS Inc</Link>
          <nav className="hidden sm:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/job-application" className={navLinkClass}>Careers</NavLink>
            <NavLink to="/event" className={navLinkClass}>Events</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

