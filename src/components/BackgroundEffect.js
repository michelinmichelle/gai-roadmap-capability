import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

const GridCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
`;

const BackgroundEffect = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // 重新初始化粒子
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    color: Math.random() > 0.2 ? '#00ffff' : (Math.random() > 0.5 ? '#ff00ff' : '#a855f7'),
                    speed: Math.random() * 0.5 + 0.1,
                    direction: Math.random() * Math.PI * 2
                });
            }
        };

        const drawGrid = () => {
            const gridSize = 40;
            ctx.strokeStyle = 'rgba(37, 99, 235, 0.1)';
            ctx.lineWidth = 0.5;

            // 绘制垂直线
            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            // 绘制水平线
            for (let y = 0; y <= canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        };

        const drawParticles = () => {
            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color + '40'; // 添加透明度
                ctx.fill();

                // 移动粒子
                particle.x += Math.cos(particle.direction) * particle.speed;
                particle.y += Math.sin(particle.direction) * particle.speed;

                // 边界检查
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
            });
        };

        const drawHexagonPattern = () => {
            const hexSize = 60;
            const halfHex = hexSize / 2;
            ctx.strokeStyle = 'rgba(37, 99, 235, 0.1)';
            ctx.lineWidth = 0.5;

            for (let y = 0; y <= canvas.height + hexSize; y += hexSize * 1.5) {
                for (let x = 0; x <= canvas.width + hexSize; x += hexSize * 2) {
                    const offsetX = y % (hexSize * 3) === 0 ? 0 : hexSize;

                    ctx.beginPath();
                    ctx.moveTo(x + offsetX, y);
                    for (let i = 0; i < 6; i++) {
                        const angle = Math.PI / 3 * i;
                        ctx.lineTo(
                            x + offsetX + halfHex * Math.cos(angle),
                            y + halfHex * Math.sin(angle)
                        );
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawHexagonPattern();
            drawParticles();
            animationFrameId = window.requestAnimationFrame(render);
        };

        // 初始化
        resize();
        window.addEventListener('resize', resize);
        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <BackgroundContainer>
            <GridCanvas ref={canvasRef} />
        </BackgroundContainer>
    );
};

export default BackgroundEffect; 