import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-950 font-sans text-neutral-100 selection:bg-teal-500/30">
      <Sidebar />
      <div className="flex-1 flex flex-col relative h-full">
        {/* We absolutely position the TopNav so it floats over the 3D map */}
        <div className="absolute top-0 w-full z-50 pointer-events-none">
          <TopNav />
        </div>
        
        {/* The main content area takes the full space underneath */}
        <main className="flex-1 w-full h-full relative overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
