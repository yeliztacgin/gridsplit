
import React from 'react';
import { GridState } from '../types';

interface GridPreviewProps {
  state: GridState;
}

const GridPreview: React.FC<GridPreviewProps> = ({ state }) => {
  if (!state.imageSrc) {
    return (
      <div className="w-full min-h-[500px] bg-white rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200 shadow-sm px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Live Grid Preview</h2>
          <p className="text-slate-400 text-sm">Upload a photo to see how it will be split into multiple pages for printing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/5 backdrop-blur-sm p-4 md:p-12 rounded-3xl shadow-inner min-h-[550px] flex items-center justify-center overflow-auto border border-slate-200/50">
      <div className="relative inline-block shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-white border-[12px] border-white rounded-lg">
        <img 
          src={state.imageSrc} 
          alt="Original Image Preview" 
          className="max-w-full max-h-[75vh] block h-auto rounded-sm"
        />
        
        {/* SVG Grid Overlay */}
        <svg 
          className="grid-overlay" 
          viewBox={`0 0 ${state.imageWidth} ${state.imageHeight}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vertical Lines */}
          {Array.from({ length: state.columns - 1 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={(state.imageWidth / state.columns) * (i + 1)}
              y1="0"
              x2={(state.imageWidth / state.columns) * (i + 1)}
              y2={state.imageHeight}
              stroke="#6366f1"
              strokeWidth={Math.max(3, state.imageWidth / 300)}
              strokeDasharray={`${state.imageWidth/50},${state.imageWidth/100}`}
              opacity="0.9"
            />
          ))}
          {/* Horizontal Lines */}
          {Array.from({ length: state.rows - 1 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={(state.imageHeight / state.rows) * (i + 1)}
              x2={state.imageWidth}
              y2={(state.imageHeight / state.rows) * (i + 1)}
              stroke="#6366f1"
              strokeWidth={Math.max(3, state.imageWidth / 300)}
              strokeDasharray={`${state.imageWidth/50},${state.imageWidth/100}`}
              opacity="0.9"
            />
          ))}
        </svg>

        {/* Dynamic Grid Labels Overlay */}
        <div 
          className="absolute inset-0 grid pointer-events-none" 
          style={{
            gridTemplateColumns: `repeat(${state.columns}, 1fr)`,
            gridTemplateRows: `repeat(${state.rows}, 1fr)`
          }}
        >
          {Array.from({ length: state.columns * state.rows }).map((_, i) => (
            <div key={i} className="flex items-center justify-center p-2">
              <div className="bg-white/90 backdrop-blur shadow-sm text-indigo-600 text-[10px] md:text-xs font-black px-3 py-1 rounded-full border border-indigo-100 scale-75 md:scale-100">
                PAGE {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridPreview;
