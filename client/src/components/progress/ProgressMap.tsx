import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface MapNode {
  id: number;
  title: string;
  description: string;
  x: number;
  y: number;
  completed: boolean;
  locked: boolean;
  type: "mission" | "challenge" | "quiz" | "game";
  path: string;
}

export function ProgressMap() {
  const { user } = useAuth();
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  
  // This would ideally come from the backend based on user progress
  const [nodes, setNodes] = useState<MapNode[]>([
    {
      id: 1,
      title: "Fire Safety Basics",
      description: "Learn the fundamental concepts of fire safety.",
      x: 20,
      y: 50,
      completed: true,
      locked: false,
      type: "mission",
      path: "/mission/1"
    },
    {
      id: 2,
      title: "Home Escape Plan",
      description: "Create and practice a home escape plan.",
      x: 35,
      y: 30,
      completed: user?.completedMissions?.includes(2) || false,
      locked: false,
      type: "mission",
      path: "/mission/2"
    },
    {
      id: 3,
      title: "Fire Extinguisher Basics",
      description: "Learn how to properly use a fire extinguisher.",
      x: 50,
      y: 45,
      completed: user?.completedMissions?.includes(3) || false,
      locked: !user?.completedMissions?.includes(2) && !user?.completedMissions?.includes(1),
      type: "game",
      path: "/games/fire-extinguisher-simulator"
    },
    {
      id: 4,
      title: "Smoke Detector Challenge",
      description: "Test your knowledge about smoke detectors.",
      x: 65,
      y: 25,
      completed: user?.completedMissions?.includes(4) || false,
      locked: !user?.completedMissions?.includes(3),
      type: "challenge",
      path: "/mission/4"
    },
    {
      id: 5,
      title: "Kitchen Fire Safety",
      description: "Learn about preventing and handling kitchen fires.",
      x: 80,
      y: 50,
      completed: user?.completedMissions?.includes(5) || false,
      locked: !user?.completedMissions?.includes(4),
      type: "quiz",
      path: "/games/fire-safety-quiz"
    }
  ]);

  const getNodeColor = (node: MapNode) => {
    if (node.completed) return "bg-green-500";
    if (node.locked) return "bg-gray-400";
    
    switch(node.type) {
      case "mission": return "bg-blue-500";
      case "challenge": return "bg-yellow-500";
      case "quiz": return "bg-purple-500";
      case "game": return "bg-red-500";
      default: return "bg-blue-400";
    }
  };

  const getNodeSize = (node: MapNode) => {
    return node.completed ? "w-12 h-12" : "w-10 h-10";
  };

  const getConnectorStyle = (fromNode: MapNode, toNode: MapNode) => {
    const completed = fromNode.completed && toNode.completed;
    return `absolute h-1 ${completed ? "bg-green-500" : "bg-gray-300"} transform origin-left z-0`;
  };
  
  // Draw connections between nodes
  const renderConnections = () => {
    return nodes.map((node, index) => {
      if (index === 0) return null; // Skip the first node as it has no incoming connection
      
      const prevNode = nodes[index - 1];
      
      // Calculate the position and rotation of the connector
      const x1 = prevNode.x;
      const y1 = prevNode.y;
      const x2 = node.x;
      const y2 = node.y;
      
      // Calculate distance and angle
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      
      return (
        <div 
          key={`connector-${prevNode.id}-${node.id}`}
          className={getConnectorStyle(prevNode, node)}
          style={{
            width: `${distance}%`,
            left: `${x1}%`,
            top: `${y1}%`,
            transform: `rotate(${angle}deg)`
          }}
        />
      );
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-full relative overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Learning Journey</h2>
      
      <div className="relative h-[400px] w-full bg-blue-50 rounded-lg border border-blue-100 mb-4">
        {/* Render the connections first (background) */}
        {renderConnections()}
        
        {/* Render each node */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute z-10"
            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              className={`${getNodeColor(node)} ${getNodeSize(node)} rounded-full flex items-center justify-center cursor-pointer relative shadow-md`}
              whileHover={{ scale: 1.2 }}
              onHoverStart={() => setHoveredNode(node.id)}
              onHoverEnd={() => setHoveredNode(null)}
            >
              {node.completed && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {node.locked && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              {!node.completed && !node.locked && (
                <span className="text-white font-bold">{node.id}</span>
              )}
              
              {/* Tooltip */}
              {hoveredNode === node.id && (
                <motion.div 
                  className="absolute top-full mt-2 bg-white p-3 rounded-lg shadow-lg z-20 w-48"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="font-bold text-sm mb-1">{node.title}</div>
                  <div className="text-xs text-gray-600 mb-2">{node.description}</div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      node.type === "mission" ? "bg-blue-100 text-blue-800" :
                      node.type === "challenge" ? "bg-yellow-100 text-yellow-800" :
                      node.type === "quiz" ? "bg-purple-100 text-purple-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                    </span>
                    
                    {!node.locked && (
                      <Link href={node.path}>
                        <Button size="sm" variant={node.completed ? "outline" : "default"}>
                          {node.completed ? "Review" : "Start"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
            
            <div className="absolute top-full mt-1 text-xs font-medium text-center w-20 left-1/2 transform -translate-x-1/2">
              {node.title.split(' ').slice(0, 2).join(' ')}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-xs">Mission</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-xs">Challenge</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
          <span className="text-xs">Quiz</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
          <span className="text-xs">Game</span>
        </div>
      </div>
    </div>
  );
}