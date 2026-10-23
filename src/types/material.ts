export type Format = '3D' | 'HTML' | 'PPTX' | 'PDF';
export interface Material {
 id: string; slug: string; title: string; subtitle?: string; instructions?: string; description: string; sound: string; sounds?: string[];
 topics?: ('articulation' | 'universal')[];
 format: Format; additionalFormats?: Format[]; age: '4–5' | '5–6' | '6–7' | null; price: number | null; isFree: boolean;
 cover: string; imageFit?: 'cover' | 'contain'; screenshots: string[]; playUrl: string | null; downloadUrl: string | null;
 telegramOrderUrl: string | null; isDemo: boolean; isNew?: boolean;
}
