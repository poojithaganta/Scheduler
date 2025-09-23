import { Link, NavLink } from 'react-router-dom';

export function Header() {
  const linkBase = 'px-3 py-2 rounded-md text-sm font-medium';
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-700">TARDUS</Link>
          <nav className="space-x-1">
            <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}>Home</NavLink>
            <NavLink to="/job-application" className={({ isActive }) => `${linkBase} ${isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}>Careers</NavLink>
            <NavLink to="/event" className={({ isActive }) => `${linkBase} ${isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}>Events</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}


