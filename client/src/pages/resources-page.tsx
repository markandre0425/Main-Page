import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Video, BookOpen, CheckCircle } from "lucide-react";

export default function ResourcesPage() {
  const resources = [
    {
      title: "Fire Prevention Handbook",
      type: "PDF",
      description: "A comprehensive guide to preventing fires at home and in the workplace.",
      link: "https://www.nfpa.org/Public-Education/Staying-safe/Preparedness/Fire-Prevention-Week",
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      tags: ["Prevention", "Home", "Workplace"]
    },
    {
      title: "Creating a Fire Escape Plan",
      type: "Video",
      description: "Learn how to create and practice a home fire escape plan with your family.",
      link: "https://www.youtube.com/watch?v=X_NQEwA7-W0",
      icon: <Video className="h-6 w-6 text-red-500" />,
      tags: ["Escape Plan", "Family", "Children"]
    },
    {
      title: "Fire Safety for Kids",
      type: "Interactive",
      description: "Fun and educational activities to teach children about fire safety.",
      link: "https://sparkyschoolhouse.org/",
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      tags: ["Children", "Education", "Activities"]
    },
    {
      title: "Smoke Alarm Maintenance",
      type: "Guide",
      description: "How to properly install and maintain smoke alarms in your home.",
      link: "https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/fire/smoke-alarm-safety.html",
      icon: <CheckCircle className="h-6 w-6 text-yellow-500" />,
      tags: ["Alarms", "Maintenance", "Home"]
    },
    {
      title: "Fire Extinguisher Types",
      type: "PDF",
      description: "Learn about different types of fire extinguishers and when to use them.",
      link: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.157",
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      tags: ["Extinguishers", "Safety Equipment"]
    },
    {
      title: "Wildfire Preparedness",
      type: "Guide",
      description: "How to prepare your home and family for wildfires.",
      link: "https://www.ready.gov/wildfires",
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      tags: ["Wildfire", "Preparedness", "Evacuation"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-10">
          <h1 className="text-3xl font-baloo font-bold text-dark-navy mb-4">Fire Safety Resources</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explore our collection of trusted resources to enhance your fire safety knowledge.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="border-t-4 border-t-fire-red">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-medium">{resource.title}</CardTitle>
                    {resource.icon}
                  </div>
                  <CardDescription>
                    <Badge variant="outline" className="mr-1 bg-gray-100">
                      {resource.type}
                    </Badge>
                    {resource.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="mr-1">
                        {tag}
                      </Badge>
                    ))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <Button 
                    variant="ghost" 
                    className="w-full text-fire-red hover:text-fire-red/80 hover:bg-red-50 flex items-center justify-center"
                    onClick={() => window.open(resource.link, '_blank')}
                  >
                    View Resource <ExternalLink className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-baloo font-bold text-dark-navy mb-4">Emergency Contacts</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold">Fire Emergency</h3>
                  <p className="text-sm text-muted-foreground">For immediate assistance in case of fire</p>
                </div>
                <div className="text-xl font-bold text-fire-red">911</div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold">Poison Control</h3>
                  <p className="text-sm text-muted-foreground">For poison emergencies</p>
                </div>
                <div className="text-lg font-bold">1-800-222-1222</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Non-Emergency Fire Department</h3>
                  <p className="text-sm text-muted-foreground">For general inquiries and information</p>
                </div>
                <div className="text-lg font-bold">Check local listings</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}