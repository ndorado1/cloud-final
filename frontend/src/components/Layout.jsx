import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="relative flex min-h-screen w-full">
      {/* SideNavBar */}
      <aside className="flex h-screen w-64 flex-col border-r border-neutral-border/50 bg-white dark:bg-background-dark dark:border-neutral-border/20 p-4 sticky top-0">
        <div className="flex items-center gap-3 p-3">
          <div className="bg-primary/20 rounded-lg p-2 text-primary">
            <span className="material-symbols-outlined text-3xl">medical_services</span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-200">Cloud Final</p>
        </div>
        <div className="flex h-full flex-col justify-between pt-8">
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium leading-normal ${
                isActive('/')
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive('/') ? 'fill' : ''}`}>dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link
              to="/devices"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium leading-normal ${
                isActive('/devices')
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive('/devices') ? 'fill' : ''}`}>biotech</span>
              <p className="text-sm font-medium leading-normal">Devices</p>
            </Link>
          </div>
          <div className="flex flex-col gap-4 border-t border-neutral-border/50 dark:border-neutral-border/20 pt-4">
            <Link
              to="/devices/new"
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90"
            >
              <span className="truncate">New Device</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

