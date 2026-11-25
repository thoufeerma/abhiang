import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LoveMeter from "@/components/LoveMeter";
import Meet from "@/components/Meet";
import MusicToggle from "@/components/MusicToggle";
import { StickDefs } from "@/components/Stickman";
import Story from "@/components/Story";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <StickDefs />
      <MusicToggle />
      <Hero />
      <Meet />
      <Story />
      <LoveMeter />
      <Footer />
    </main>
  );
}
