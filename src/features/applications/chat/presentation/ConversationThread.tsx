import { useState } from 'react';
import { Avatar } from '@/components/data-display/Avatar';
import type { ChatConversationDto,ChatMessageDto } from '../application/chat.dto';

export function ConversationThread({ conversation, onlineLabel, offlineLabel, messagePlaceholder, sendLabel }: { conversation:ChatConversationDto; onlineLabel:string; offlineLabel:string; messagePlaceholder:string; sendLabel:string }) {
  const [draft,setDraft]=useState(''); const [localMessages,setLocalMessages]=useState<readonly ChatMessageDto[]>([]);
  const messages=[...conversation.messages,...localMessages];
  function submit(){const text=draft.trim();if(!text)return;setLocalMessages(current=>[...current,{id:`local-${current.length+1}`,senderId:'me',text,time:'Ahora',direction:'outgoing'}]);setDraft('')}
  return <section className="flex min-h-[34rem] flex-col" data-chat-thread>
    <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3"><Avatar name={conversation.participant.name}/><div className="min-w-0"><h2 className="truncate text-sm font-semibold text-slate-900">{conversation.participant.name}</h2><p className="text-[10px] text-slate-500">{conversation.participant.role} · {conversation.participant.online?onlineLabel:offlineLabel}</p></div></header>
    <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/50 p-4" data-chat-messages>{messages.map(message=><article className={`flex ${message.direction==='outgoing'?'justify-end':'justify-start'}`} data-chat-message={message.id} key={message.id}><div className={`max-w-[78%] rounded-xl px-3 py-2 ${message.direction==='outgoing'?'bg-[var(--theme-primary)] text-white':'border border-slate-200 bg-white text-slate-700'}`}><p className="text-[11px] leading-5">{message.text}</p><p className={`mt-1 text-right text-[9px] ${message.direction==='outgoing'?'text-white/70':'text-slate-400'}`}>{message.time}</p></div></article>)}</div>
    <div className="border-t border-slate-200 bg-white p-3"><div className="flex gap-2"><label className="sr-only" htmlFor="chat-message-input">{messagePlaceholder}</label><input className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" id="chat-message-input" onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')submit()}} placeholder={messagePlaceholder} value={draft}/><button className="h-10 rounded-lg bg-[var(--theme-primary)] px-4 text-xs font-semibold text-white disabled:opacity-40" disabled={!draft.trim()} onClick={submit} type="button">{sendLabel}</button></div></div>
  </section>;
}
