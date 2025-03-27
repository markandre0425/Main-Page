import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GameNav from "@/components/layout/GameNav";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, ThumbsUp, Bookmark, Share2, AlertTriangle, Info, Flame, Home, Zap, Car } from "lucide-react";
import { safetyTips } from "@/lib/gameData";

// Categories for safety tips
enum TipCategory {
  ALL = "all",
  PREVENTION = "prevention",
  ESCAPE = "escape",
  EQUIPMENT = "equipment",
  COOKING = "cooking",
  HOME = "home",
  ELECTRICAL = "electrical",
  CHILDREN = "children"
}

export default function SafetyTipsPage() {
  const { userData } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<TipCategory>(TipCategory.ALL);
  const [savedTips, setSavedTips] = useState<number[]>([]);
  
  // Filter tips based on search query and category
  const filteredTips = safetyTips.filter(tip => {
    // Apply search filter
    const matchesSearch = searchQuery === "" || 
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    const matchesCategory = activeCategory === TipCategory.ALL || tip.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Toggle saving a tip
  const toggleSaveTip = (tipId: number) => {
    if (savedTips.includes(tipId)) {
      setSavedTips(savedTips.filter(id => id !== tipId));
    } else {
      setSavedTips([...savedTips, tipId]);
    }
  };
  
  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case TipCategory.PREVENTION: return <Flame className="h-5 w-5" />;
      case TipCategory.ESCAPE: return <AlertTriangle className="h-5 w-5" />;
      case TipCategory.EQUIPMENT: return <Info className="h-5 w-5" />;
      case TipCategory.COOKING: return <Flame className="h-5 w-5" />;
      case TipCategory.HOME: return <Home className="h-5 w-5" />;
      case TipCategory.ELECTRICAL: return <Zap className="h-5 w-5" />;
      case TipCategory.CHILDREN: return <AlertTriangle className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };
  
  // Get color for category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case TipCategory.PREVENTION: return "bg-red-100 text-red-800";
      case TipCategory.ESCAPE: return "bg-yellow-100 text-yellow-800";
      case TipCategory.EQUIPMENT: return "bg-blue-100 text-blue-800";
      case TipCategory.COOKING: return "bg-orange-100 text-orange-800";
      case TipCategory.HOME: return "bg-green-100 text-green-800";
      case TipCategory.ELECTRICAL: return "bg-purple-100 text-purple-800";
      case TipCategory.CHILDREN: return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <GameNav />
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="font-bangers text-4xl text-gray-800">Safety Tips Library</h1>
            </div>
          </div>
          
          {/* Search and filter bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search for safety tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-1/2">
              <Tabs 
                value={activeCategory} 
                onValueChange={(value) => setActiveCategory(value as TipCategory)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 md:grid-cols-8">
                  <TabsTrigger value={TipCategory.ALL}>All</TabsTrigger>
                  <TabsTrigger value={TipCategory.PREVENTION}>Prevention</TabsTrigger>
                  <TabsTrigger value={TipCategory.ESCAPE}>Escape</TabsTrigger>
                  <TabsTrigger value={TipCategory.EQUIPMENT}>Equipment</TabsTrigger>
                  <TabsTrigger value={TipCategory.COOKING}>Cooking</TabsTrigger>
                  <TabsTrigger value={TipCategory.HOME}>Home</TabsTrigger>
                  <TabsTrigger value={TipCategory.ELECTRICAL}>Electrical</TabsTrigger>
                  <TabsTrigger value={TipCategory.CHILDREN}>Children</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Safety tips grid */}
          {filteredTips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTips.map((tip) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <Badge variant="outline" className={`mb-2 ${getCategoryColor(tip.category)} self-start`}>
                        <div className="flex items-center">
                          {getCategoryIcon(tip.category)}
                          <span className="ml-1 capitalize">{tip.category}</span>
                        </div>
                      </Badge>
                      <CardTitle>{tip.title}</CardTitle>
                      <CardDescription>
                        Tip #{tip.id} • {tip.sourceName || "Fire Safety Adventure"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-700 text-sm">{tip.content}</p>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>Helpful</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          <span>Share</span>
                        </Button>
                      </div>
                      <Button
                        variant={savedTips.includes(tip.id) ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => toggleSaveTip(tip.id)}
                      >
                        <Bookmark className="h-4 w-4 mr-1" />
                        <span>{savedTips.includes(tip.id) ? "Saved" : "Save"}</span>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
              <Search className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No safety tips found</h3>
              <p className="text-gray-500 text-center max-w-md">
                We couldn't find any safety tips matching your search criteria. Try adjusting your search or category filter.
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory(TipCategory.ALL);
                }}
              >
                View All Tips
              </Button>
            </div>
          )}
        </div>
        
        {/* Saved tips section */}
        {savedTips.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Bookmark className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="font-bangers text-2xl text-gray-800">Saved Tips</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {safetyTips
                .filter(tip => savedTips.includes(tip.id))
                .map(tip => (
                  <Card key={`saved-${tip.id}`} className="bg-blue-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-700 text-sm line-clamp-2">{tip.content}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => toggleSaveTip(tip.id)}
                      >
                        Remove
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        )}
        
        {/* Resources section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="font-bangers text-2xl text-gray-800 mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              href="https://www.nfpa.org/Public-Education/Staying-safe/Preparedness/Escape-planning" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <Home className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold">Home Escape Planning</h3>
              </div>
              <p className="text-sm text-gray-600">Learn how to create and practice a home fire escape plan</p>
            </a>
            
            <a 
              href="https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/fire.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Red Cross Fire Safety</h3>
              </div>
              <p className="text-sm text-gray-600">Comprehensive fire safety resources from the Red Cross</p>
            </a>
            
            <a 
              href="https://www.usfa.fema.gov/prevention/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold">U.S. Fire Administration</h3>
              </div>
              <p className="text-sm text-gray-600">Fire prevention and safety materials from FEMA</p>
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}