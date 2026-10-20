export type Format = '3D' | 'HTML' | 'PPTX' | 'PDF';
export interface Material {
 id: string; slug: string; title: string; description: string; sound: string;
 format: Format; age: '4–5' | '5–6' | '6–7'; price: number | null; isFree: boolean;
 cover: string; screenshots: string[]; playUrl: string | null; downloadUrl: string | null;
 telegramOrderUrl: string | null; tasks: string[]; isDemo: boolean;
}
