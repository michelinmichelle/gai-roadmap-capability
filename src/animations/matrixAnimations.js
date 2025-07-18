import { keyframes } from 'styled-components';

// 基本过渡效果
export const transitions = {
    default: { duration: 0.3 },
    slow: { duration: 0.5 },
    springy: { type: 'spring', stiffness: 300, damping: 20 },
    gentle: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
};

// 基本动画变体
export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transitions.default
};

export const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: transitions.default
};

export const slideDown = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: transitions.default
};

export const slideRight = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: transitions.default
};

export const slideLeft = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: transitions.default
};

export const scale = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: transitions.default
};

// 自定义动画
export const rowEntry = (index) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: index * 0.05 }
});

export const contentStagger = (delay = 0) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, delay }
});

// 动作动画变体
export const hoverScale = {
    scale: 1.05
};

export const tapScale = {
    scale: 0.95
};

export const hoverButton = {
    scale: 1.05,
    y: -2,
    transition: { duration: 0.2 }
};

export const hoverRotateRight = {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.2 }
};

export const hoverRotateLeft = {
    scale: 1.1,
    rotate: -5,
    transition: { duration: 0.2 }
};

// 状态图标动画
export const statusIconAnimations = {
    ready: {
        hover: { scale: 1.2, transition: { duration: 0.2 } }
    },
    partial: {
        hover: { scale: 1.2, rotate: 10, transition: { duration: 0.2 } }
    },
    missing: {
        hover: { scale: 1.2, rotate: -10, transition: { duration: 0.2 } }
    }
};

// 关键帧动画
export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
  100% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.3); }
`;

export const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// 页面转换动画
export const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 }
};

// 矩阵加载动画
export const matrixLoading = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.43, 0.13, 0.23, 0.96]
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: {
            duration: 0.3
        }
    }
};

// 矩阵导航按钮动画
export const navButtonAnimation = (isActive) => ({
    whileHover: { y: -2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' },
    whileTap: { y: 0, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' },
    initial: isActive ? { scale: 1.05 } : { scale: 1 },
    animate: isActive ? { scale: 1.05 } : { scale: 1 },
    transition: { duration: 0.2 }
}); 