const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imageMiddleware = async (req, res, next) => {
    // 只处理图片请求
    if (!req.path.match(/\.(jpg|jpeg|png|webp)$/i)) {
        return next();
    }

    try {
        const width = parseInt(req.query.width) || null;
        const quality = parseInt(req.query.quality) || 80;

        // 获取图片文件路径
        const imagePath = path.join(__dirname, '..', 'public', req.path);

        // 检查文件是否存在
        if (!fs.existsSync(imagePath)) {
            return res.status(404).send('Image not found');
        }

        // 读取原始图片
        let image = sharp(imagePath);

        // 获取图片信息
        const metadata = await image.metadata();

        // 如果请求的宽度大于原始宽度，使用原始尺寸
        if (width && width < metadata.width) {
            image = image.resize(width, null, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // 根据文件类型设置压缩选项
        if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
            image = image.jpeg({ quality });
        } else if (metadata.format === 'png') {
            image = image.png({ quality });
        } else if (metadata.format === 'webp') {
            image = image.webp({ quality });
        }

        // 设置缓存头
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.setHeader('Content-Type', `image/${metadata.format}`);

        // 输出处理后的图片
        image.pipe(res);
    } catch (error) {
        console.error('Image processing error:', error);
        next(error);
    }
};

module.exports = imageMiddleware; 