import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const UploaderContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
`;

const UploadButton = styled(motion.button)`
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.6);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #f0f9ff;
  font-size: 24px;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(139, 92, 246, 0.3);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
  }
`;

const UploadPanel = styled(motion.div)`
  position: absolute;
  bottom: 60px;
  right: 0;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

const PanelTitle = styled.h3`
  color: #f0f9ff;
  font-size: 16px;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #a855f7;
    margin-right: 8px;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(139, 92, 246, 0.4);
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
  
  &:hover {
    border-color: rgba(139, 92, 246, 0.8);
    background: rgba(139, 92, 246, 0.1);
  }
`;

const UploadIcon = styled.div`
  font-size: 30px;
  margin-bottom: 10px;
  color: #a855f7;
`;

const UploadText = styled.div`
  color: rgba(219, 234, 254, 0.8);
  font-size: 14px;
  text-align: center;
`;

const FileName = styled.div`
  color: #f0f9ff;
  font-size: 14px;
  margin-top: 10px;
  background: rgba(139, 92, 246, 0.2);
  padding: 5px 10px;
  border-radius: 4px;
  word-break: break-all;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, #8b5cf6, #d946ef);
  border: none;
  border-radius: 6px;
  color: white;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  
  &:disabled {
    background: rgba(71, 85, 105, 0.5);
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: ${props => props.success ? '#10b981' : '#ef4444'};
`;

const FileUploader = ({ onFileUpload, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState({ message: '', success: false });

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      // 关闭面板时重置状态
      setSelectedFile(null);
      setStatus({ message: '', success: false });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        setSelectedFile(file);
        setStatus({ message: '', success: false });
      } else {
        setSelectedFile(null);
        setStatus({
          message: language === 'zh' ? '请选择JSON文件' : 'Please select a JSON file',
          success: false
        });
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        onFileUpload(json);
        setStatus({
          message: language === 'zh' ? '上传成功！' : 'Upload successful!',
          success: true
        });

        // 3秒后关闭面板
        setTimeout(() => {
          setIsOpen(false);
          setSelectedFile(null);
          setStatus({ message: '', success: false });
        }, 3000);
      } catch (error) {
        setStatus({
          message: language === 'zh' ? '无效的JSON文件' : 'Invalid JSON file',
          success: false
        });
      }
    };
    reader.readAsText(selectedFile);
  };

  return (
    <UploaderContainer>
      <UploadButton
        onClick={togglePanel}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? '×' : '↑'}
      </UploadButton>

      {isOpen && (
        <UploadPanel
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PanelTitle>
            {language === 'zh' ? '上传路线图数据' : 'Upload Roadmap Data'}
          </PanelTitle>

          <UploadLabel htmlFor="file-upload">
            <UploadIcon>📄</UploadIcon>
            <UploadText>
              {language === 'zh' ? '点击或拖拽JSON文件到此处' : 'Click or drag JSON file here'}
            </UploadText>
            <FileInput
              id="file-upload"
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
            />
            {selectedFile && <FileName>{selectedFile.name}</FileName>}
          </UploadLabel>

          <ActionButton
            onClick={handleUpload}
            disabled={!selectedFile}
            whileHover={selectedFile ? { scale: 1.03 } : {}}
            whileTap={selectedFile ? { scale: 0.97 } : {}}
          >
            {language === 'zh' ? '上传文件' : 'Upload File'}
          </ActionButton>

          {status.message && (
            <StatusMessage success={status.success}>
              {status.message}
            </StatusMessage>
          )}
        </UploadPanel>
      )}
    </UploaderContainer>
  );
};

export default FileUploader; 