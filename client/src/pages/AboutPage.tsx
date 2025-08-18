import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GameNav from "@/components/layout/GameNav";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
}

export default function AboutPage() {
  const teamMembers: TeamMember[] = [
    {
      name: "JEVERLY RUTH AMOY CABINTO",
      role: "Lead Developer",
      bio: "",
      photoUrl: "/images/team/3.jpg"
    },
    {
      name: "HARRY ANN MARIELLE ALJAS FAGEL",
      role: "UI/UX Designer",
      bio: "",
      photoUrl: "/images/team/2.jpg"
    },
    {
      name: "MARK ANDRE ACUAR",
      role: "Content Specialist",
      bio: "",
      photoUrl: "/images/team/IMG_20250819_100000.jpg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <GameNav />
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img 
              src="https://placehold.co/1200x300/FF5722/FFFFFF/svg?text=About+Us"
              alt="About Us Banner" 
              className="w-full h-48 md:h-64 object-cover" 
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h1 className="font-bangers text-4xl md:text-5xl text-white text-center">About APULA</h1>
            </div>
          </div>
          
          <div className="p-6">
            <section className="mb-10">
              <motion.h2 
                className="font-bangers text-3xl text-[#FF5722] mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                Our Mission
              </motion.h2>
              <div className="bg-[#FF5722]/10 rounded-xl p-6 border-l-4 border-[#FF5722]">
                <p className="text-gray-700 leading-relaxed">
                  APULA is dedicated to making fire safety education engaging, accessible, and fun for children of all ages. We believe that by turning important safety lessons into interactive adventures, children will not only learn critical skills but will retain and apply them in real-world situations.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Our mission is to empower the next generation with the knowledge and confidence to prevent fires, respond appropriately to fire emergencies, and help create safer homes and communities.
                </p>
              </div>
            </section>
            
            <section className="mb-10">
              <motion.h2 
                className="font-bangers text-3xl text-[#2196F3] mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Our Vision
              </motion.h2>
              <div className="bg-[#2196F3]/10 rounded-xl p-6 border-l-4 border-[#2196F3]">
                <p className="text-gray-700 leading-relaxed">
                  We envision a world where every child has access to high-quality fire safety education that's both engaging and effective. Through our gamified learning platform, we aim to significantly reduce fire-related accidents involving children and empower them to become safety advocates in their homes and communities.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  By combining cutting-edge educational techniques with fun, interactive gameplay, we're creating a new paradigm for safety education that can be applied to schools, homes, and community centers worldwide.
                </p>
              </div>
            </section>
            
            <section className="mb-10">
              <motion.h2 
                className="font-bangers text-3xl text-[#4CAF50] mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                About the Game
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#4CAF50]/10 rounded-xl p-6 border-l-4 border-[#4CAF50]">
                  <h3 className="font-fredoka text-xl text-gray-800 mb-2">Educational Foundation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    APULA is built on a solid educational foundation, with each mission and mini-game carefully designed to teach specific fire safety concepts. We work closely with fire safety professionals and childhood education experts to ensure our content is accurate, age-appropriate, and effective.
                  </p>
                </div>
                
                <div className="bg-[#9C27B0]/10 rounded-xl p-6 border-l-4 border-[#9C27B0]">
                  <h3 className="font-fredoka text-xl text-gray-800 mb-2">Engagement Through Gamification</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our approach uses gamification principles to transform important but potentially dry safety information into exciting adventures. Through character customization, point systems, badges, and progressive challenges, we maintain children's interest while reinforcing critical safety lessons.
                  </p>
                </div>
                
                <div className="bg-[#FFC107]/10 rounded-xl p-6 border-l-4 border-[#FFC107] md:col-span-2">
                  <h3 className="font-fredoka text-xl text-gray-800 mb-2">Family-Centered Learning</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We believe that fire safety is a family affair. That's why our platform includes features that encourage parents and children to learn together, create home safety plans as a team, and practice emergency procedures together. By involving the whole family, we reinforce the lessons and create a shared understanding of fire safety.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <motion.h2 
                className="font-bangers text-3xl text-[#E91E63] mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Meet Our Team
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                  <motion.div 
                    key={member.name}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                    whileHover={{ translateY: -10 }}
                  >
                    <img 
                      src={member.photoUrl} 
                      alt={member.name} 
                      className="w-full h-48 object-cover" 
                    />
                    <div className="p-4">
                      <h3 className="font-fredoka text-xl text-gray-800">{member.name}</h3>
                      <div className="text-[#E91E63] font-medium mb-2">{member.role}</div>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}