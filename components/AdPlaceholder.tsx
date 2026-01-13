
import React from 'react';

interface AdPlaceholderProps {
  slot?: string;
  className?: string;
  label?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ slot, className = '', label = 'REKLAM ALANI' }) => {
  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden min-h-[100px] ${className}`}>
      <div className="text-center p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-[10px] text-gray-400 mt-1 italic">Google AdSense - {slot || 'Otomatik Reklam'}</p>
        {/* Real AdSense code would go here:
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot={slot}
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        */}
      </div>
    </div>
  );
};

export default AdPlaceholder;
