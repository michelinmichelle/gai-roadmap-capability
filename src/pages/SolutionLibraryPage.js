import React from 'react';
import styled from 'styled-components';
import SolutionGallery from '../components/SolutionGallery';

const PageContainer = styled.div`
  min-height: 100vh;
  background: transparent;
  padding: 2rem 0;
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 0 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #f0f9ff;
  margin-bottom: 1rem;
  font-family: var(--font-tech);
  
  background: linear-gradient(90deg, #00ffff, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  font-family: var(--font-main);
`;

const SolutionLibraryPage = ({ language }) => {
  const texts = {
    title: {
      zh: 'GAI 解决方案库',
      en: 'GAI Solution Library'
    },
    description: {
      zh: '探索我们的GAI平台演进之路，从基础RAG系统到智能代理RAG的发展历程。这里展示了我们在不同阶段的技术方案和架构设计。',
      en: 'Explore the evolution of our GAI platform, from basic RAG systems to intelligent agent RAG. Here we showcase our technical solutions and architectural designs at different stages.'
    }
  };

  return (
    <PageContainer>
      <Header>
        <Title>{texts.title[language]}</Title>
        <Description>
          {texts.description[language]}
        </Description>
      </Header>
      <SolutionGallery language={language} />
    </PageContainer>
  );
};

export default SolutionLibraryPage; 