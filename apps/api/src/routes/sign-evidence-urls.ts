import type { StorageProvider } from "@autonoma/storage";

type EvidenceItem = { type: string; description: string; s3Key?: string };
type SignedEvidenceItem = { type: string; description: string; url?: string };

export async function signEvidenceUrls(
    evidence: EvidenceItem[],
    storageProvider: StorageProvider,
): Promise<SignedEvidenceItem[]> {
    return Promise.all(
        evidence.map(async (item) => {
            if (item.s3Key == null) return { type: item.type, description: item.description };
            const url = await storageProvider.getSignedUrl(item.s3Key, 3600);
            return { type: item.type, description: item.description, url };
        }),
    );
}
