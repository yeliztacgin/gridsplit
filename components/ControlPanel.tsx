
import React from 'react';
import { GridState, PageSize, Orientation } from '../types';

interface ControlPanelProps {
  state: GridState;
  onChange: (newState: Partial<GridState>) => void;
  onDownload: () => void;
  isProcessing: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange, onDownload, isProcessing }) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          onChange({
            imageSrc: event.target?.result as string,
            imageWidth: img.width,
            imageHeight: img.height
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <section>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">1. Source Image</label>
        <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="space-y-2">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <p className="text-sm font-bold text-slate-700">{state.imageSrc ? 'Change Image' : 'Select Image'}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">PNG, JPG up to 20MB</p>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">2. Page Settings</label>
        
        <div className="grid grid-cols-2 gap-3">
            <div>
                <span className="text-[10px] font-bold text-slate-400 ml-1">Format</span>
                <select
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={state.pageSize}
                    onChange={(e) => onChange({ pageSize: e.target.value as PageSize })}
                >
                    <option value="A4">A4 Paper</option>
                    <option value="A3">A3 Paper</option>
                    <option value="Letter">Letter</option>
                </select>
            </div>
            <div>
                <span className="text-[10px] font-bold text-slate-400 ml-1">Orientation</span>
                <select
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={state.orientation}
                    onChange={(e) => onChange({ orientation: e.target.value as Orientation })}
                >
                    <option value="Portrait">Portrait</option>
                    <option value="Landscape">Landscape</option>
                </select>
            </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs font-bold text-slate-600">Smart Fit (No Stretch)</span>
            <button 
                onClick={() => onChange({ maintainAspectRatio: !state.maintainAspectRatio })}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${state.maintainAspectRatio ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${state.maintainAspectRatio ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">3. Grid Structure</label>
        <div className="grid grid-cols-2 gap-3">
            <div>
                <span className="text-[10px] font-bold text-slate-400 ml-1">Columns</span>
                <input
                    type="number"
                    min="1"
                    max="20"
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={state.columns}
                    onChange={(e) => onChange({ columns: Math.max(1, parseInt(e.target.value) || 1) })}
                />
            </div>
            <div>
                <span className="text-[10px] font-bold text-slate-400 ml-1">Rows</span>
                <input
                    type="number"
                    min="1"
                    max="20"
                    disabled={state.maintainAspectRatio}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:bg-slate-100"
                    value={state.rows}
                    onChange={(e) => onChange({ rows: Math.max(1, parseInt(e.target.value) || 1) })}
                />
            </div>
        </div>
      </div>

      <div className="p-4 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
        <div className="flex justify-between items-end">
            <div>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-wider">Total Sheets</p>
                <h3 className="text-3xl font-black">{state.columns * state.rows}</h3>
            </div>
            <button
                onClick={onDownload}
                disabled={isProcessing || !state.imageSrc}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        DOWNLOAD
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
