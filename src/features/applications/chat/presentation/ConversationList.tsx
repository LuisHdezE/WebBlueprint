import { Avatar } from '@/components/data-display/Avatar';
import type { ChatConversationDto } from '../application/chat.dto';

export function ConversationList({ conversations, selectedId, onSelect }: { conversations: readonly ChatConversationDto[]; selectedId: string; onSelect: (id:string)=>void }) {
  return <div className="divide-y divide-slate-100" data-chat-conversation-list>{conversations.map(conversation=>{
    const selected=conversation.id===selectedId;
    return <button className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${selected?'bg-[var(--theme-primary-soft)]/70':''}`} data-chat-conversation={conversation.id} key={conversation.id} onClick={()=>onSelect(conversation.id)} type="button">
      <span className="relative"><Avatar name={conversation.participant.name}/>{conversation.participant.online?<span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-emerald-500"/>:null}</span>
      <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><strong className="truncate text-xs font-semibold text-slate-900">{conversation.participant.name}</strong><span className="shrink-0 text-[9px] text-slate-400">{conversation.lastActivity}</span></span><span className="mt-0.5 block truncate text-[10px] text-slate-500">{conversation.preview}</span></span>
      {conversation.unreadCount>0?<span className="grid size-5 shrink-0 place-items-center rounded-full bg-[var(--theme-primary)] text-[9px] font-semibold text-white">{conversation.unreadCount}</span>:null}
    </button>
  })}</div>;
}
