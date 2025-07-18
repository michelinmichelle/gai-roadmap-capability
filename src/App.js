import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import TechRoadmap from './components/TechRoadmap';
import ArchitectureView from './components/ArchitectureView';
import CapabilityMatrix from './components/CapabilityMatrix';
import SolutionLibraryPage from './pages/SolutionLibraryPage';
import BackgroundEffect from './components/BackgroundEffect';
import defaultRoadmapData from './data/roadmap.json';

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a, #1e1b4b);
  color: #f8fafc;
`;

const ContentContainer = styled.div`
  width: 100%;
  padding-top: var(--header-height);
  z-index: 1;
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(71, 85, 105, 0.3);
`;

const NavButton = styled.button`
  background: ${props => props.$isActive ? 'rgba(139, 92, 246, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.$isActive ? 'rgba(139, 92, 246, 0.6)' : 'rgba(71, 85, 105, 0.3)'};
  color: #f0f9ff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-family: var(--font-tech);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.4);
  }
`;

function App() {
    const [language, setLanguage] = useState('zh');
    const [error, setError] = useState(null);
    const [roadmapData, setRoadmapData] = useState(defaultRoadmapData);
    const [view, setView] = useState('architecture'); // 'roadmap', 'architecture', 'capability', 'solutions'

    const toggleLanguage = () => {
        setLanguage(language === 'zh' ? 'en' : 'zh');
    };

    const handleFileUpload = (newData) => {
        try {
            // 验证上传的数据是否符合预期结构
            if (!newData.quarters || !Array.isArray(newData.quarters)) {
                throw new Error(language === 'zh' ? '无效的路线图数据格式' : 'Invalid roadmap data format');
            }

            setRoadmapData(newData);
            setError(null);
        } catch (err) {
            console.error('Error processing uploaded file:', err);
            setError(err.message);
        }
    };

    if (error) {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h1>{language === 'zh' ? '错误' : 'Error'}</h1>
                <p>{error}</p>
                <button
                    onClick={() => {
                        setRoadmapData(defaultRoadmapData);
                        setError(null);
                    }}
                    style={{
                        padding: '8px 16px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    {language === 'zh' ? '重置为默认数据' : 'Reset to Default Data'}
                </button>
            </div>
        );
    }

    // 根据当前视图渲染不同内容
    const renderContent = () => {
        switch (view) {
            case 'roadmap':
                return (
                    <TechRoadmap
                        roadmapData={roadmapData}
                        language={language}
                    />
                );
            case 'architecture':
                return <ArchitectureView language={language} />;
            case 'capability':
                return <CapabilityMatrix language={language} />;
            case 'solutions':
                return <SolutionLibraryPage />;
            default:
                return <ArchitectureView language={language} />;
        }
    };

    return (
        <AppContainer>
            <BackgroundEffect />

            <Header
                language={language}
                toggleLanguage={toggleLanguage}
            />

            <ContentContainer>
                <NavBar>
                    <NavButton
                        $isActive={view === 'roadmap'}
                        onClick={() => setView('roadmap')}
                    >
                        {language === 'zh' ? '路线图' : 'Roadmap'}
                    </NavButton>
                    <NavButton
                        $isActive={view === 'architecture'}
                        onClick={() => setView('architecture')}
                    >
                        {language === 'zh' ? '架构图' : 'Architecture'}
                    </NavButton>
                    <NavButton
                        $isActive={view === 'capability'}
                        onClick={() => setView('capability')}
                    >
                        {language === 'zh' ? '能力矩阵' : 'Capability Matrix'}
                    </NavButton>
                    <NavButton
                        $isActive={view === 'solutions'}
                        onClick={() => setView('solutions')}
                    >
                        {language === 'zh' ? '解决方案库' : 'Solution Library'}
                    </NavButton>
                </NavBar>
                {renderContent()}
            </ContentContainer>
        </AppContainer>
    );
}

export default App;