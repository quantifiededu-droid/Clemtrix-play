import React from 'react';
import { cn } from '../lib/utils';

interface HandDiagramProps {
  diagramType: "posture" | "fingerNumbers" | "thumbCrossing" | "cPositionRight" | "cPositionLeft" | "wristRotation";
  className?: string;
}

export const HandDiagram: React.FC<HandDiagramProps> = ({ diagramType, className }) => {
  const renderDiagram = () => {
    switch (diagramType) {
      case "posture":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-auto" role="img" aria-label="Correct piano hand posture">
            {/* Side profile sketch of a hand in curved position */}
            <path d="M50,250 Q100,240 150,200 T250,150" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M150,200 Q180,180 210,210" fill="none" stroke="currentColor" strokeWidth="2" /> {/* Finger curve */}
            <path d="M210,210 Q230,230 250,220" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x="100" y="270" fontSize="12" fill="currentColor">Wrist Level</text>
            <text x="210" y="170" fontSize="12" fill="currentColor">Curved Fingers</text>
            <circle cx="150" cy="200" r="4" fill="none" stroke="currentColor" /> {/* Wrist joint */}
          </svg>
        );
      case "fingerNumbers":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-auto" role="img" aria-label="Piano finger numbering">
            {/* Top down hands */}
            {/* Left Hand */}
            <g transform="translate(50, 50)">
              <path d="M20,150 Q20,80 40,70 T60,50 T80,40 T100,50 T120,80 L120,150" fill="none" stroke="currentColor" strokeWidth="2" />
              <text x="35" y="30" fontSize="14" fill="currentColor">5</text>
              <text x="55" y="15" fontSize="14" fill="currentColor">4</text>
              <text x="75" y="5" fontSize="14" fill="currentColor">3</text>
              <text x="95" y="15" fontSize="14" fill="currentColor">2</text>
              <text x="130" y="80" fontSize="14" fill="currentColor">1 (Thumb)</text>
              <text x="50" y="180" fontSize="12" fontWeight="bold" fill="currentColor">Left Hand</text>
            </g>
            {/* Right Hand */}
            <g transform="translate(230, 50)">
              <path d="M0,150 Q0,80 20,50 T40,40 T60,50 T80,70 T100,150" fill="none" stroke="currentColor" strokeWidth="2" />
              <text x="-30" y="80" fontSize="14" fill="currentColor">1 (Thumb)</text>
              <text x="15" y="15" fontSize="14" fill="currentColor">2</text>
              <text x="35" y="5" fontSize="14" fill="currentColor">3</text>
              <text x="55" y="15" fontSize="14" fill="currentColor">4</text>
              <text x="75" y="30" fontSize="14" fill="currentColor">5</text>
              <text x="30" y="180" fontSize="12" fontWeight="bold" fill="currentColor">Right Hand</text>
            </g>
          </svg>
        );
      case "thumbCrossing":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-auto" role="img" aria-label="Thumb under crossing technique">
            <text x="10" y="30" fontSize="14" fill="currentColor">Step: Thumb passes under finger 3</text>
            <path d="M50,150 L350,150" stroke="currentColor" strokeWidth="1" strokeDasharray="4" /> {/* Keyboard line */}
            <g transform="translate(100, 100)">
              <path d="M20,50 Q40,20 60,50" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" /> {/* Finger 2 */}
              <circle cx="60" cy="50" r="10" fill="none" stroke="currentColor" />
              <text x="55" y="45" fontSize="10" fill="currentColor">3</text>
              <path d="M0,80 Q30,100 60,80" fill="none" stroke="currentColor" strokeWidth="3" /> {/* Thumb moving */}
              <circle cx="60" cy="80" r="8" fill="currentColor" fillOpacity="0.2" />
              <text x="55" y="95" fontSize="10" fill="currentColor">1</text>
              <path d="M60,80 L100,80" stroke="currentColor" strokeWidth="2" strokeDasharray="2" />
            </g>
          </svg>
        );
      case "cPositionRight":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-auto" role="img" aria-label="C Position Right Hand">
            <rect x="50" y="150" width="300" height="100" fill="none" stroke="currentColor" strokeWidth="1" />
            {["C","D","E","F","G"].map((note, i) => (
              <g key={note} transform={`translate(${60 + i*50}, 150)`}>
                <rect width="50" height="100" fill="none" stroke="currentColor" strokeWidth="1" />
                <text x="20" y="120" fontSize="12" fill="currentColor" opacity="0.5">{note}</text>
                <circle cx="25" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
                <text x="20" y="55" fontSize="14" fill="currentColor" fontWeight="bold">{i+1}</text>
              </g>
            ))}
            <text x="150" y="50" fontSize="16" fill="currentColor" fontWeight="bold">Right Hand C Position</text>
          </svg>
        );
      case "cPositionLeft":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-auto" role="img" aria-label="C Position Left Hand">
            <rect x="50" y="150" width="300" height="100" fill="none" stroke="currentColor" strokeWidth="1" />
            {["C","D","E","F","G"].map((note, i) => (
              <g key={note} transform={`translate(${60 + i*50}, 150)`}>
                <rect width="50" height="100" fill="none" stroke="currentColor" strokeWidth="1" />
                <text x="20" y="120" fontSize="12" fill="currentColor" opacity="0.5">{note}</text>
                <circle cx="25" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
                <text x="20" y="55" fontSize="14" fill="currentColor" fontWeight="bold">{5-i}</text>
              </g>
            ))}
            <text x="150" y="50" fontSize="16" fill="currentColor" fontWeight="bold">Left Hand C Position</text>
          </svg>
        );
      case "wristRotation":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-auto" role="img" aria-label="Wrist rotation technique">
             <path d="M200,150 m-50,0 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5" />
             <path d="M150,150 Q160,100 240,100" fill="none" stroke="currentColor" strokeWidth="3" markerEnd="url(#arrow)" />
             <defs>
               <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                 <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
               </marker>
             </defs>
             <text x="150" y="80" fontSize="14" fill="currentColor">Relaxed Rotation</text>
             <path d="M180,200 Q200,250 220,200" fill="none" stroke="currentColor" strokeWidth="2" />
             <text x="160" y="270" fontSize="12" fill="currentColor">Swing the weight of the arm</text>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm", className)}>
      {renderDiagram()}
    </div>
  );
};
