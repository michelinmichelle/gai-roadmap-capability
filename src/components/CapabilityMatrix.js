import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMatrixHierarchy } from '../services/matrixService';

// 导入样式
import {
    MatrixContainer, Title, Description, MatrixTable, Table, TableHeader, TableCell,
    MatrixNavigation, MatrixButton, SubMatrixButtons, SubMatrixButton,
    Legend, LegendItem, LegendSymbol, StatusSymbol, TooltipContent, StatusContainer,
    LoadingContainer, LoadingSpinner, LoadingText,
    ErrorContainer, ErrorIcon, ErrorMessage
} from '../styles/matrixStyles';

// 导入动画配置
import {
    fadeIn, slideUp, rowEntry, hoverScale, tapScale,
    contentStagger, navButtonAnimation, matrixLoading
} from '../animations/matrixAnimations';

// 能力矩阵组件
const CapabilityMatrix = ({ language = 'zh' }) => {
    const [matrixData, setMatrixData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentMatrixId, setCurrentMatrixId] = useState(null);

    // 加载矩阵数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getMatrixHierarchy(language);
                setMatrixData(data);

                // 默认显示第一个矩阵
                if (data.matrices && data.matrices.length > 0) {
                    setCurrentMatrixId(data.matrices[0].id);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching matrix data:', err);
                setError(language === 'zh' ? '无法加载矩阵数据。请稍后再试。' : 'Unable to load matrix data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, [language]);

    // 找到当前显示的矩阵
    const findCurrentMatrix = (matrices, id) => {
        if (!matrices) return null;

        for (const matrix of matrices) {
            if (matrix.id === id) {
                return matrix;
            }

            if (matrix.children && matrix.children.length > 0) {
                const found = findCurrentMatrix(matrix.children, id);
                if (found) return found;
            }
        }

        return null;
    };

    const currentMatrix = matrixData ? findCurrentMatrix(matrixData.matrices, currentMatrixId) : null;

    // 渲染矩阵导航按钮
    const renderMatrixNavigation = (matrices) => {
        if (!matrices) return null;

        return (
            <MatrixNavigation>
                {matrices.map(matrix => (
                    <MatrixButton
                        key={matrix.id}
                        active={currentMatrixId === matrix.id}
                        onClick={() => setCurrentMatrixId(matrix.id)}
                        {...navButtonAnimation(currentMatrixId === matrix.id)}
                    >
                        {matrix.title}
                    </MatrixButton>
                ))}
            </MatrixNavigation>
        );
    };

    // 渲染子矩阵按钮
    const renderSubMatrixButtons = (matrix) => {
        if (!matrix || !matrix.children || matrix.children.length === 0) return null;

        return (
            <SubMatrixButtons>
                {matrix.children.map(subMatrix => (
                    <SubMatrixButton
                        key={subMatrix.id}
                        active={currentMatrixId === subMatrix.id}
                        onClick={() => setCurrentMatrixId(subMatrix.id)}
                        whileHover={hoverScale}
                        whileTap={tapScale}
                    >
                        {subMatrix.title}
                    </SubMatrixButton>
                ))}
            </SubMatrixButtons>
        );
    };

    // 渲染当前矩阵表格
    const renderMatrixTable = (matrix) => {
        if (!matrix || !matrix.matrix) return null;

        const { headers, rows } = matrix.matrix;

        const getStatusLabel = (status) => {
            if (!matrixData || !matrixData.statusTypes) return '';
            const statusType = matrixData.statusTypes.find(t => t.symbol === status);
            return statusType ? statusType.label[language] : '';
        };

        return (
            <MatrixTable>
                <Table columnCount={headers.length}>
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <TableHeader key={index} isFirstColumn={index === 0}>
                                    {header}
                                </TableHeader>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <motion.tr
                                key={rowIndex}
                                {...rowEntry(rowIndex)}
                            >
                                <TableCell>{row.title}</TableCell>
                                {row.statuses.map((status, cellIndex) => (
                                    <TableCell key={cellIndex}>
                                        <StatusContainer>
                                            <StatusSymbol status={status}>
                                                {status}
                                            </StatusSymbol>
                                            <TooltipContent>
                                                {getStatusLabel(status)}
                                            </TooltipContent>
                                        </StatusContainer>
                                    </TableCell>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </Table>
            </MatrixTable>
        );
    };

    // 渲染图例
    const renderLegend = () => {
        if (!matrixData || !matrixData.statusTypes) return null;

        return (
            <Legend>
                {matrixData.statusTypes.map(status => (
                    <motion.div
                        key={status.id}
                        whileHover={hoverScale}
                        whileTap={tapScale}
                    >
                        <LegendItem>
                            <LegendSymbol>{status.symbol}</LegendSymbol>
                            <span>{status.label[language]}</span>
                        </LegendItem>
                    </motion.div>
                ))}
            </Legend>
        );
    };

    if (loading) {
        return (
            <LoadingContainer {...matrixLoading}>
                <LoadingSpinner
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <LoadingText>{language === 'zh' ? '加载中...' : 'Loading...'}</LoadingText>
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <ErrorContainer {...fadeIn}>
                <ErrorIcon>⚠️</ErrorIcon>
                <ErrorMessage>{error}</ErrorMessage>
            </ErrorContainer>
        );
    }

    if (!matrixData || !currentMatrix) {
        return (
            <ErrorContainer {...fadeIn}>
                <ErrorIcon>ℹ️</ErrorIcon>
                <ErrorMessage>{language === 'zh' ? '没有可用的矩阵数据' : 'No matrix data available'}</ErrorMessage>
            </ErrorContainer>
        );
    }

    return (
        <MatrixContainer>
            <motion.div
                {...fadeIn}
            >
                {renderMatrixNavigation(matrixData.matrices)}
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentMatrixId}
                    {...slideUp}
                >
                    <Title>{currentMatrix.title}</Title>
                    {currentMatrix.description && <Description>{currentMatrix.description}</Description>}

                    <motion.div
                        {...contentStagger(0.1)}
                    >
                        {renderLegend()}
                    </motion.div>

                    <motion.div
                        {...contentStagger(0.2)}
                    >
                        {renderMatrixTable(currentMatrix)}
                    </motion.div>

                    <motion.div
                        {...contentStagger(0.3)}
                    >
                        {renderSubMatrixButtons(currentMatrix)}
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </MatrixContainer>
    );
};

export default CapabilityMatrix; 