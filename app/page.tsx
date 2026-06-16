import Clients from "@/components/Clients";
import TechNura from "@/components/TechNura";
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
    <main className="relative flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="relative z-10 max-w-7xl w-full">
        <FloatingNav 
         navItems={navItems}
        />
        <Hero />
        <Grid />
        <TechnologiesSection />
        <RecentProjects />
        <Clients />
        <TechNura />
        <Experience />
        <Footer />
      </div>
    </main>
  );
}
