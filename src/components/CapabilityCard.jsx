import React from 'react';
import CapabilityStats from './CapabilityStats';

const CapabilityCard = ({ card, category }) => {
    // 构建cardRef，格式为 "category/ref"
    const cardRef = `${category}/${card.ref}`;
    console.log('CapabilityCard cardRef:', cardRef);

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">
                    {typeof card.metadata.title === 'string' ? card.metadata.title : card.metadata.title.zh}
                </h3>
                <CapabilityStats cardRef={cardRef} />
            </div>
            <div className="space-y-2">
                {card.capabilities && card.capabilities.map(cap => (
                    <div key={cap.id} className="flex items-center justify-between">
                        <span>{typeof cap.name === 'string' ? cap.name : cap.name.zh}</span>
                        <span className={`px-2 py-1 rounded text-sm ${cap.status === 'ready' ? 'bg-green-100 text-green-800' :
                            cap.status === 'missing' ? 'bg-gray-100 text-gray-800' :
                                cap.status === 'needEnhancement' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
                            }`}>
                            {cap.status === 'ready' ? '就绪' :
                                cap.status === 'missing' ? '缺失' :
                                    cap.status === 'needEnhancement' ? '需要增强' :
                                        '草稿'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CapabilityCard; 