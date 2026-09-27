export interface ChatParticipantDto { id:string; name:string; role:string; online:boolean; }
export interface ChatMessageDto { id:string; senderId:string; text:string; time:string; direction:'incoming'|'outgoing'; }
export interface ChatConversationDto { id:string; participant:ChatParticipantDto; preview:string; lastActivity:string; unreadCount:number; messages:readonly ChatMessageDto[]; }
export interface ChatViewDto { title:string; description:string; breadcrumbs:readonly string[]; searchLabel:string; searchPlaceholder:string; conversationsLabel:string; onlineLabel:string; offlineLabel:string; messagePlaceholder:string; sendLabel:string; conversations:readonly ChatConversationDto[]; }
