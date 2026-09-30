import { useMemo,useState } from 'react';
import { SearchField } from '@/components/forms/SearchField';
import { SurfaceCard } from '@/components/layout/SurfaceCard';
import { PageShell } from '@/shell/PageShell';
import type { ChatContentProvider } from '../application/chat.contracts';
import { ConversationList } from './ConversationList';
import { ConversationThread } from './ConversationThread';

export function ChatPage({contentProvider}:{contentProvider:ChatContentProvider}) {
  const view=contentProvider.getView(); const [query,setQuery]=useState(''); const [selectedId,setSelectedId]=useState(view.conversations[0].id);
  const conversations=useMemo(()=>{const needle=query.trim().toLocaleLowerCase();return needle?view.conversations.filter(c=>[c.participant.name,c.participant.role,c.preview].some(value=>value.toLocaleLowerCase().includes(needle))):view.conversations},[query,view]);
  const selected=view.conversations.find(c=>c.id===selectedId)??conversations[0]??view.conversations[0];
  return <PageShell breadcrumbs={view.breadcrumbs.map(label=>({label}))} description={view.description} title={view.title}>
    <SurfaceCard className="overflow-hidden p-0">
      <div className="grid min-h-[34rem] md:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 md:border-b-0 md:border-r"><div className="border-b border-slate-200 p-4"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{view.conversationsLabel}</p><SearchField id="chat-search" label={view.searchLabel} onChange={setQuery} placeholder={view.searchPlaceholder} value={query}/></div><ConversationList conversations={conversations} onSelect={setSelectedId} selectedId={selected.id}/></aside>
        <ConversationThread conversation={selected} key={selected.id} messagePlaceholder={view.messagePlaceholder} offlineLabel={view.offlineLabel} onlineLabel={view.onlineLabel} sendLabel={view.sendLabel}/>
      </div>
    </SurfaceCard>
  </PageShell>;
}
