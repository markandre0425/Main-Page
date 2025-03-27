import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useUser } from '@/context/UserContext';

// Element types for the floor plan
enum ElementType {
  WALL = 'wall',
  DOOR = 'door',
  WINDOW = 'window',
  FURNITURE = 'furniture',
  EXIT_ROUTE = 'exit_route',
  MEETING_POINT = 'meeting_point',
  FIRE_EXTINGUISHER = 'fire_extinguisher',
  SMOKE_DETECTOR = 'smoke_detector'
}

// Element interface
interface PlanElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label?: string;
}

// Preset room templates
interface RoomTemplate {
  name: string;
  elements: PlanElement[];
}

interface EscapePlanDesignerProps {
  previewMode?: boolean;
  onComplete?: () => void;
}

export default function EscapePlanDesigner({
  previewMode = false,
  onComplete
}: EscapePlanDesignerProps) {
  // References
  const canvasRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  
  // User state
  const { userData } = useUser();
  
  // Canvas state
  const [elements, setElements] = useState<PlanElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<PlanElement | null>(null);
  const [currentTool, setCurrentTool] = useState<ElementType | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [roomName, setRoomName] = useState('My Home');
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Validation and completion state
  const [planComplete, setPlanComplete] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  
  // Room templates
  const roomTemplates: RoomTemplate[] = [
    {
      name: 'Small Apartment',
      elements: [
        { id: '1', type: ElementType.WALL, x: 10, y: 10, width: 400, height: 10, rotation: 0 },
        { id: '2', type: ElementType.WALL, x: 10, y: 10, width: 10, height: 300, rotation: 0 },
        { id: '3', type: ElementType.WALL, x: 10, y: 310, width: 400, height: 10, rotation: 0 },
        { id: '4', type: ElementType.WALL, x: 410, y: 10, width: 10, height: 300, rotation: 0 },
        { id: '5', type: ElementType.DOOR, x: 200, y: 310, width: 60, height: 10, rotation: 0, label: 'Front Door' },
        { id: '6', type: ElementType.WINDOW, x: 100, y: 10, width: 60, height: 10, rotation: 0, label: 'Window' },
        { id: '7', type: ElementType.WINDOW, x: 300, y: 10, width: 60, height: 10, rotation: 0, label: 'Window' },
      ]
    },
    {
      name: 'Family House',
      elements: [
        // Main walls
        { id: '1', type: ElementType.WALL, x: 10, y: 10, width: 600, height: 10, rotation: 0 },
        { id: '2', type: ElementType.WALL, x: 10, y: 10, width: 10, height: 400, rotation: 0 },
        { id: '3', type: ElementType.WALL, x: 10, y: 410, width: 600, height: 10, rotation: 0 },
        { id: '4', type: ElementType.WALL, x: 610, y: 10, width: 10, height: 400, rotation: 0 },
        // Interior walls
        { id: '5', type: ElementType.WALL, x: 300, y: 10, width: 10, height: 200, rotation: 0 },
        { id: '6', type: ElementType.WALL, x: 10, y: 200, width: 300, height: 10, rotation: 0 },
        { id: '7', type: ElementType.WALL, x: 400, y: 200, width: 210, height: 10, rotation: 0 },
        // Doors
        { id: '8', type: ElementType.DOOR, x: 100, y: 410, width: 80, height: 10, rotation: 0, label: 'Front Door' },
        { id: '9', type: ElementType.DOOR, x: 500, y: 410, width: 80, height: 10, rotation: 0, label: 'Back Door' },
        { id: '10', type: ElementType.DOOR, x: 300, y: 150, width: 10, height: 60, rotation: 0, label: 'Interior Door' },
        { id: '11', type: ElementType.DOOR, x: 350, y: 200, width: 50, height: 10, rotation: 0, label: 'Interior Door' },
        // Windows
        { id: '12', type: ElementType.WINDOW, x: 150, y: 10, width: 80, height: 10, rotation: 0, label: 'Window' },
        { id: '13', type: ElementType.WINDOW, x: 450, y: 10, width: 80, height: 10, rotation: 0, label: 'Window' },
        { id: '14', type: ElementType.WINDOW, x: 10, y: 100, width: 10, height: 60, rotation: 0, label: 'Window' },
        { id: '15', type: ElementType.WINDOW, x: 610, y: 100, width: 10, height: 60, rotation: 0, label: 'Window' },
        { id: '16', type: ElementType.WINDOW, x: 610, y: 300, width: 10, height: 60, rotation: 0, label: 'Window' },
      ]
    }
  ];
  
  // Generate a new unique ID
  const generateId = () => `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Load template
  const loadTemplate = (templateName: string) => {
    const template = roomTemplates.find(t => t.name === templateName);
    if (template) {
      setElements(template.elements.map(e => ({ ...e, id: generateId() })));
      setRoomName(`${templateName} Plan`);
    }
  };
  
  // Handle mouse down to start drawing or selecting
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || showInstructions) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on existing element
    const clickedElement = elements.find(el => 
      x >= el.x && 
      x <= el.x + el.width && 
      y >= el.y && 
      y <= el.y + el.height
    );
    
    if (clickedElement) {
      setSelectedElement(clickedElement);
      return;
    }
    
    // Start drawing new element if a tool is selected
    if (currentTool) {
      setIsDrawing(true);
      setStartPos({ x, y });
    }
  };
  
  // Handle mouse move for drawing or moving elements
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || showInstructions) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // If drawing a new element
    if (isDrawing && currentTool) {
      const width = x - startPos.x;
      const height = y - startPos.y;
      
      // Update temp element
      setElements(prev => {
        const filtered = prev.filter(el => el.id !== 'temp');
        return [
          ...filtered,
          {
            id: 'temp',
            type: currentTool,
            x: startPos.x,
            y: startPos.y,
            width: Math.abs(width),
            height: Math.abs(height),
            rotation: 0,
            label: getDefaultLabel(currentTool)
          }
        ];
      });
    }
    
    // If moving an existing element
    if (selectedElement && e.buttons === 1) {
      setElements(prev => prev.map(el => 
        el.id === selectedElement.id 
          ? { 
              ...el, 
              x: x - el.width / 2, 
              y: y - el.height / 2 
            } 
          : el
      ));
    }
  };
  
  // Handle mouse up to finish drawing or moving
  const handleMouseUp = () => {
    if (showInstructions) return;
    
    // Finish drawing
    if (isDrawing) {
      setIsDrawing(false);
      setElements(prev => {
        const tempElement = prev.find(el => el.id === 'temp');
        const filtered = prev.filter(el => el.id !== 'temp');
        
        if (tempElement && (tempElement.width > 5 || tempElement.height > 5)) {
          return [
            ...filtered,
            { ...tempElement, id: generateId() }
          ];
        }
        return filtered;
      });
    }
    
    // Reset selected element
    setSelectedElement(null);
  };
  
  // Get default label for element type
  const getDefaultLabel = (type: ElementType): string => {
    switch(type) {
      case ElementType.DOOR: return 'Door';
      case ElementType.WINDOW: return 'Window';
      case ElementType.EXIT_ROUTE: return 'Exit Route';
      case ElementType.MEETING_POINT: return 'Meeting Point';
      case ElementType.FIRE_EXTINGUISHER: return 'Fire Extinguisher';
      case ElementType.SMOKE_DETECTOR: return 'Smoke Detector';
      default: return '';
    }
  };
  
  // Get color for element type
  const getElementColor = (type: ElementType): string => {
    switch(type) {
      case ElementType.WALL: return 'bg-gray-800';
      case ElementType.DOOR: return 'bg-brown-500';
      case ElementType.WINDOW: return 'bg-blue-300';
      case ElementType.FURNITURE: return 'bg-gray-400';
      case ElementType.EXIT_ROUTE: return 'bg-green-500';
      case ElementType.MEETING_POINT: return 'bg-yellow-400';
      case ElementType.FIRE_EXTINGUISHER: return 'bg-red-500';
      case ElementType.SMOKE_DETECTOR: return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };
  
  // Validate the escape plan
  const validatePlan = (): boolean => {
    const messages: string[] = [];
    
    // Check for at least one door
    const hasDoor = elements.some(el => el.type === ElementType.DOOR);
    if (!hasDoor) messages.push('Your plan must include at least one door.');
    
    // Check for exit routes
    const hasExitRoute = elements.some(el => el.type === ElementType.EXIT_ROUTE);
    if (!hasExitRoute) messages.push('Add at least one exit route to your plan.');
    
    // Check for meeting point
    const hasMeetingPoint = elements.some(el => el.type === ElementType.MEETING_POINT);
    if (!hasMeetingPoint) messages.push('Add a meeting point outside the home.');
    
    // Check for smoke detectors
    const hasSmokeDetector = elements.some(el => el.type === ElementType.SMOKE_DETECTOR);
    if (!hasSmokeDetector) messages.push('Place at least one smoke detector in your plan.');
    
    setValidationMessages(messages);
    return messages.length === 0;
  };
  
  // Complete the plan
  const completePlan = () => {
    if (validatePlan()) {
      setPlanComplete(true);
      if (onComplete) onComplete();
      toast({
        title: "Escape Plan Completed!",
        description: "Your home escape plan has been saved. You can print it or make changes.",
      });
    }
  };
  
  // Print the escape plan
  const printPlan = () => {
    if (printRef.current) {
      const content = printRef.current;
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Fire Escape Plan - ${roomName}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #e53e3e; }
                .container { border: 2px solid #718096; padding: 20px; }
                .plan-container { position: relative; height: 500px; border: 1px solid #cbd5e0; margin: 15px 0; }
                .element { position: absolute; }
                .instructions { margin-top: 30px; padding: 15px; background-color: #f7fafc; }
                .footer { margin-top: 20px; text-align: center; font-size: 0.8em; color: #718096; }
              </style>
            </head>
            <body>
              <h1>Fire Escape Plan - ${roomName}</h1>
              <div class="container">
                ${content.innerHTML}
                <div class="instructions">
                  <h3>Important Reminders:</h3>
                  <ul>
                    <li>Practice this escape plan with all household members at least twice a year.</li>
                    <li>Make sure everyone knows two ways out of each room.</li>
                    <li>Designate someone to assist young children, older adults, and people with disabilities.</li>
                    <li>Once outside, stay outside. Never go back into a burning building.</li>
                    <li>Call emergency services from outside the home.</li>
                  </ul>
                </div>
                <div class="footer">
                  <p>Created on ${new Date().toLocaleDateString()} using Fire Safety Adventure</p>
                </div>
              </div>
            </body>
          </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 1000);
      }
    }
  };
  
  // Delete selected element
  const deleteElement = () => {
    if (selectedElement) {
      setElements(prev => prev.filter(el => el.id !== selectedElement.id));
      setSelectedElement(null);
    }
  };
  
  // Clear the plan
  const clearPlan = () => {
    if (confirm('Are you sure you want to clear your plan?')) {
      setElements([]);
      setPlanComplete(false);
      setValidationMessages([]);
    }
  };
  
  // Preview mode simplified version
  if (previewMode) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg shadow">
        <h3 className="font-fredoka text-xl text-blue-600 mb-2">Escape Plan Designer</h3>
        <p className="text-sm mb-4">Create your home fire escape plan</p>
        <div className="flex justify-center">
          <img 
            src="https://placehold.co/300x200/4169E1/FFF?text=Escape+Plan" 
            alt="Escape Plan Designer Preview" 
            className="rounded-md mb-3"
          />
        </div>
        <p className="text-xs text-gray-600">Design and print a custom escape plan for your home or apartment.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-4">
        <h2 className="font-fredoka text-2xl">Home Escape Plan Designer</h2>
        <p className="text-sm opacity-90">Create a fire escape plan for your home</p>
      </div>
      
      {/* Instructions screen */}
      {showInstructions ? (
        <div className="p-6">
          <h3 className="font-fredoka text-xl mb-4">Instructions</h3>
          
          <div className="mb-6">
            <p className="mb-4">
              Creating a home fire escape plan is essential for your family's safety. 
              Follow these steps to create your plan:
            </p>
            
            <ol className="list-decimal pl-5 space-y-2">
              <li>Start with a template or create your own floor plan</li>
              <li>Add doors, windows, and furniture to match your home</li>
              <li>Draw exit routes from each room (at least two where possible)</li>
              <li>Add a meeting point outside your home</li>
              <li>Place smoke detectors and fire extinguishers</li>
              <li>Review and validate your plan</li>
            </ol>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Choose a template to start:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roomTemplates.map(template => (
                <div 
                  key={template.name} 
                  className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => loadTemplate(template.name)}
                >
                  <h5 className="font-bold">{template.name}</h5>
                  <p className="text-sm text-gray-600">
                    {template.name === 'Small Apartment' ? 
                      'Single room apartment with basic layout' : 
                      'Two-bedroom house with multiple rooms'}
                  </p>
                </div>
              ))}
              
              <div 
                className="border rounded-lg p-4 cursor-pointer hover:bg-green-50 hover:border-green-300"
                onClick={() => {
                  setElements([]);
                  setShowInstructions(false);
                }}
              >
                <h5 className="font-bold">Start from Scratch</h5>
                <p className="text-sm text-gray-600">
                  Create a completely custom floor plan
                </p>
              </div>
            </div>
          </div>
          
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow"
            onClick={() => setShowInstructions(false)}
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* Toolbar */}
          <div className="p-4 bg-gray-100 border-r">
            <h3 className="font-fredoka text-lg mb-3">Tools</h3>
            
            <div className="space-y-2 mb-6">
              <div 
                className={`flex items-center p-2 rounded cursor-pointer ${currentTool === ElementType.WALL ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                onClick={() => setCurrentTool(ElementType.WALL)}
              >
                <div className="w-5 h-5 bg-gray-800 mr-2"></div>
                <span>Wall</span>
              </div>
              
              <div 
                className={`flex items-center p-2 rounded cursor-pointer ${currentTool === ElementType.DOOR ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                onClick={() => setCurrentTool(ElementType.DOOR)}
              >
                <div className="w-5 h-5 bg-yellow-700 mr-2"></div>
                <span>Door</span>
              </div>
              
              <div 
                className={`flex items-center p-2 rounded cursor-pointer ${currentTool === ElementType.WINDOW ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                onClick={() => setCurrentTool(ElementType.WINDOW)}
              >
                <div className="w-5 h-5 bg-blue-300 mr-2"></div>
                <span>Window</span>
              </div>
              
              <div 
                className={`flex items-center p-2 rounded cursor-pointer ${currentTool === ElementType.FURNITURE ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                onClick={() => setCurrentTool(ElementType.FURNITURE)}
              >
                <div className="w-5 h-5 bg-gray-400 mr-2"></div>
                <span>Furniture</span>
              </div>
              
              <div 
                className={`flex items-center p-2 rounded cursor-pointer ${currentTool === ElementType.EXIT_ROUTE ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                onClick={() => setCurrentTool(ElementType.EXIT_ROUTE)}
              >
                <div className="w-5 h-5 bg-green-500 mr-2"></div>
                <span>Exit Route</span>
              </div>
              
              <div 
                className={`flex items-center p-2 rounded cursor-pointer ${currentTool === ElementType.MEETING_POINT ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                onClick={() => setCurrentTool(ElementType.MEETING_POINT)}
              >
                <div className="w-5 h-5 bg-yellow-400 mr-2"></div>
                <span>Meeting Point</span>
              </div>
              
              <div 
                className={`flex items-center p-2 rounded cursor-pointer ${currentTool === ElementType.FIRE_EXTINGUISHER ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                onClick={() => setCurrentTool(ElementType.FIRE_EXTINGUISHER)}
              >
                <div className="w-5 h-5 bg-red-500 mr-2"></div>
                <span>Fire Extinguisher</span>
              </div>
              
              <div 
                className={`flex items-center p-2 rounded cursor-pointer ${currentTool === ElementType.SMOKE_DETECTOR ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                onClick={() => setCurrentTool(ElementType.SMOKE_DETECTOR)}
              >
                <div className="w-5 h-5 bg-blue-500 mr-2"></div>
                <span>Smoke Detector</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Actions</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={deleteElement}
                  disabled={!selectedElement}
                >
                  Delete Selected
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={clearPlan}
                >
                  Clear Plan
                </Button>
                
                {planComplete ? (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 justify-start"
                    onClick={printPlan}
                  >
                    Print Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 justify-start" 
                    onClick={completePlan}
                  >
                    Validate Plan
                  </Button>
                )}
              </div>
            </div>
            
            {validationMessages.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="font-medium text-yellow-800 mb-1">Plan Needs Improvement:</h4>
                <ul className="text-sm list-disc pl-5 text-yellow-700">
                  {validationMessages.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Canvas area */}
          <div className="md:col-span-3 p-4">
            <div className="mb-4 flex justify-between items-center">
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="border-2 border-gray-300 rounded px-2 py-1 text-lg font-semibold"
                aria-label="Plan Name"
              />
              
              <div>
                <span className="text-sm text-gray-500 mr-2">
                  {currentTool ? `Drawing: ${currentTool}` : 'Click on a tool to start drawing'}
                </span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setCurrentTool(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
            
            <div
              ref={canvasRef}
              className="border-2 border-gray-300 rounded-lg h-[600px] w-full relative cursor-crosshair overflow-hidden bg-gray-50"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Render elements */}
              {elements.map(element => (
                <div
                  key={element.id}
                  className={`absolute ${getElementColor(element.type)} ${element.id === 'temp' ? 'opacity-50' : ''} ${selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''}`}
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    transform: `rotate(${element.rotation}deg)`,
                    cursor: 'move'
                  }}
                >
                  {element.label && element.type !== ElementType.WALL && (
                    <div className="absolute -top-5 left-0 text-xs whitespace-nowrap">
                      {element.label}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Print reference (hidden) */}
              <div ref={printRef} className="hidden">
                <h2>{roomName}</h2>
                <div className="relative" style={{ height: '500px', width: '100%', border: '1px solid #ccc' }}>
                  {elements.map(element => (
                    <div
                      key={element.id}
                      style={{
                        position: 'absolute',
                        left: `${element.x}px`,
                        top: `${element.y}px`,
                        width: `${element.width}px`,
                        height: `${element.height}px`,
                        backgroundColor: element.type === ElementType.WALL ? '#2D3748' :
                                         element.type === ElementType.DOOR ? '#C05621' :
                                         element.type === ElementType.WINDOW ? '#90CDF4' :
                                         element.type === ElementType.FURNITURE ? '#A0AEC0' :
                                         element.type === ElementType.EXIT_ROUTE ? '#48BB78' :
                                         element.type === ElementType.MEETING_POINT ? '#F6E05E' :
                                         element.type === ElementType.FIRE_EXTINGUISHER ? '#E53E3E' :
                                         element.type === ElementType.SMOKE_DETECTOR ? '#3182CE' : '#CBD5E0',
                        transform: `rotate(${element.rotation}deg)`
                      }}
                    >
                      {element.label && element.type !== ElementType.WALL && (
                        <div style={{ position: 'absolute', top: '-16px', left: '0', fontSize: '12px' }}>
                          {element.label}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3>Legend:</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
                    <div style={{ margin: '5px', display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '15px', height: '15px', backgroundColor: '#2D3748', marginRight: '5px' }}></div>
                      <span>Wall</span>
                    </div>
                    <div style={{ margin: '5px', display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '15px', height: '15px', backgroundColor: '#C05621', marginRight: '5px' }}></div>
                      <span>Door</span>
                    </div>
                    <div style={{ margin: '5px', display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '15px', height: '15px', backgroundColor: '#90CDF4', marginRight: '5px' }}></div>
                      <span>Window</span>
                    </div>
                    <div style={{ margin: '5px', display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '15px', height: '15px', backgroundColor: '#48BB78', marginRight: '5px' }}></div>
                      <span>Exit Route</span>
                    </div>
                    <div style={{ margin: '5px', display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '15px', height: '15px', backgroundColor: '#F6E05E', marginRight: '5px' }}></div>
                      <span>Meeting Point</span>
                    </div>
                    <div style={{ margin: '5px', display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '15px', height: '15px', backgroundColor: '#E53E3E', marginRight: '5px' }}></div>
                      <span>Fire Extinguisher</span>
                    </div>
                    <div style={{ margin: '5px', display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '15px', height: '15px', backgroundColor: '#3182CE', marginRight: '5px' }}></div>
                      <span>Smoke Detector</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm">
              <h3 className="font-medium text-blue-800 mb-2">Tips for a Good Escape Plan:</h3>
              <ul className="list-disc pl-5 space-y-1 text-blue-700">
                <li>Plan two ways out of every room</li>
                <li>Make sure all doors and windows can be easily opened</li>
                <li>Choose a meeting place outside that is a safe distance from your home</li>
                <li>Practice your escape plan at least twice a year</li>
                <li>If smoke is present, stay low to the ground while escaping</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}