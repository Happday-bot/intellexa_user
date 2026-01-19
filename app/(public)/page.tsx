import { Hero } from "@/app/components/home/Hero";
import { Activities } from "@/app/components/home/Activities";
import { CoreMembers } from "@/app/components/home/CoreMembers";
import { Contact } from "@/app/components/home/Contact";
import { Achievements } from "@/app/components/home/Achievements";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-dark text-text-main selection:bg-primary/30">
      <Hero />
      <Achievements />
      <Activities />
      <CoreMembers />
      <Contact />
    </main>
  );
}
