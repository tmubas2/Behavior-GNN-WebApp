import React, { useState } from 'react';
import { CONTACTS, getChatContact } from '../data';
import { SCREENS, TARGETS } from '../data';

function Header({ title, onBack, onLog, currentScreen }) {
  return (
    <div style={{ background:'#f0f2f5', borderBottom:'1px solid #e9edef', padding:'0 16px', display:'flex', alignItems:'center', gap:12, minHeight:60, flexShrink:0 }}>
      <button onClick={() => { onLog({ screen_id:currentScreen, action_type:'back', target_id:TARGETS.BACK_BUTTON, target_label:'back', next_screen_id:SCREENS.CHAT_LIST }); onBack(); }}
        style={{ background:'none', border:'none', color:'#00a884', cursor:'pointer', fontSize:22, padding:'4px 8px 4px 0', lineHeight:1 }}>←</button>
      <span style={{ color:'#111b21', fontSize:16, fontWeight:500 }}>{title}</span>
    </div>
  );
}

function Switch({ checked, onChange }) {
  return (
    <div onClick={onChange} role="switch" aria-checked={checked} style={{
      width:36, height:20, borderRadius:12, background: checked ? '#00a884' : '#d1d7db',
      cursor:'pointer', position:'relative', transition:'background 0.15s', flexShrink:0,
    }}>
      <div style={{
        position:'absolute', top:2, left: checked ? 18 : 2, width:16, height:16, borderRadius:'50%',
        background:'#ffffff', transition:'left 0.15s', boxShadow:'0 1px 2px rgba(0,0,0,0.25)',
      }} />
    </div>
  );
}

function PanelRow({ icon, label, sub, trailing, onClick, multiline }) {
  return (
    <div onClick={onClick} style={{ display:'flex', alignItems: multiline ? 'flex-start' : 'center', gap:16, padding:'13px 24px', cursor: onClick ? 'pointer' : 'default' }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.background = '#f5f6f6'; }}
      onMouseLeave={e => { if (onClick) e.currentTarget.style.background = 'transparent'; }}>
      <span style={{ fontSize:18, width:20, textAlign:'center', flexShrink:0, marginTop: multiline ? 2 : 0 }}>{icon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ color:'#111b21', fontSize:15, fontWeight:400 }}>{label}</div>
        {sub && <div style={{ color:'#667781', fontSize:13, marginTop:2, lineHeight:1.4 }}>{sub}</div>}
      </div>
      {trailing != null && <span style={{ color:'#667781', fontSize:13, flexShrink:0 }}>{trailing}</span>}
    </div>
  );
}

function PanelToggleRow({ icon, label, value, onToggle }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'13px 24px' }}>
      <span style={{ fontSize:18, width:20, textAlign:'center', flexShrink:0 }}>{icon}</span>
      <div style={{ flex:1, color:'#111b21', fontSize:15, fontWeight:400 }}>{label}</div>
      <Switch checked={value} onChange={onToggle} />
    </div>
  );
}

