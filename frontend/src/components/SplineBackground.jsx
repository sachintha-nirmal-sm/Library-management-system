// src/components/SplineBackground.jsx
import React, { useEffect } from 'react';

const SplineBackground = () => {
  useEffect(() => {
    // Dynamically add the Spline script to the document head
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.76/build/spline-viewer.js';
    script.type = 'module';
    document.head.appendChild(script);



    // Cleanup: Remove the script when the component unmounts
    return () => {
      document.head.removeChild(script);
    };


  }, []);

  return (
    <div style={{ 
      position: 'fixed', // Fix the Spline viewer in place
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1, // Ensure it stays behind other content
      pointerEvents: 'none', // Make it non-interactive
    }}>
      <spline-viewer
        url="https://prod.spline.design/kqKd0a4SDk5kd-Oq/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      ></spline-viewer>
    </div>
  );
};

export default SplineBackground;
