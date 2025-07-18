import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Primary colors */
    --primary-blue: #0a1929;
    --secondary-blue: #142c44;
    --accent-blue: #2563eb;
    
    /* Neon colors */
    --neon-pink: #ff00ff;
    --neon-blue: #00ffff;
    --neon-purple: #a855f7;
    
    /* Gradients */
    --gradient-blue: linear-gradient(135deg, #142c44, #0a1929);
    --gradient-neon: linear-gradient(90deg, var(--neon-blue), var(--neon-purple), var(--neon-pink));
    --gradient-card: linear-gradient(135deg, rgba(20, 44, 68, 0.8), rgba(10, 25, 41, 0.9));
    
    /* Font families */
    --font-tech: 'Michelin Unit Titling', sans-serif;
    --font-main: 'Open Sans', sans-serif;
    
    /* Sizes */
    --header-height: 80px;
    --sidebar-width: 250px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  body {
    background-color: var(--primary-blue);
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.15) 0%, transparent 30%),
      radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 30%);
    color: white;
    font-family: var(--font-main);
    line-height: 1.6;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-tech);
    font-weight: 600;
    line-height: 1.3;
  }

  a {
    color: var(--neon-blue);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: var(--neon-pink);
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--primary-blue);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--secondary-blue);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--accent-blue);
  }

  /* Utility classes */
  .tech-text {
    font-family: var(--font-tech);
  }

  .neon-text {
    background: var(--gradient-neon);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass-panel {
    background: rgba(20, 44, 68, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }

  .neon-border {
    position: relative;
  }
  
  .neon-border::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    box-shadow: 0 0 15px 2px var(--neon-purple);
    opacity: 0.5;
    z-index: -1;
  }

  .hexagon-pattern {
    background-color: rgba(10, 25, 41, 0.5);
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L45 15L45 35L30 45L15 35L15 15L30 5Z' stroke='%232563eb' stroke-opacity='0.1' stroke-width='1' fill='none'/%3E%3C/svg%3E");
  }
`;

export default GlobalStyles; 