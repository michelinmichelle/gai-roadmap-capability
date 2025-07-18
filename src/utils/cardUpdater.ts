import * as fs from 'fs/promises';
import * as path from 'path';
import { get, set } from 'lodash';

interface MultiLangText {
    en: string;
    zh: string;
}

interface CardMetadata {
    title: MultiLangText;
    status: string;
    color: string;
    lastUpdated: string;
    updatedAt?: string;
}

interface CardReference {
    manifest: string;
    architectureCard: string;
}

interface Capability {
    id: string;
    ref: string;
    name: MultiLangText;
    status: string;
    techStack: string;
    description: MultiLangText;
}

interface Card {
    id: string;
    ref: string;
    version: string;
    metadata: CardMetadata;
    capabilities: Capability[];
    references: CardReference;
}

interface ManifestCard {
    id: string;
    ref: string;
    filename: string;
    metadata: CardMetadata;
}

interface Manifest {
    version: string;
    prefix: string;
    cards: ManifestCard[];
    deletedCards: ManifestCard[];
    references: {
        architecture: string;
        capabilities: string;
    };
}

export class CardUpdater {
    private basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
    }

    private async readJsonFile<T>(filePath: string): Promise<T> {
        const fullPath = path.join(this.basePath, filePath);
        const content = await fs.readFile(fullPath, 'utf-8');
        return JSON.parse(content);
    }

    private async writeJsonFile(filePath: string, data: any): Promise<void> {
        const fullPath = path.join(this.basePath, filePath);
        await fs.writeFile(fullPath, JSON.stringify(data, null, 4), 'utf-8');
    }

    private async loadManifest(): Promise<Manifest> {
        return this.readJsonFile<Manifest>('capabilitymaps/publictouchpoints/manifest.json');
    }

    private async saveManifest(manifest: Manifest): Promise<void> {
        await this.writeJsonFile('capabilitymaps/publictouchpoints/manifest.json', manifest);
    }

    private async loadCard(filename: string): Promise<Card> {
        return this.readJsonFile<Card>(`capabilitymaps/publictouchpoints/${filename}`);
    }

    private async saveCard(filename: string, card: Card): Promise<void> {
        await this.writeJsonFile(`capabilitymaps/publictouchpoints/${filename}`, card);
    }

    private async loadArchitectureCards(): Promise<any> {
        return this.readJsonFile<any>('architecture-cards.json');
    }

    private async saveArchitectureCards(data: any): Promise<void> {
        await this.writeJsonFile('architecture-cards.json', data);
    }

    public async updateCardTitle(cardRef: string, newTitle: MultiLangText): Promise<void> {
        try {
            // 1. 更新 manifest.json
            const manifest = await this.loadManifest();
            const cardInManifest = manifest.cards.find(c => c.ref === cardRef);
            if (!cardInManifest) {
                throw new Error(`Card with ref ${cardRef} not found in manifest`);
            }

            cardInManifest.metadata.title = newTitle;
            cardInManifest.metadata.lastUpdated = new Date().toISOString();
            await this.saveManifest(manifest);

            // 2. 更新卡片文件
            const card = await this.loadCard(cardInManifest.filename);
            card.metadata.title = newTitle;
            card.metadata.updatedAt = new Date().toISOString();
            await this.saveCard(cardInManifest.filename, card);

            // 3. 更新架构图文件
            const archCards = await this.loadArchitectureCards();
            const archPath = card.references.architectureCard.split('.');
            const section = get(archCards, archPath.slice(0, -1));
            const matches = archPath[archPath.length - 1].match(/\d+/);
            if (!matches) {
                throw new Error(`Could not parse card index from ${archPath[archPath.length - 1]}`);
            }
            const cardIndex = parseInt(matches[0]);
            section[cardIndex].content = newTitle;
            await this.saveArchitectureCards(archCards);

            console.log(`Successfully updated card ${cardRef} with new title:`, newTitle);
        } catch (error) {
            console.error(`Error updating card ${cardRef}:`, error);
            throw error;
        }
    }

    public async updateCardStatus(cardRef: string, newStatus: string, newColor: string): Promise<void> {
        try {
            // 1. 更新 manifest.json
            const manifest = await this.loadManifest();
            const cardInManifest = manifest.cards.find(c => c.ref === cardRef);
            if (!cardInManifest) {
                throw new Error(`Card with ref ${cardRef} not found in manifest`);
            }

            cardInManifest.metadata.status = newStatus;
            cardInManifest.metadata.color = newColor;
            cardInManifest.metadata.lastUpdated = new Date().toISOString();
            await this.saveManifest(manifest);

            // 2. 更新卡片文件
            const card = await this.loadCard(cardInManifest.filename);
            card.metadata.status = newStatus;
            card.metadata.color = newColor;
            card.metadata.updatedAt = new Date().toISOString();
            await this.saveCard(cardInManifest.filename, card);

            // 3. 更新架构图文件
            const archCards = await this.loadArchitectureCards();
            const archPath = card.references.architectureCard.split('.');
            const section = get(archCards, archPath.slice(0, -1));
            const matches = archPath[archPath.length - 1].match(/\d+/);
            if (!matches) {
                throw new Error(`Could not parse card index from ${archPath[archPath.length - 1]}`);
            }
            const cardIndex = parseInt(matches[0]);
            section[cardIndex].color = newColor;
            await this.saveArchitectureCards(archCards);

            console.log(`Successfully updated card ${cardRef} status to ${newStatus}`);
        } catch (error) {
            console.error(`Error updating card status ${cardRef}:`, error);
            throw error;
        }
    }
} 