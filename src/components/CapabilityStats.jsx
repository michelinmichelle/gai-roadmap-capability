import React, { useEffect, useState } from 'react';

const CapabilityStats = ({ cardRef }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        // 动态导入统计数据
        import('../data/capabilityStats.json')
            .then(statsData => {
                if (!cardRef) {
                    console.warn('No cardRef provided');
                    return;
                }

                const [category, ref] = cardRef.split('/');
                console.log('Looking for stats:', { category, ref, cardRef });

                const cardStats = statsData.default.stats.byCategory[category]?.cards.find(
                    card => card.ref === ref
                )?.stats;

                if (cardStats) {
                    console.log('Found stats:', cardStats);
                    setStats(cardStats);
                } else {
                    console.warn('No stats found for:', cardRef);
                }
            })
            .catch(error => {
                console.error('Error loading stats:', error);
            });
    }, [cardRef]);

    if (!stats) {
        return null;
    }

    return (
        <div className="flex flex-col space-y-2 mt-4 border-t border-gray-200 pt-4">
            <div className="flex flex-wrap gap-2">
                {stats.readyButEnhancement > 0 && (
                    <span className="px-2 py-1 text-xs rounded bg-yellow-900/30 text-yellow-200 whitespace-nowrap">
                        需增强: {stats.readyButEnhancement}
                    </span>
                )}
                {stats.criticalMissing > 0 && (
                    <span className="px-2 py-1 text-xs rounded bg-red-900/30 text-red-200 whitespace-nowrap">
                        关键缺失: {stats.criticalMissing}
                    </span>
                )}
                {stats.total > 0 && (
                    <span className="px-2 py-1 text-xs rounded bg-gray-800/30 text-gray-200 whitespace-nowrap">
                        总计: {stats.total}
                    </span>
                )}
            </div>
        </div>
    );
};

export default CapabilityStats; 