import React, { useState, useEffect } from 'react';

interface PatientHeaderProps {
  patientName?: string;
  patientId?: string;
}

const PatientHeader: React.FC<PatientHeaderProps> = () => {
  const [blinkingBoxes, setBlinkingBoxes] = useState<Record<string, boolean>>({});
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);

  // Generate grid of tiny boxes
  const boxSize = 2;

  // Calculate grid dimensions based on component size
  useEffect(() => {
    const updateGridSize = () => {
      const headerElement = document.querySelector('.patient-header');
      const headerHeight = headerElement ? headerElement.clientHeight : 120; // Fallback to 120px if element not found
      setRows(Math.ceil(headerHeight / boxSize));
      setCols(Math.ceil(window.innerWidth / boxSize));
    };

    // Initial calculation after DOM is ready
    setTimeout(updateGridSize, 0);

    // Update on window resize
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, [boxSize]);

  useEffect(() => {
    // Random blinking effect
    const interval = setInterval(() => {
      const newBlinkingBoxes: Record<string, boolean> = {};
      // Randomly select 15-25 boxes to blink
      const numBoxesToBlink = Math.floor(Math.random() * 10) + 15;
      
      for (let i = 0; i < numBoxesToBlink; i++) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        const key = `${row}-${col}`;
        newBlinkingBoxes[key] = true;
      }
      
      setBlinkingBoxes(newBlinkingBoxes);
    }, 200);
    
    return () => clearInterval(interval);
  }, [rows, cols]);

  // Generate the grid boxes
  const renderGrid = () => {
    const grid = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const key = `${row}-${col}`;
        const isBlinking = blinkingBoxes[key];
        const isWhite = (row + col) % 2 === 0;
        
        grid.push(
          <div 
            key={key}
            style={{
              position: 'absolute',
              width: `${boxSize}px`,
              height: `${boxSize}px`,
              top: row * boxSize,
              left: col * boxSize,
              backgroundColor: isBlinking ? '#90cdf4' : isWhite ? 'white' : '#e2e8f0',
              opacity: isBlinking ? 1 : 0.7,
              transition: 'all 0.2s ease'
            }}
          />
        );
      }
    }
    
    return grid;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full mx-auto my-2 bg-white border border-gray-200 rounded-lg shadow-sm max-w-7xl patient-header">
      {/* Background grid container */}
      <div className="absolute inset-0 overflow-hidden">
        {renderGrid()}
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center p-3">
        <div className="flex items-center flex-1 space-x-2">
          {/* Left section - Patient info */}
          <div className="flex items-center justify-center w-10 h-10 text-2xl font-medium text-blue-600 bg-blue-100 rounded-full">J</div>
          <div className="relative w-5 h-5 bg-green-500 rounded-full">
            <div className="absolute inset-0 bg-green-500 rounded-full opacity-50 animate-ping"></div>
          </div>
          <div className="flex flex-col ml-1">
            <div>
              <span className="text-lg font-bold">John</span> 
              <span className="text-gray-700">Smith</span>
              <span className="ml-2 font-medium text-blue-600">{"Johnny"}</span>
              <span className="ml-2 text-gray-500">Him</span>
            </div>
            <div className="p-2 mt-1 border border-orange-100 rounded-md bg-orange-50">
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 mr-2 bg-orange-500 rounded-full"></span>
                <span className="font-medium text-orange-600">Sensitivity to loud noises - maintain calm environment</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Middle section - Navigation */}
        <div className="flex items-center space-x-4">
          <button className="p-1 text-gray-400">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <div className="flex flex-col text-sm text-gray-600">
            <div className="flex items-center mb-1">
              <span className="w-20 font-medium text-gray-500">Insurance:</span>
              <span className="text-gray-700">Pacific Source Community...</span>
            </div>
            <div className="flex items-center">
              <span className="w-20 font-medium text-gray-500">Admitted:</span>
              <span className="text-gray-700">Outpatient</span>
            </div>
          </div>
          
          <button className="p-1 text-gray-400">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        
        {/* Right section - Actions */}
        <div className="flex items-center space-x-2">
          <button className="flex items-center p-2 text-gray-700 border border-gray-200 rounded-md">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="mr-2 text-gray-500">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="font-medium">Encounter History</span>
          </button>
          
          <button className="px-6 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-400">
            New Encounter
          </button>
          
          <button className="p-2 text-gray-500 border border-gray-200 rounded-md">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;