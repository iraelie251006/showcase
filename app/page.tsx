import Clients from "@/components/Clients";
import ComingSoon from "@/components/ComingSoon";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import TechnologiesSection from "@/components/technologies";

import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { navItems } from "@/data";


export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <FloatingNav 
         navItems={navItems}
        />
        <Hero />
        <Grid />
        <TechnologiesSection />
        <RecentProjects />
        <Clients />
        <ComingSoon />
        <Experience />
        <Footer />
      </div>
    </main>
  );
}
