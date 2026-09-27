import type { ChatViewDto } from './chat.dto';
export interface ChatContentProvider { getView(): ChatViewDto; }
