import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// import GameNav from "@/components/layout/GameNav"; // Removed - now integrated into Header
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, ThumbsUp, Bookmark, Share2, AlertTriangle, Info, Flame, Home, Zap, Car, Shield } from "lucide-react";
import { safetyTips } from "@/lib/gameData";
import { SafetyTip } from "@shared/schema";

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
  const [likedTips, setLikedTips] = useState<number[]>([]);
  const [tipAnalytics, setTipAnalytics] = useState<Record<number, number>>({});
  const [showMostUseful, setShowMostUseful] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    const savedLikedTips = localStorage.getItem('likedTips');
    const savedAnalytics = localStorage.getItem('tipAnalytics');
    
    if (savedLikedTips) {
      setLikedTips(JSON.parse(savedLikedTips));
    }
    
    if (savedAnalytics) {
      setTipAnalytics(JSON.parse(savedAnalytics));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('likedTips', JSON.stringify(likedTips));
  }, [likedTips]);

  useEffect(() => {
    localStorage.setItem('tipAnalytics', JSON.stringify(tipAnalytics));
  }, [tipAnalytics]);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);
  
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

  // Toggle like tip
  const toggleLikeTip = (tipId: number) => {
    if (likedTips.includes(tipId)) {
      // Unlike tip - decrement count
      setLikedTips(likedTips.filter(id => id !== tipId));
      setTipAnalytics(prev => ({
        ...prev,
        [tipId]: Math.max((prev[tipId] || 0) - 1, 0) // Don't go below 0
      }));
    } else {
      // Like tip - increment count
      setLikedTips([...likedTips, tipId]);
      setTipAnalytics(prev => ({
        ...prev,
        [tipId]: (prev[tipId] || 0) + 1
      }));
    }
  };

  // Audio functionality
  const playAudio = (tip: SafetyTip) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Use audioUrl from tip data if available, otherwise use default pattern
    const audioUrl = tip.audioUrl || `/audio/safety-tip-${tip.id}.mp3`;
    
    try {
      const audio = new Audio(audioUrl);
      audio.volume = 0.7; // Set volume to 70%
      
      audio.onended = () => {
        setCurrentAudio(null);
      };
      
      audio.onerror = () => {
        console.log(`Audio file not found: ${audioUrl}`);
        setCurrentAudio(null);
      };
      
      setCurrentAudio(audio);
      audio.play();
    } catch (error) {
      console.log(`Error playing audio for tip ${tip.id}:`, error);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
  };

  // Share tip functionality
  const shareTip = async (tip: SafetyTip) => {
    const shareData = {
      title: `${tip.title} - Fire Safety Tip`,
      text: `${tip.title}\n\n${tip.content}\n\nSource: ${tip.sourceName}`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare(tip);
      }
    } else {
      fallbackShare(tip);
    }
  };

  // Fallback sharing method
  const fallbackShare = (tip: SafetyTip) => {
    const shareText = `${tip.title}\n\n${tip.content}\n\nSource: ${tip.sourceName}\n\nLearn more fire safety tips at: ${window.location.href}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Safety tip copied to clipboard! You can now share it anywhere.');
      }).catch(() => {
        // Fallback to text selection
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Safety tip copied to clipboard! You can now share it anywhere.');
      });
    } else {
      // Final fallback - show share text in alert
      alert(`Share this safety tip:\n\n${shareText}`);
    }
  };

  // Get most useful tips based on analytics
  const getMostUsefulTips = () => {
    return safetyTips
      .map(tip => ({
        ...tip,
        likeCount: tipAnalytics[tip.id] || 0
      }))
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 10); // Top 10 most useful tips
  };

  // Get tips to display based on current view
  const getTipsToDisplay = () => {
    if (showMostUseful) {
      return getMostUsefulTips();
    }
    return filteredTips;
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

          {/* View Toggle Buttons */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-lg">
              <Button
                variant={!showMostUseful ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowMostUseful(false)}
                className="mr-1"
              >
                📚 All Tips
              </Button>
              <Button
                variant={showMostUseful ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowMostUseful(true)}
                className="ml-1"
              >
                ⭐ Most Useful Tips
              </Button>
            </div>
          </div>
          
          {/* Safety tips grid */}
          {getTipsToDisplay().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getTipsToDisplay().map((tip) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onMouseEnter={() => playAudio(tip)}
                    onMouseLeave={stopAudio}
                  >
                    <CardHeader className="pb-2">
                      <Badge variant="outline" className={`mb-2 ${getCategoryColor(tip.category)} self-start`}>
                        <div className="flex items-center">
                          {getCategoryIcon(tip.category)}
                          <span className="ml-1 capitalize">{tip.category}</span>
                        </div>
                      </Badge>
                      <CardTitle className="flex items-center justify-between">
                        <span>{tip.title}</span>
                        {showMostUseful && 'likeCount' in tip && (
                          <Badge variant="secondary" className="ml-2">
                            ⭐ {(tip as any).likeCount} likes
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Tip #{tip.id} • {tip.sourceName || "Fire Safety Adventure"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-700 text-sm">{tip.content}</p>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleLikeTip(tip.id)}
                          className={likedTips.includes(tip.id) ? "text-blue-600 bg-blue-50" : ""}
                        >
                          <ThumbsUp className={`h-4 w-4 mr-1 ${likedTips.includes(tip.id) ? "fill-current" : ""}`} />
                          <span>{likedTips.includes(tip.id) ? "Liked" : "Helpful"}</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => shareTip(tip)}
                        >
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
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {showMostUseful ? "No useful tips yet" : "No safety tips found"}
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                {showMostUseful 
                  ? "No tips have been liked yet. Start liking tips to see the most useful ones here!"
                  : "We couldn't find any safety tips matching your search criteria. Try adjusting your search or category filter."
                }
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory(TipCategory.ALL);
                  setShowMostUseful(false);
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
          <h2 className="font-bangers text-2xl text-gray-800 mb-4">🏛️ BFP Philippines Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              href="https://bfp.gov.ph/standard-public-fire-education-manual/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <BookOpen className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold">BFP Education Manual</h3>
              </div>
              <p className="text-sm text-gray-600">Official BFP fire safety education materials for children</p>
            </a>
            
            <a 
              href="https://bfp.gov.ph/category/manual/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">BFP Safety Manuals</h3>
              </div>
              <p className="text-sm text-gray-600">Comprehensive fire safety guides from BFP Philippines</p>
            </a>
            
            <a 
              href="https://bfp.gov.ph/wp-content/uploads/2024/08/Volume-4-Fire-Safety-for-General-Public.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold">Fire Safety for Public</h3>
              </div>
              <p className="text-sm text-gray-600">BFP Volume 4: Fire Safety guidelines for general public</p>
            </a>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-200">
            <div className="flex items-center mb-2">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-red-800">Official BFP Partnership</h3>
            </div>
            <p className="text-sm text-red-700">
              This educational platform is developed in partnership with the Bureau of Fire Protection (BFP) Philippines. 
              All content aligns with official BFP fire safety standards and educational guidelines.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}