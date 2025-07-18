import { CardUpdater } from './cardUpdater';

async function main() {
    // 初始化更新器，使用相对路径
    const updater = new CardUpdater('../../data');

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

// 只在直接运行时执行
if (require.main === module) {
    main();
} 