import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from './styles/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import './styles/fonts.css';
import capabilityMapService from './services/capabilityMapService';

// 初始化能力地图服务已在导入时自动完成
// 这里不需要再调用初始化方法

// 屏蔽 React 的各种属性相关警告
// 这种方法更可靠地过滤警告消息
if (process.env.NODE_ENV === 'development') {
    // 保存原始的 console.error 和 console.warn
    const originalError = console.error;
    const originalWarn = console.warn;

    // 过滤各种 React 警告
    const filterWarning = (args) => {
        if (typeof args[0] !== 'string') return false;

        // defaultProps 在 memo 组件中的警告
        if (args[0].includes('defaultProps will be removed from memo components') ||
            args[0].includes('Connect(Droppable): Support for defaultProps')) {
            return true;
        }

        // 非布尔属性警告
        if (args[0].includes('Received `true` for a non-boolean attribute') &&
            (args[0].includes('`compact`') ||
                args[0].includes('compact='))) {
            return true;
        }

        // styled-components 属性警告
        if (args[0].includes('styled-components:') &&
            (args[0].includes('it looks like an unknown prop') ||
                args[0].includes('unknown props are being sent'))) {
            return true;
        }

        return false;
    };

    // 重写 console.error
    console.error = (...args) => {
        if (filterWarning(args)) return;
        originalError.apply(console, args);
    };

    // 重写 console.warn
    console.warn = (...args) => {
        if (filterWarning(args)) return;
        originalWarn.apply(console, args);
    };
}

const theme = {
    breakpoints: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        xxl: '1400px'
    }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <App />
        </ThemeProvider>
    </React.StrictMode>
); 