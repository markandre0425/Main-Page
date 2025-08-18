import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GameNav from "@/components/layout/GameNav";
import HeroSection from "@/components/home/HeroSection";
import MissionSection from "@/components/home/MissionSection";
import MiniGamesSection from "@/components/home/MiniGamesSection";
import PersonalStats from "@/components/home/PersonalStats";
import QuickSafetyTips from "@/components/home/QuickSafetyTips";
import RecentAchievements from "@/components/home/RecentAchievements";

export default function Home() {
  return (
    <div id="app" className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <GameNav />
        <HeroSection />
        <PersonalStats />
        <QuickSafetyTips />
        <RecentAchievements />
        <MissionSection />
        <MiniGamesSection />
      </main>
      
      <Footer />
    </div>
  );
}
