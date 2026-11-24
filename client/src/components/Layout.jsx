import AmbientBackground from './AmbientBackground.jsx';
import Navbar from './Navbar.jsx';

/**
 * Global shell layout containing the live ambient background,
 * sticky glass navbar, and centered responsive main container.
 */
export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <AmbientBackground />
      <Navbar />
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {children}
      </main>
    </div>
  );
}
