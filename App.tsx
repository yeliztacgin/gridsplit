
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { GridState, Orientation } from './types';
import { PAGE_DIMENSIONS } from './constants';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import GridPreview from './components/GridPreview';
import AdPlaceholder from './components/AdPlaceholder';

const App: React.FC = () => {
  const [state, setState] = useState<GridState>({
    imageSrc: null,
    imageWidth: 0,
    imageHeight: 0,
    rows: 2,
    columns: 2,
    pageSize: 'A4',
    orientation: 'Portrait',
    maintainAspectRatio: true
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-calculate rows to prevent distortion when settings change
  useEffect(() => {
    if (state.maintainAspectRatio && state.imageWidth > 0 && state.imageHeight > 0) {
      const baseDim = PAGE_DIMENSIONS[state.pageSize];
      const isPortrait = state.orientation === 'Portrait';
      const pW = isPortrait ? baseDim.width : baseDim.height;
      const pH = isPortrait ? baseDim.height : baseDim.width;

      // Formula: (ImageH / ImageW) * Columns * (PageW / PageH)
      // This ensures each grid cell has the same aspect ratio as the chosen page orientation
      const calculatedRows = Math.round((state.imageHeight / state.imageWidth) * state.columns * (pW / pH));
      const finalRows = Math.max(1, calculatedRows);

      if (finalRows !== state.rows) {
        setState(prev => ({ ...prev, rows: finalRows }));
      }
    }
  }, [state.columns, state.orientation, state.pageSize, state.imageWidth, state.imageHeight, state.maintainAspectRatio]);

  const handleStateChange = (newState: Partial<GridState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const generatePDF = async () => {
    if (!state.imageSrc) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = state.imageSrc;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const isPortrait = state.orientation === 'Portrait';
      const pdfOrientation = isPortrait ? 'p' : 'l';
      const baseDim = PAGE_DIMENSIONS[state.pageSize];
      const pageWidth = isPortrait ? baseDim.width : baseDim.height;
      const pageHeight = isPortrait ? baseDim.height : baseDim.width;

      const doc = new jsPDF({
        orientation: pdfOrientation,
        unit: 'mm',
        format: state.pageSize.toLowerCase(),
        compress: true
      });

      const pieceWidth = state.imageWidth / state.columns;
      const pieceHeight = state.imageHeight / state.rows;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('Canvas context failed');

      // We use a reasonable resolution for each piece to avoid huge PDFs
      // Max 2000px per dimension for source capture
      const scale = Math.min(1, 2000 / Math.max(pieceWidth, pieceHeight));
      canvas.width = pieceWidth * scale;
      canvas.height = pieceHeight * scale;

      for (let r = 0; r < state.rows; r++) {
        for (let c = 0; c < state.columns; c++) {
          if (r !== 0 || c !== 0) {
            doc.addPage(state.pageSize.toLowerCase(), pdfOrientation);
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            img,
            c * pieceWidth, r * pieceHeight, pieceWidth, pieceHeight,
            0, 0, canvas.width, canvas.height
          );

          const imgData = canvas.toDataURL('image/jpeg', 0.85);
          doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'MEDIUM');
        }
      }

      doc.save(`gridsplit-${state.pageSize}-${state.orientation}-${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. Try reducing the number of columns or rows.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <AdPlaceholder slot="top-banner" className="h-24" label="TOP ADVERTISEMENT" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
            <ControlPanel 
              state={state} 
              onChange={handleStateChange} 
              onDownload={generatePDF}
              isProcessing={isProcessing}
            />
            
            <div className="mt-6">
              <AdPlaceholder slot="sidebar-ad" className="h-[250px]" label="SIDEBAR AD" />
            </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
            <GridPreview state={state} />
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        What is GridSplit?
                    </h3>
                    <p className="text-sm leading-relaxed">
                        GridSplit is a free tool to print giant posters. It splits your image into multiple pages. 
                        Print them on standard A4 or A3 paper and tape them together for a huge result!
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        Smart Orientation
                    </h3>
                    <p className="text-sm leading-relaxed">
                        Switching to <b>Landscape</b> is better for wide photos. <b>Portrait</b> is better for tall ones. 
                        The tool automatically calculates the correct number of rows to avoid stretching your image.
                    </p>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <AdPlaceholder slot="bottom-footer-ad" className="h-32" label="FOOTER AD" />
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-400 text-xs font-medium">
          <p>© 2024 GridSplit - Fast & Professional Multi-Page PDF Poster Tool</p>
          <div className="mt-3 flex justify-center gap-6">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
