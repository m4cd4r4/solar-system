import React, { useState } from 'react';

const SolarVortex = ({ 
  height = '800px', 
  showHeader = true,
  showInfo = true 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const toggleFullscreen = () => {
    const iframe = document.getElementById('solar-vortex-iframe');
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  return (
    <div className="solar-vortex-wrapper" style={styles.wrapper}>
      {showHeader && (
        <div style={styles.header}>
          <h2 style={styles.title}>⚡ Solar System Vortex</h2>
          <p style={styles.subtitle}>
            Interactive visualization of planetary orbits through space
          </p>
        </div>
      )}

      <div style={{ ...styles.iframeContainer, height }}>
        {isLoading && (
          <div style={styles.loading}>
            <div style={styles.loadingSpinner}>🌌</div>
            <p>Loading visualization...</p>
          </div>
        )}
        
        <button 
          style={styles.fullscreenBtn}
          onClick={toggleFullscreen}
          title="Fullscreen"
        >
          ⛶
        </button>

        <iframe
          id="solar-vortex-iframe"
          src="/solar_vortex.html"
          style={styles.iframe}
          title="Solar System Vortex"
          onLoad={handleLoad}
          allowFullScreen
        />
      </div>

      {showInfo && (
        <div style={styles.infoGrid}>
          <InfoCard 
            icon="🎮"
            title="Interactive Controls"
            text="Adjust sun speed, orbital speed, and time progression. Toggle planet labels, moons, and particle effects."
          />
          <InfoCard 
            icon="🌍"
            title="Planetary Events"
            text="Track upcoming conjunctions and oppositions between planets with precise dates."
          />
          <InfoCard 
            icon="🌙"
            title="Moon Systems"
            text="Explore 16 moons orbiting their parent planets throughout the solar system."
          />
          <InfoCard 
            icon="📊"
            title="Real-Time Stats"
            text="Monitor distance traveled, simulation time, and current date as the system evolves."
          />
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ icon, title, text }) => (
  <div style={styles.infoCard}>
    <div style={styles.infoIcon}>{icon}</div>
    <h3 style={styles.infoTitle}>{title}</h3>
    <p style={styles.infoText}>{text}</p>
  </div>
);

const styles = {
  wrapper: {
    background: 'rgba(10, 10, 25, 0.8)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(100, 150, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  header: {
    padding: '30px',
    background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.2) 0%, rgba(138, 43, 226, 0.2) 100%)',
    borderBottom: '1px solid rgba(100, 150, 255, 0.3)',
  },
  title: {
    color: '#6495ff',
    fontSize: '28px',
    marginBottom: '8px',
    fontWeight: '600',
  },
  subtitle: {
    color: '#aaa',
    fontSize: '14px',
    margin: 0,
  },
  iframeContainer: {
    position: 'relative',
    background: '#000',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#6495ff',
    zIndex: 10,
  },
  loadingSpinner: {
    fontSize: '48px',
    animation: 'spin 2s linear infinite',
    marginBottom: '10px',
  },
  fullscreenBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'rgba(100, 150, 255, 0.2)',
    border: '1px solid rgba(100, 150, 255, 0.5)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    zIndex: 100,
    transition: 'all 0.3s',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    padding: '30px',
    background: 'rgba(10, 10, 25, 0.6)',
    borderTop: '1px solid rgba(100, 150, 255, 0.3)',
  },
  infoCard: {
    padding: '20px',
    background: 'rgba(100, 150, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(100, 150, 255, 0.2)',
  },
  infoIcon: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  infoTitle: {
    color: '#6495ff',
    fontSize: '18px',
    marginBottom: '10px',
    fontWeight: '600',
  },
  infoText: {
    color: '#aaa',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0,
  },
};

export default SolarVortex;

// Usage Example:
// import SolarVortex from './components/SolarVortex';
// 
// function App() {
//   return (
//     <div className="page">
//       <SolarVortex height="800px" showHeader={true} showInfo={true} />
//     </div>
//   );
// }
