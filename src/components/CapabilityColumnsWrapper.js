import React from 'react';
import styled from 'styled-components';

const NoDataWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 200px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-top: 20px;
`;

const NoDataMessage = styled.div`
  font-size: 1rem;
  color: #888;
  text-align: center;
`;

const NoDataComponent = ({ language }) => {
    return (
        <NoDataWrapper>
            <NoDataMessage>
                {language === 'zh'
                    ? '没有找到能力数据，请检查配置或联系管理员'
                    : 'No capability data found. Please check configuration or contact administrator.'}
            </NoDataMessage>
        </NoDataWrapper>
    );
};

export default NoDataComponent; 