import { convertComponentsToData } from './architectureService';
import architectureData from '../data/architecture-cards.json';

// 获取当前基础URL，自动适应不同环境
const getBaseUrl = () => {
    // 检查当前环境是否有设置API URL
    const apiUrl = process.env.REACT_APP_API_URL;
    if (apiUrl) return apiUrl;

    // 自动计算API基础URL
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;

    // 使用当前页面的端口，而不是基于协议的默认端口
    const port = window.location.port;

    // 在代理环境中，可能不需要显式指定端口
    // 如果URL中已包含端口，或者是自定义域名(不是localhost)，不添加端口
    const isCustomDomain = hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '0.0.0.0';
    const portPart = (port && !isCustomDomain) ? `:${port}` : '';

    console.log('API基础URL计算:', { protocol, hostname, port, isCustomDomain });
    return `${protocol}//${hostname}${portPart}`;
};

// 构建API URL
const buildApiUrl = (path) => {
    const baseUrl = getBaseUrl();
    const fullUrl = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    console.log('构建API URL:', fullUrl);
    return fullUrl;
};

// 添加重试功能的API请求函数
const fetchWithRetry = async (url, options, maxRetries = 3) => {
    console.log(`尝试请求: ${url}`);
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`请求尝试 ${attempt}/${maxRetries}`);
            const response = await fetch(url, options);

            // 检查响应状态
            if (response.status === 503) {
                console.warn(`服务暂时不可用(503)，尝试 ${attempt}/${maxRetries}`);
                if (attempt < maxRetries) {
                    // 指数退避重试
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                    console.log(`等待 ${delay}ms 后重试...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
            }

            // 获取响应内容
            const responseText = await response.text();

            // 检查响应内容是否为有效的JSON
            try {
                // 尝试解析JSON
                const jsonData = JSON.parse(responseText);
                // 返回成功结果
                return {
                    ok: response.ok,
                    status: response.status,
                    data: jsonData,
                    isJson: true
                };
            } catch (jsonError) {
                console.error('响应不是有效的JSON:', responseText.substring(0, 100));
                // 如果无法解析为JSON，返回原始文本
                return {
                    ok: response.ok,
                    status: response.status,
                    text: responseText,
                    isJson: false,
                    parseError: jsonError.message
                };
            }
        } catch (error) {
            console.error(`请求失败 (尝试 ${attempt}/${maxRetries}):`, error);
            lastError = error;

            if (attempt < maxRetries) {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                console.log(`等待 ${delay}ms 后重试...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    // 所有重试都失败了
    throw new Error(`请求失败，已尝试 ${maxRetries} 次: ${lastError.message}`);
};

// 保存架构数据到服务器
export const saveToFile = async (components) => {
    try {
        console.log('准备将组件数据转换为保存格式...');
        const newData = convertComponentsToData(components, architectureData);
        console.log('数据转换完成, 准备发送到服务器');

        // 将数据分块发送，避免请求头过大
        const apiUrl = buildApiUrl('/api/save-architecture');
        console.log('发送保存请求到:', apiUrl);

        const result = await fetchWithRetry(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData)
        });

        console.log('保存请求响应:', result);

        // 检查响应格式和状态
        if (!result.ok) {
            if (result.isJson && result.data.error) {
                throw new Error(result.data.error.message || '服务器返回错误');
            } else {
                const errorMsg = result.isJson ? JSON.stringify(result.data) :
                    (result.text ? `服务器错误: ${result.text.substring(0, 100)}...` : `HTTP错误 ${result.status}`);
                throw new Error(errorMsg);
            }
        }

        if (!result.isJson) {
            throw new Error(`服务器返回了非JSON响应: ${result.text.substring(0, 100)}...`);
        }

        console.log('保存成功:', result.data);
        // 兼容旧版和新版API响应格式
        const versionData = result.data.data ? result.data.data.version : result.data.version;
        return { success: true, version: versionData };
    } catch (error) {
        console.error('保存文件失败:', error);
        throw new Error(`保存失败: ${error.message}`);
    }
};

// 从服务器获取最新的架构数据
export const getLatestArchitecture = async () => {
    try {
        const result = await fetchWithRetry(buildApiUrl('/api/get-architecture'), {
            method: 'GET'
        });

        if (!result.ok) {
            if (result.isJson && result.data.error) {
                throw new Error(result.data.error.message || '获取数据失败');
            } else {
                throw new Error(result.isJson ? JSON.stringify(result.data) :
                    `HTTP错误 ${result.status}: ${result.text?.substring(0, 100) || ''}`);
            }
        }

        if (!result.isJson) {
            throw new Error(`服务器返回了非JSON响应: ${result.text.substring(0, 100)}...`);
        }

        return result.data;
    } catch (error) {
        console.error('获取架构数据失败:', error);
        throw new Error(`获取数据失败: ${error.message}`);
    }
};

// 获取所有架构版本列表
export const getArchitectureVersions = async () => {
    try {
        const result = await fetchWithRetry(buildApiUrl('/api/architecture-versions'), {
            method: 'GET'
        });

        if (!result.ok) {
            if (result.isJson && result.data.error) {
                throw new Error(result.data.error.message || '获取版本列表失败');
            } else {
                throw new Error(result.isJson ? JSON.stringify(result.data) :
                    `HTTP错误 ${result.status}: ${result.text?.substring(0, 100) || ''}`);
            }
        }

        if (!result.isJson) {
            throw new Error(`服务器返回了非JSON响应: ${result.text.substring(0, 100)}...`);
        }

        return result.data;
    } catch (error) {
        console.error('获取版本列表失败:', error);
        throw new Error(`获取版本列表失败: ${error.message}`);
    }
};

// 获取指定版本的架构数据
export const getArchitectureVersion = async (fileName) => {
    try {
        const result = await fetchWithRetry(buildApiUrl(`/api/architecture-version/${fileName}`), {
            method: 'GET'
        });

        if (!result.ok) {
            if (result.isJson && result.data.error) {
                throw new Error(result.data.error.message || '获取版本数据失败');
            } else {
                throw new Error(result.isJson ? JSON.stringify(result.data) :
                    `HTTP错误 ${result.status}: ${result.text?.substring(0, 100) || ''}`);
            }
        }

        if (!result.isJson) {
            throw new Error(`服务器返回了非JSON响应: ${result.text.substring(0, 100)}...`);
        }

        return result.data;
    } catch (error) {
        console.error('获取版本数据失败:', error);
        throw new Error(`获取版本数据失败: ${error.message}`);
    }
}; 