import { Separator } from "@/components/ui/separator";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-8">
          <section>
            <h1 className="text-4xl font-bold text-center text-fire-red mb-2">About APULA</h1>
            <p className="text-xl text-center text-gray-600 mb-8">
              A Web-Based Application to Educate and Empower Residents in Fire Prevention Through Engaging Games
            </p>
            <Separator className="my-8" />
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-fire-red mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              At APULA, we are committed to enhancing fire safety awareness through interactive educational games. 
              Our goal is to empower individuals with the knowledge and skills necessary to prevent and respond 
              effectively to fire emergencies.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-fire-red mb-4">The Problem</h2>
            <p className="text-lg text-gray-700 mb-4">
              Fire incidents remain a major threat to communities worldwide, often stemming from preventable causes. 
              One key issue is the lack of accessible, engaging fire safety education, which results in poor knowledge retention.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Traditional fire safety training can be dull and forgettable, making it difficult for individuals to recall 
              critical information when faced with real emergencies.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-fire-red mb-4">Our Solution</h2>
            <p className="text-lg text-gray-700 mb-6">
              APULA revolutionizes fire safety education through gamification, making learning both fun and impactful. 
              Our platform offers a variety of interactive games designed to teach essential fire prevention concepts 
              while tracking progress and rewarding achievements.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-fire-red mb-4">Meet the Team</h2>
            <p className="text-lg text-gray-700 mb-4">
              APULA was created by a passionate team of three individuals dedicated to making fire safety education engaging and accessible:
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-lg font-medium">🔥 [Name 1] – Lead Developer</p>
                <p className="text-gray-600">Architect of the platform's functionality and interactive features.</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-lg font-medium">🔥 [Name 2] – UI/UX Designer</p>
                <p className="text-gray-600">Ensures a visually appealing and user-friendly experience.</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-lg font-medium">🔥 [Name 3] – Content Specialist</p>
                <p className="text-gray-600">Develops engaging quizzes, games, and educational material.</p>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 italic">
              Together, we strive to make fire safety education effective, fun, and unforgettable.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}