export type IExtNameType = 'scene' | 'image' | 'audio' | 'video' | 'tex' | 'json';
export const extNameMap = new Map<IExtNameType, string[]>([]);

extNameMap.set('scene', ['.txt']);
extNameMap.set('image', ['.png', '.jpg', '.jpeg', '.webp','.webm','.mov','.gif']);
extNameMap.set('video', ['.mp4', '.webm', '.mkv','mov']);
extNameMap.set('audio', ['.mp3', '.ogg', '.wav','.flac']);
extNameMap.set('tex', ['.png', '.webp']);
extNameMap.set('json', ['.json','.jsonl']);