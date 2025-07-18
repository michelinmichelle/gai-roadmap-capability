import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Blurhash } from 'react-blurhash';

const GalleryContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
`;

const MainImageContainer = styled(motion.div)`
  width: 100%;
  height: 600px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  background: #ffffff;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const MainImage = styled(motion.img)`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  opacity: ${props => props.$isLoaded ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const ImagePlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
  position: relative;
  margin: 0 4rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1rem;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.7);
    border-radius: 4px;
    &:hover {
      background-color: rgba(155, 155, 155, 0.9);
    }
  }
`;

const ThumbnailTitle = styled.div`
  color: #ffffff;
  font-size: 11px;
  text-align: center;
  width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 1.2;
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  white-space: nowrap;
  cursor: default;

  &:hover {
    height: auto;
    max-height: none;
    -webkit-line-clamp: unset;
    white-space: normal;
    background: rgba(0, 0, 0, 0.9);
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`;

const ThumbnailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 120px;
  position: relative;

  &:hover ${ThumbnailTitle} {
    height: auto;
    max-height: none;
    -webkit-line-clamp: unset;
    background: rgba(0, 0, 0, 0.9);
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`;

const Thumbnail = styled(motion.div)`
  width: 120px;
  height: 90px;
  cursor: pointer;
  position: relative;
  border: ${props => props.$isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9'};
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
  margin-bottom: 28px;
  
  img, object {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    border-color: #1890ff;
  }
`;

const ThumbnailNavButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 18px;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  &.prev {
    left: 0;
  }

  &.next {
    right: 0;
  }
`;

const ImageTitle = styled(motion.h2)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  font-size: 1.25rem;
`;

const ZoomModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 60px 20px 20px;
  cursor: zoom-out;
`;

const ZoomContent = styled(motion.div)`
  width: 100%;
  max-width: 95vw;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  margin: 0 auto;
  
  img, object {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

const ZoomedImage = styled(motion.img)`
  max-width: 100%;
  height: auto;
  object-fit: contain;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const ZoomedSvg = styled(motion.object)`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 12px;
  padding: 20px;
`;

const CloseButton = styled(motion.button)`
  position: fixed;  /* Changed from absolute to fixed */
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 24px;
  z-index: 1001;
  pointer-events: auto;  /* Ensure button is clickable */
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const ZoomHint = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  pointer-events: none;
  opacity: 0.8;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const ErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  color: #ff4d4f;
`;

const imageVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
    })
};

// 添加一个工具函数来处理图片URL
const processImageUrl = (url) => {
    // 使用当前页面的协议和主机名
    const baseUrl = window.location.origin;
    // 移除开头的斜杠并将URL与基础URL拼接
    const processedUrl = url.startsWith('/') ? url.slice(1) : url;
    return `${baseUrl}/${processedUrl}`;
};

const SolutionGallery = ({ language }) => {
    const [images, setImages] = useState([
        {
            src: '/data/solution-libarary/01-we-upgrade-to-advanced-RAG.png',
            title: {
                zh: '升级至高级RAG系统',
                en: 'Upgrade to Advanced RAG System'
            },
            type: 'image'
        },
        {
            src: '/data/solution-libarary/02-we-deploy-native-RAG-in-2024-Oct.png',
            title: {
                zh: '2024年10月：部署原生RAG系统',
                en: 'Oct 2024: Deploy Native RAG System'
            },
            type: 'image'
        },
        {
            src: '/data/solution-libarary/03-we-agentic-rag.png',
            title: {
                zh: '智能代理RAG系统',
                en: 'Agentic RAG System'
            },
            type: 'image'
        },
        {
            src: '/data/solution-libarary/10-customer-ai-after.png',
            title: {
                zh: '客服 AI 优化后',
                en: 'Customer AI After'
            },
            type: 'image'
        },
        {
            src: '/data/solution-libarary/11-customer-service-AI-agent.png',
            title: {
                zh: '客服 AI 代理',
                en: 'Customer Service AI Agent'
            },
            type: 'image'
        },
        {
            src: '/data/solution-libarary/deep-research.png',
            title: {
                zh: '深度研究',
                en: 'Deep Research'
            },
            type: 'image'
        },
        {
            src: '/data/solution-libarary/knowledge-flow.jpeg',
            title: {
                zh: '知识流程',
                en: 'Knowledge Flow'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/Capability-Map-Expectation.png',
            title: {
                zh: 'GAI能力地图总览',
                en: 'GAI Capability Map Overview'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/2-1-Agentic-RAG.png',
            title: {
                zh: '智能RAG系统',
                en: 'Agentic RAG System'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/2-3-3-Modular-RAG.png',
            title: {
                zh: '模块化RAG系统',
                en: 'Modular RAG System'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/2-3-5-Agentic-RAG-Graph-RAG.png',
            title: {
                zh: '智能RAG与图RAG系统',
                en: 'Agentic RAG & Graph RAG'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/2-4-Comparative-RAG.png',
            title: {
                zh: 'RAG系统对比',
                en: 'Comparative RAG Systems'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/3-0-AI-Agent.png',
            title: {
                zh: 'AI代理系统',
                en: 'AI Agent System'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/3-1-Agentic-Self-Reflection.png',
            title: {
                zh: '智能自反思',
                en: 'Agentic Self Reflection'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/3-4-a-Multi-Agent-Agentic-Planning.png',
            title: {
                zh: '多代理智能规划',
                en: 'Multi-Agent Planning'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/3-4-b-Multi-Agent-Agentic-Tool-Use.png',
            title: {
                zh: '多代理工具使用',
                en: 'Multi-Agent Tool Use'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/4-1-Illustration-Prompt-Chaining-Workflow.png',
            title: {
                zh: '提示词链式工作流',
                en: 'Prompt Chaining Workflow'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/4-2-Routing-Workflow.png',
            title: {
                zh: '路由工作流',
                en: 'Routing Workflow'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/4-3-Parallelization-Speeding-Up-Processing-Through-Concurrent-Execution.png',
            title: {
                zh: '并行处理加速',
                en: 'Parallel Processing Speedup'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/4-4-Orchestrator-Workers-Dynamic-Task-Delegation.png',
            title: {
                zh: '编排器-工作者动态任务分配',
                en: 'Orchestrator-Workers Task Delegation'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/4-5-Evaluator-Optimizer-Refining-Output-Through-Iteration.png',
            title: {
                zh: '评估器-优化器迭代优化',
                en: 'Evaluator-Optimizer Iteration'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/5-1-Single-Agent-Agentic-RAG-Router.png',
            title: {
                zh: '单代理智能RAG路由',
                en: 'Single-Agent RAG Router'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/5-2-Multi-Agent-Agentic-RAG-Systems.png',
            title: {
                zh: '多代理智能RAG系统',
                en: 'Multi-Agent RAG Systems'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/5-3-Hierarchical-Agentic-RAG-Systems.png',
            title: {
                zh: '分层智能RAG系统',
                en: 'Hierarchical RAG Systems'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/5-4-Agentic-Corrective-RAG.png',
            title: {
                zh: '智能纠错RAG',
                en: 'Agentic Corrective RAG'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/5-5-Adaptive-Agentic-RAG.png',
            title: {
                zh: '自适应智能RAG',
                en: 'Adaptive Agentic RAG'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/5-6-Graph-Based-Agentic-RAG.png',
            title: {
                zh: '基于图的智能RAG',
                en: 'Graph-Based Agentic RAG'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/5-7-Agentic-Document-Workflows-in-Agentic-RAG.png',
            title: {
                zh: '智能文档工作流',
                en: 'Agentic Document Workflows'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/6-Traditional-RAG-VS-Agentic-RAG-VS-Agentic-Document-Workflows.png',
            title: {
                zh: '传统RAG vs 智能RAG vs 智能文档工作流',
                en: 'Traditional vs Agentic RAG vs Document Workflows'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/04-Agent-Key-Factor.png',
            title: {
                zh: '代理关键因素',
                en: 'Agent Key Factors'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/05-Agentic-RAG-workflow.png',
            title: {
                zh: '智能RAG工作流',
                en: 'Agentic RAG Workflow'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/06-Agentic-Workflow-Planning-pattern.png',
            title: {
                zh: '智能工作流规划模式',
                en: 'Agentic Workflow Planning Pattern'
            },
            type: 'image'
        },
        {
            src: 'data/solution-libarary/05-Workflow-VS-RP-VS-AgenticFlow.png',
            title: {
                zh: '工作流 vs RP vs 智能流',
                en: 'Workflow vs RP vs Agentic Flow'
            },
            type: 'image'
        }
    ]);

    const [[page, direction], setPage] = useState([0, 0]);
    const [dragStart, setDragStart] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const thumbnailContainerRef = React.useRef(null);
    const [imageStates, setImageStates] = useState({});
    const [loading, setLoading] = useState({});
    const [errors, setErrors] = useState({});

    const imageIndex = ((page % images.length) + images.length) % images.length;
    const currentImage = images[imageIndex];

    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
    };

    const handleDragStart = (event, info) => {
        setDragStart(info.point.x);
    };

    const handleDragEnd = (event, info) => {
        const dragEnd = info.point.x;
        const dragDistance = dragEnd - dragStart;
        const dragThreshold = 50;

        if (Math.abs(dragDistance) > dragThreshold) {
            if (dragDistance > 0) {
                paginate(-1);
            } else {
                paginate(1);
            }
        }
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    const handleImageClick = () => {
        setIsZoomed(true);
    };

    const handleCloseZoom = () => {
        setIsZoomed(false);
    };

    const scrollThumbnails = (direction) => {
        if (thumbnailContainerRef.current) {
            const scrollAmount = direction * 300; // 每次滚动300px
            thumbnailContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleImageLoad = (src) => {
        setLoading(prev => ({ ...prev, [src]: false }));
        setErrors(prev => ({ ...prev, [src]: false }));
        setImageStates(prev => ({ ...prev, [src]: true }));
    };

    const handleImageError = (e) => {
        const src = e.target.src;
        console.error('Image failed to load:', src);
        setErrors(prev => ({ ...prev, [src]: true }));
        setLoading(prev => ({ ...prev, [src]: false }));
        setImageStates(prev => ({ ...prev, [src]: false }));
        e.target.style.display = 'none';
    };

    const handleImageStartLoad = (src) => {
        setLoading(prev => ({ ...prev, [src]: true }));
    };

    // 在图片加载前预加载下一张图片
    useEffect(() => {
        const nextIndex = (imageIndex + 1) % images.length;
        const nextImage = new Image();
        nextImage.src = images[nextIndex].src;
    }, [imageIndex, images]);

    // 生成缩略图URL
    const getThumbnailUrl = (src) => {
        const baseUrl = processImageUrl(src);
        const url = new URL(baseUrl);
        url.searchParams.set('width', '120');
        url.searchParams.set('quality', '60');
        return url.toString();
    };

    // 生成预览图URL
    const getPreviewUrl = (src) => {
        const baseUrl = processImageUrl(src);
        const url = new URL(baseUrl);
        url.searchParams.set('width', '800');
        url.searchParams.set('quality', '80');
        return url.toString();
    };

    // 在 SolutionGallery 组件内添加 useEffect
    useEffect(() => {
        if (isZoomed) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isZoomed]);

    return (
        <>
            <GalleryContainer>
                <MainImageContainer onClick={handleImageClick} style={{ cursor: 'zoom-in' }}>
                    {loading[currentImage.src] && (
                        <LoadingOverlay>
                            <div>加载中...</div>
                        </LoadingOverlay>
                    )}
                    {errors[currentImage.src] && (
                        <ErrorOverlay>
                            <div>图片加载失败</div>
                            <div style={{ fontSize: '12px', marginTop: '8px' }}>
                                {currentImage.title[language]}
                            </div>
                        </ErrorOverlay>
                    )}
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '4px',
                        zIndex: 1,
                        maxWidth: '80%',
                        wordBreak: 'break-word'
                    }}>
                        {currentImage.title[language]}
                    </div>
                    <AnimatePresence initial={false} custom={direction}>
                        {!imageStates[currentImage.src] && (
                            <ImagePlaceholder>
                                <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
                            </ImagePlaceholder>
                        )}
                        {currentImage.type === 'svg' ? (
                            <MainImage
                                key={page}
                                as="object"
                                data={currentImage.src}
                                type="image/svg+xml"
                                custom={direction}
                                variants={imageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    background: 'white',
                                    padding: '20px',
                                    borderRadius: '8px'
                                }}
                                onLoad={() => handleImageLoad(currentImage.src)}
                                onError={(e) => handleImageError(e)}
                            />
                        ) : (
                            <MainImage
                                key={page}
                                src={getPreviewUrl(currentImage.src)}
                                alt={currentImage.title[language]}
                                custom={direction}
                                variants={imageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                $isLoaded={imageStates[currentImage.src]}
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                onLoad={() => handleImageLoad(currentImage.src)}
                                onError={(e) => handleImageError(e)}
                                loading="eager"
                                decoding="async"
                                style={{ display: errors[currentImage.src] ? 'none' : 'block' }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDrag={(e, { offset, velocity }) => {
                                    const swipe = swipePower(offset.x, velocity.x);
                                    if (swipe < -swipeConfidenceThreshold) {
                                        paginate(1);
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        paginate(-1);
                                    }
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <ThumbnailNavButton
                        className="prev"
                        onClick={(e) => {
                            e.stopPropagation();
                            paginate(-1);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        ←
                    </ThumbnailNavButton>
                    <ThumbnailNavButton
                        className="next"
                        onClick={(e) => {
                            e.stopPropagation();
                            paginate(1);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        →
                    </ThumbnailNavButton>
                    <ZoomHint>{language === 'zh' ? '点击查看大图' : 'Click to zoom'}</ZoomHint>
                </MainImageContainer>

                <div style={{ position: 'relative' }}>
                    <ThumbnailContainer ref={thumbnailContainerRef}>
                        {images.map((image, index) => (
                            <ThumbnailWrapper key={index}>
                                <ThumbnailTitle>
                                    {image.src.split('/').pop().replace(/\.[^/.]+$/, '')}
                                </ThumbnailTitle>
                                <Thumbnail
                                    $isSelected={index === imageIndex}
                                    onClick={() => setPage([index, index > imageIndex ? 1 : -1])}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        opacity: errors[image.src] ? 0.5 : 1
                                    }}
                                >
                                    {loading[image.src] && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            zIndex: 2
                                        }}>
                                            <div style={{ fontSize: '12px' }}>加载中...</div>
                                        </div>
                                    )}
                                    {image.type === 'svg' ? (
                                        <object
                                            data={image.src}
                                            type="image/svg+xml"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                background: 'white',
                                                padding: '4px',
                                                borderRadius: '4px'
                                            }}
                                            aria-label={image.title[language]}
                                            onLoad={() => handleImageLoad(image.src)}
                                            onError={(e) => handleImageError(e)}
                                        />
                                    ) : (
                                        <img
                                            src={getThumbnailUrl(image.src)}
                                            alt={image.title[language]}
                                            onLoad={() => handleImageLoad(image.src)}
                                            onError={(e) => handleImageError(e)}
                                            loading="eager"
                                            decoding="async"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                padding: '4px',
                                                display: errors[image.src] ? 'none' : 'block'
                                            }}
                                        />
                                    )}
                                    {errors[image.src] && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            color: '#ff4d4f',
                                            fontSize: '12px',
                                            textAlign: 'center'
                                        }}>
                                            加载失败
                                        </div>
                                    )}
                                </Thumbnail>
                            </ThumbnailWrapper>
                        ))}
                    </ThumbnailContainer>
                    <ThumbnailNavButton
                        className="prev"
                        onClick={() => scrollThumbnails(-1)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        ←
                    </ThumbnailNavButton>
                    <ThumbnailNavButton
                        className="next"
                        onClick={() => scrollThumbnails(1)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        →
                    </ThumbnailNavButton>
                </div>
            </GalleryContainer>

            <AnimatePresence>
                {isZoomed && (
                    <ZoomModal
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseZoom}
                    >
                        <CloseButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCloseZoom();
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            ×
                        </CloseButton>
                        <ZoomContent
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            transition={{ type: "spring", damping: 20 }}
                        >
                            {currentImage.type === 'svg' ? (
                                <ZoomedSvg
                                    data={processImageUrl(currentImage.src)}
                                    type="image/svg+xml"
                                    aria-label={currentImage.title[language]}
                                />
                            ) : (
                                <ZoomedImage
                                    src={processImageUrl(currentImage.src)}
                                    alt={currentImage.title[language]}
                                />
                            )}
                        </ZoomContent>
                    </ZoomModal>
                )}
            </AnimatePresence>
        </>
    );
};

export default SolutionGallery; 