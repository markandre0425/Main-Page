import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GameNav from "@/components/layout/GameNav";
import HeroSection from "@/components/home/HeroSection";
import MissionSection from "@/components/home/MissionSection";
import MiniGamesSection from "@/components/home/MiniGamesSection";
import AvatarCustomization from "@/components/home/AvatarCustomization";
import SafetyTips from "@/components/home/SafetyTips";
import BadgesCollection from "@/components/home/BadgesCollection";
import FamilyModePromo from "@/components/home/FamilyModePromo";

export default function Home() {
  return (
    <div id="app" className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <GameNav />
        <HeroSection />
        <MissionSection />
        <MiniGamesSection />
        <AvatarCustomization />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <SafetyTips />
          <BadgesCollection />
        </div>
        
        <FamilyModePromo />
      </main>
      
      <Footer />
    </div>
  );
}
