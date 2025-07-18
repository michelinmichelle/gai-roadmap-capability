import { CardUpdater } from '../utils/cardUpdater';

async function main() {
    // 初始化更新器
    const updater = new CardUpdater('/Users/min/cursor_repo/demo-gai-roadmap-tech/src/data');

    try {
        // 示例1：更新卡片标题
        await updater.updateCardTitle('call_center', {
            en: "Customer Service Center",
            zh: "客服中心系统"
        });

        // 示例2：更新卡片状态
        await updater.updateCardStatus('call_center', 'inProgress', '#86efac');

    } catch (error) {
        console.error('Error updating card:', error);
    }
}

main(); 