export function ContactInfo({
  chat, onClose, onLog,
  isMuted = false, isBlocked = false, isFavorite = false,
  onToggleMute, onToggleBlock, onToggleFavorite,
  onOpenChatSearch,
}) {
  if (!chat) return null;
  const contact = getChatContact(chat);
  if (!contact) return null;
  const currentScreen = SCREENS.CONTACT_INFO;
  const isGroup = !!contact.isGroup;

  const logTap = (target_id, label, nextScreen) => onLog({
    screen_id: currentScreen,
    action_type: 'tap',
    target_id,
    target_label: label,
    next_screen_id: nextScreen,
    active_popup_id: currentScreen,
  });

  return (
    <div style={{ width:'min(400px, 100%)', flex:'0 0 auto', flexShrink:1, background:'#ffffff', borderLeft:'1px solid #e9edef', display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', zIndex:40 }}>
      <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:22, borderBottom:'1px solid #e9edef', flexShrink:0 }}>
        <button onClick={() => { logTap(TARGETS.CONTACT_PANEL_CLOSE, isGroup ? 'close group info' : 'close contact info', SCREENS.CHAT_VIEW); onClose(); }}
          style={{ background:'none', border:'none', color:'#54656f', cursor:'pointer', fontSize:20, lineHeight:1 }}>×</button>
        <span style={{ color:'#111b21', fontSize:16, fontWeight:500 }}>{isGroup ? 'Group info' : 'Contact info'}</span>
      </div>

      <div style={{ flex:1, overflowY:'auto' }}>
        <div style={{ padding:'32px 24px 24px', textAlign:'center' }}>
          <div style={{ width:120, height:120, borderRadius:'50%', background:contact.color+'33', border:`3px solid ${contact.color}88`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, fontWeight:600, color:contact.color, margin:'0 auto 16px' }}>{contact.avatar}</div>
          <div style={{ color:'#111b21', fontSize:20, fontWeight:400 }}>{contact.name}</div>
          <div style={{ color:'#667781', fontSize:14, marginTop:4 }}>{contact.phone}</div>

          <button onClick={() => { logTap(TARGETS.CONTACT_SEARCH, 'search in chat', SCREENS.CHAT_SEARCH); onOpenChatSearch && onOpenChatSearch(); }}
            title="Search"
            style={{ marginTop:20, width:52, height:52, borderRadius:'50%', border:'none', background:'#f0f2f5', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
            onMouseEnter={e => e.currentTarget.style.background='#e9edef'}
            onMouseLeave={e => e.currentTarget.style.background='#f0f2f5'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
        </div>

        <div style={{ height:8, background:'#f0f2f5' }} />

        {isGroup && (
          <>
            <div style={{ padding:'6px 24px 10px', color:'#00a884', fontSize:12, fontWeight:600, letterSpacing:0.4 }}>
              {contact.members.length} PARTICIPANT{contact.members.length === 1 ? '' : 'S'}
            </div>
            {contact.members.map(memberId => {
              const member = CONTACTS.find(c => c.id === memberId);
              if (!member) return null;
              return (
                <div key={memberId} style={{ display:'flex', alignItems:'center', gap:16, padding:'8px 24px' }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:member.color+'33', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:600, color:member.color, flexShrink:0 }}>{member.avatar}</div>
                  <div>
                    <div style={{ color:'#111b21', fontSize:14 }}>{member.name}</div>
                    <div style={{ color:'#667781', fontSize:12 }}>{member.phone}</div>
                  </div>
                </div>
              );
            })}
            <div style={{ height:8, background:'#f0f2f5', marginTop:12 }} />
          </>
        )}

        <PanelRow icon="🗂️" label="Media, links, and docs" trailing={chat.messages.filter(m => m.attachment).length}
          onClick={() => logTap(TARGETS.CONTACT_MEDIA_TAB, 'media tab')} />
        <PanelRow icon="⭐" label="Starred messages" trailing={chat.messages.filter(m => m.starred).length}
          onClick={() => logTap(TARGETS.CONTACT_STARRED, 'starred messages')} />

        <PanelToggleRow icon={isMuted ? '🔕' : '🔔'} label="Mute notifications" value={isMuted}
          onToggle={() => { logTap(TARGETS.CONTACT_MUTE, 'mute notifications'); onToggleMute && onToggleMute(); }} />

        <PanelRow icon="⏱️" label="Disappearing messages" sub="Off"
          onClick={() => logTap(TARGETS.CONTACT_DISAPPEARING, 'disappearing messages')} />
        <PanelRow icon="🛡️" label="Advanced chat privacy" sub="Off"
          onClick={() => logTap(TARGETS.CONTACT_PRIVACY, 'advanced chat privacy')} />
        <PanelRow icon="🔒" label="Encryption" sub="Messages are end-to-end encrypted. Click to verify." multiline
          onClick={() => logTap(TARGETS.CONTACT_ENCRYPTION, 'encryption')} />

        <div style={{ height:8, background:'#f0f2f5' }} />

        <PanelRow icon={isFavorite ? '❤️' : '🤍'} label={isFavorite ? 'Remove from Favourites' : 'Add to Favourites'}
          onClick={() => { logTap(TARGETS.CONTACT_FAVORITE, 'favourite'); onToggleFavorite && onToggleFavorite(); }} />

        <div style={{ height:8, background:'#f0f2f5' }} />

        {!isGroup && (
          <div style={{ padding:'6px 0' }}>
            <div onClick={() => { logTap(TARGETS.CONTACT_MUTE, 'mute notifications'); onToggleMute && onToggleMute(); }}
              style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 24px', cursor:'pointer', color:'#111b21', fontSize:15 }}
              onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <span style={{ fontSize:18, width:20, textAlign:'center' }}>{isMuted ? '🔔' : '🔇'}</span>
              {isMuted ? `Unmute ${contact.name}` : `Mute ${contact.name}`}
            </div>
            <div onClick={() => { logTap(TARGETS.CONTACT_BLOCK, 'block contact'); onToggleBlock && onToggleBlock(); }}
              style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 24px', cursor:'pointer', color:'#ea0038', fontSize:15 }}
              onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <span style={{ fontSize:18, width:20, textAlign:'center' }}>🚫</span>
              {isBlocked ? `Unblock ${contact.name}` : `Block ${contact.name}`}
            </div>
          </div>
        )}

        {isGroup && (
          <div style={{ padding:'6px 0' }}>
            <div onClick={() => { logTap(TARGETS.CHAT_MENU_CLOSE_CHAT, 'exit group'); }}
              style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 24px', cursor:'pointer', color:'#ea0038', fontSize:15 }}
              onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <span style={{ fontSize:18, width:20, textAlign:'center' }}>🚪</span>
              Exit group
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HighlightedText({ text, query }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);
  return <>{before}<span style={{ color:'#00a884', fontWeight:700 }}>{match}</span>{after}</>;
}

function formatSearchDate(ts) {
  const d = new Date(ts);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export function ChatSearchPanel({ chat, onClose, onLog, onSelectMessage }) {
  const [query, setQuery] = useState('');
  if (!chat) return null;
  const contact = getChatContact(chat);
  if (!contact) return null;

  const currentScreen = SCREENS.CHAT_SEARCH;

  const matches = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return chat.messages.filter(m => (m.text || '').toLowerCase().includes(q));
  }, [chat.messages, query]);

  const groups = React.useMemo(() => {
    const byDate = [];
    [...matches].reverse().forEach(msg => {
      const key = formatSearchDate(msg.time);
      let group = byDate.find(g => g.key === key);
      if (!group) { group = { key, items: [] }; byDate.push(group); }
      group.items.push(msg);
    });
    return byDate;
  }, [matches]);

  const handleClose = () => {
    onLog({ screen_id: currentScreen, action_type: 'tap', target_id: TARGETS.BACK_BUTTON, target_label: 'close chat search', next_screen_id: SCREENS.CHAT_VIEW, active_popup_id: currentScreen });
    onClose && onClose();
  };

  const handleResultClick = (msg) => {
    onLog({ screen_id: currentScreen, action_type: 'tap', target_id: `${TARGETS.SEARCH_RESULT}_${msg.id}`, target_label: msg.text.slice(0, 30), next_screen_id: SCREENS.CHAT_VIEW, active_popup_id: currentScreen });
    onSelectMessage && onSelectMessage(msg.id);
  };

  return (
    <div style={{ width:'min(400px, 100%)', flex:'0 0 auto', flexShrink:1, background:'#ffffff', borderLeft:'1px solid #e9edef', display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', zIndex:40 }}>
      <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:22, borderBottom:'1px solid #e9edef', flexShrink:0 }}>
        <button onClick={handleClose}
          style={{ background:'none', border:'none', color:'#54656f', cursor:'pointer', fontSize:20, lineHeight:1 }}>×</button>
        <span style={{ color:'#111b21', fontSize:16, fontWeight:500 }}>Search Messages</span>
      </div>

      <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid #e9edef', flexShrink:0 }}>
        <button title="Search by date" style={{ width:38, height:38, borderRadius:'50%', border:'none', background:'#f0f2f5', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#54656f' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="14" height="15" rx="2"/>
            <path d="M3 9.5h14M7.5 3v4M13 3v4"/>
            <circle cx="17.5" cy="17.5" r="3.6" fill="#ffffff" stroke="currentColor"/>
            <path d="m20 20 1.8 1.8"/>
          </svg>
        </button>
        <div style={{
          flex:1, background:'#ffffff', borderRadius:24, display:'flex', alignItems:'center', gap:8, padding:'8px 14px',
          border: query ? '1.5px solid #00a884' : '1px solid #d1d7db',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            autoFocus
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              onLog({ screen_id: currentScreen, action_type: 'text_input', target_id: TARGETS.SEARCH_INPUT, target_label: 'chat search field', active_popup_id: currentScreen });
            }}
            placeholder={`Search in chat with ${contact.name}`}
            style={{ flex:1, minWidth:0, background:'none', border:'none', outline:'none', color:'#111b21', fontSize:14, fontFamily:'inherit' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background:'none', border:'none', color:'#54656f', cursor:'pointer', fontSize:16, lineHeight:1, flexShrink:0 }}>×</button>
          )}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto' }}>
        {query.trim() === '' ? (
          <div style={{ textAlign:'center', color:'#667781', fontSize:13, padding:'48px 24px', lineHeight:1.6 }}>
            Type a word or phrase to search for messages in this conversation.
          </div>
        ) : groups.length === 0 ? (
          <div style={{ textAlign:'center', color:'#667781', fontSize:13, padding:'48px 24px' }}>
            No messages found.
          </div>
        ) : groups.map(group => (
          <div key={group.key}>
            <div style={{ padding:'10px 20px 4px', color:'#667781', fontSize:12 }}>{group.key}</div>
            {group.items.map(msg => (
              <div key={msg.id} onClick={() => handleResultClick(msg)}
                style={{ display:'flex', alignItems:'flex-start', gap:6, padding:'8px 20px', cursor:'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                {msg.from === 'me' && <span style={{ color:'#53bdeb', fontSize:14, lineHeight:'21px', flexShrink:0 }}>✓✓</span>}
                <span style={{ color:'#111b21', fontSize:14, lineHeight:1.5, wordBreak:'break-word' }}>
                  <HighlightedText text={msg.text} query={query} />
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StarredMessages({ allChats, onNavigate, onLog }) {
  const starred = [];
  allChats.forEach(chat => {
    const contact = getChatContact(chat);
    if (!contact) return;
    chat.messages.filter(m => m.starred).forEach(m => starred.push({ ...m, contactName: contact.name, chatId: chat.id }));
  });

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#f0f2f5', overflow:'hidden' }}>
      <Header title="Starred Messages" onBack={() => onNavigate(SCREENS.CHAT_LIST)} onLog={onLog} currentScreen={SCREENS.STARRED} />
      <div style={{ flex:1, overflowY:'auto', padding:'12px 0' }}>
        {starred.length === 0 ? (
          <div style={{ textAlign:'center', color:'#667781', fontSize:14, padding:'60px 20px' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>⭐</div>
            No starred messages yet.<br />
            <span style={{ fontSize:12, marginTop:8, display:'block' }}>Hover over a message and click ⋮ to star it.</span>
          </div>
        ) : starred.map(m => (
          <div key={m.id} style={{ background:'#ffffff', margin:'4px 12px', borderRadius:10, padding:'14px 16px', boxShadow:'0 1px 2px rgba(0,0,0,0.06)' }}>
            <div style={{ color:'#00a884', fontSize:12, fontWeight:600, marginBottom:6 }}>{m.contactName}</div>
            <div style={{ color:'#111b21', fontSize:14 }}>{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Settings({ onNavigate, onLog }) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#f0f2f5', overflow:'hidden' }}>
      <Header title="Settings" onBack={() => onNavigate(SCREENS.CHAT_LIST)} onLog={onLog} currentScreen={SCREENS.SETTINGS} />
      <div style={{ flex:1, overflowY:'auto' }}>
        <div style={{ background:'#ffffff', margin:'8px 0', padding:'8px 0' }}>
          {['Account', 'Privacy', 'Security', 'Notifications', 'Storage and data', 'App language', 'Help', 'About'].map(item => (
            <div key={item} onClick={() => onLog({ screen_id:SCREENS.SETTINGS, action_type:'tap', target_id:`TGT_SETTING_${item.replace(/ /g,'_').toUpperCase()}`, target_label:item })}
              style={{ padding:'14px 24px', color:'#111b21', fontSize:15, cursor:'pointer', borderBottom:'1px solid #f0f2f5' }}
              onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f0f2f5' }}>
      <div style={{ opacity:0.5, marginBottom:24 }}>
        <svg width="120" height="120" viewBox="0 0 24 24" fill="#8ea1a8"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.126 1.532 5.86L.057 23.516a.75.75 0 00.927.927l5.656-1.475A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
      </div>
      <div style={{ color:'#41525d', fontSize:22, fontWeight:300, marginBottom:8 }}>WhatsApp Web</div>
      <div style={{ color:'#667781', fontSize:14, textAlign:'center', maxWidth:380, lineHeight:1.6 }}>
        Select a conversation from the left to start messaging
      </div>
    </div>
  );
}