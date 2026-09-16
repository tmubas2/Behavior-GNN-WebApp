import React, { useState, useRef } from 'react';
import { CONTACTS, CHATS, getChatContact, getChatFavKey } from '../data';
import { SCREENS, TARGETS } from '../data';

function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  }
  return d.toLocaleDateString([], { weekday:'short' });
}

function Avatar({ contact, size = 48 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', background: contact.color + '33',
      border: `2px solid ${contact.color}66`, display:'flex', alignItems:'center',
      justifyContent:'center', flexShrink:0, fontSize: size * 0.3, fontWeight:600, color:contact.color,
    }}>
      {contact.avatar}
    </div>
  );
}

function HighlightedSnippet({ text, query, sender }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) {
    return <>{sender ? `${sender}: ` : ''}{text}</>;
  }
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);
  return (
    <span>
      {sender && <span style={{ color:'#3b4a54' }}>{sender}: </span>}
      {before}<span style={{ color:'#00a884', fontWeight:700 }}>{match}</span>{after}
    </span>
  );
}

function IconRail({ currentScreen, onNavigate, onLog, unreadCount }) {
  const [active, setActive] = useState('chats');

  const railBtnStyle = (key) => ({
    width:42, height:42, borderRadius:10, border:'none', cursor:'pointer',
    background: active === key ? '#dff5ef' : 'transparent',
    color: active === key ? '#00a884' : '#54656f',
    display:'flex', alignItems:'center', justifyContent:'center',
    position:'relative', transition:'background 0.15s, color 0.15s',
  });

  const hoverHandlers = (key) => ({
    onMouseEnter: e => { if (active !== key) e.currentTarget.style.background = '#f0f2f5'; },
    onMouseLeave: e => { if (active !== key) e.currentTarget.style.background = 'transparent'; },
  });

  return (
    <div style={{
      width:56, background:'#ffffff', borderRight:'1px solid #e9edef', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'space-between', padding:'16px 0', flexShrink:0, height:'100%',
    }}>
      <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
        <button title="Chats" onClick={() => { setActive('chats'); onNavigate(SCREENS.CHAT_LIST); }}
          style={railBtnStyle('chats')} {...hoverHandlers('chats')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v12H7l-3 3V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
          {unreadCount > 0 && (
            <span style={{
              position:'absolute', top:2, right:2, background:'#00a884', color:'#ffffff',
              fontSize:10, fontWeight:700, borderRadius:'50%', minWidth:16, height:16,
              display:'flex', alignItems:'center', justifyContent:'center', padding:'0 2px',
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        <button title="Status" onClick={() => setActive('status')} style={railBtnStyle('status')} {...hoverHandlers('status')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 3"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
        </button>

        <button title="Channels" onClick={() => setActive('channels')} style={railBtnStyle('channels')} {...hoverHandlers('channels')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
            <path d="M3 11v2a2 2 0 002 2h1l3 4V7L6 11H5a2 2 0 00-2 2z"/>
            <path d="M11 9l7-3v12l-7-3"/>
          </svg>
        </button>

        <button title="Communities" onClick={() => setActive('communities')} style={railBtnStyle('communities')} {...hoverHandlers('communities')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9" cy="9" r="3.2"/>
            <circle cx="16" cy="10.5" r="2.4"/>
            <path d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5" strokeLinecap="round"/>
            <path d="M14.5 14.3c1.9.4 3.5 2 3.5 4.2" strokeLinecap="round"/>
          </svg>
        </button>

        <button title="Meta AI" onClick={() => setActive('metaai')} style={railBtnStyle('metaai')} {...hoverHandlers('metaai')}>
          <div style={{
            width:26, height:26, borderRadius:'50%',
            background:'conic-gradient(from 180deg, #4f9dff, #b768ff, #ff6bd6, #4f9dff)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"/></svg>
          </div>
        </button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'center' }}>
        <button title="Multimedia" onClick={() => setActive('multimedia')} style={railBtnStyle('multimedia')} {...hoverHandlers('multimedia')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="14" rx="2"/>
            <circle cx="8" cy="9" r="1.6" fill="currentColor" stroke="none"/>
            <path d="M3 15l5-4 4 3.5 3-2.5 6 5" strokeLinecap="round"/>
          </svg>
        </button>

        <div style={{
          width:32, height:32, borderRadius:'50%', background:'#6B8CFF33', border:'2px solid #6B8CFF66',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600, color:'#3D5BDB',
          marginTop:4,
        }}>
          ME
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({
  currentScreen, activeChat, onSelectChat, onNavigate, onLog,
  searchQuery, setSearchQuery, chats, onLogout, onCreateGroup,
  favoriteContacts, isMobile = false, activeAdaptivePopupId,
  readChats, setReadChats,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuAnchorRef = useRef(null);
  const [menuPlacement, setMenuPlacement] = useState({ openUp: false, maxHeight: 400 });
  const [tab, setTab] = useState('all');
  const [viewingArchived, setViewingArchived] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState(new Set());

  const [groupStep, setGroupStep] = useState('select');  
  const [groupSelected, setGroupSelected] = useState(new Set());
  const [groupName, setGroupName] = useState('');

  const liveChats = chats || CHATS;
  const favSet = favoriteContacts || new Set();

  const isSearch = currentScreen === SCREENS.SEARCH;
  const isNewChat = currentScreen === SCREENS.NEW_CHAT;
  const isNewGroup = currentScreen === SCREENS.NEW_GROUP;
  const isArchived = viewingArchived && !isSearch && !isNewChat && !isNewGroup;

  const getLastMsg = (chat) => chat.messages[chat.messages.length - 1];
  const isUnread = (chat) => !readChats.has(chat.id);
  const isFavoriteChat = (chat) => favSet.has(getChatFavKey(chat));

  const filteredChats = isArchived ? [] : liveChats.filter(chat => {
    const contact = getChatContact(chat);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!contact.name.toLowerCase().includes(q) &&
          !chat.messages.some(m => m.text.toLowerCase().includes(q))) return false;
    }
    if (!isSearch) {
      if (tab === 'unread') return isUnread(chat);
      if (tab === 'favourites') return isFavoriteChat(chat);
      if (tab === 'groups') return !!chat.isGroup;
    }
    return true;
  });

  const getActivePopupId = () => showMenu ? SCREENS.SIDEBAR_MENU : (activeAdaptivePopupId || null);

  const logWithPopupContext = (params) => onLog({ ...params, active_popup_id: getActivePopupId() });

  const handleSearchClick = () => {
    logWithPopupContext({ screen_id: SCREENS.CHAT_LIST, action_type: 'tap', target_id: TARGETS.NAV_SEARCH_ICON, target_label: 'search icon', next_screen_id: SCREENS.SEARCH });
    onNavigate(SCREENS.SEARCH);
  };

  const handleNewChatClick = () => {
    logWithPopupContext({ screen_id: SCREENS.CHAT_LIST, action_type: 'tap', target_id: TARGETS.NAV_NEW_CHAT, target_label: 'new chat', next_screen_id: SCREENS.NEW_CHAT });
    onNavigate(SCREENS.NEW_CHAT);
  };

  const handleChatSelect = (chat, highlightMessageId = null) => {
    if (selectMode) {
      setSelectedChats(prev => {
        const next = new Set(prev);
        if (next.has(chat.id)) next.delete(chat.id); else next.add(chat.id);
        return next;
      });
      return;
    }
    setReadChats(prev => new Set([...prev, chat.id]));
    const label = getChatContact(chat).name;
    logWithPopupContext({
      screen_id: currentScreen,
      action_type: 'tap',
      target_id: isSearch ? `${TARGETS.SEARCH_RESULT}_${chat.id}` : `${TARGETS.CHAT_ITEM}_${chat.id}`,
      target_label: label,
      next_screen_id: SCREENS.CHAT_VIEW,
    });
    onSelectChat(chat, false, highlightMessageId);
    if (isSearch) setSearchQuery('');
  };

  const handleContactSelect = (contact) => {
    logWithPopupContext({ screen_id: SCREENS.NEW_CHAT, action_type: 'tap', target_id: `${TARGETS.NEW_CHAT_CONTACT}_${contact.id}`, target_label: contact.name, next_screen_id: SCREENS.CHAT_VIEW });
    const existingChat = liveChats.find(c => c.contactId === contact.id);
    if (existingChat) setReadChats(prev => new Set([...prev, existingChat.id]));
    onSelectChat(existingChat || { id: `CH_NEW_${contact.id}`, contactId: contact.id, messages: [] }, true);
  };

  const toggleGroupMember = (contactId) => {
    logWithPopupContext({ screen_id: SCREENS.NEW_GROUP, action_type: 'tap', target_id: TARGETS.NEW_GROUP_CONTACT, target_label: CONTACTS.find(c => c.id === contactId)?.name });
    setGroupSelected(prev => {
      const next = new Set(prev);
      if (next.has(contactId)) next.delete(contactId); else next.add(contactId);
      return next;
    });
  };

  const handleGroupNext = () => {
    logWithPopupContext({ screen_id: SCREENS.NEW_GROUP, action_type: 'tap', target_id: TARGETS.NEW_GROUP_NEXT, target_label: 'next' });
    setGroupStep('details');
    setSearchQuery('');
  };

  const handleCreateGroup = () => {
    const memberIds = [...groupSelected];
    const defaultName = CONTACTS.filter(c => memberIds.includes(c.id)).map(c => c.name.split(' ')[0]).slice(0, 3).join(', ') || 'New Group';
    const name = groupName.trim() || defaultName;
    logWithPopupContext({ screen_id: SCREENS.NEW_GROUP, action_type: 'tap', target_id: TARGETS.NEW_GROUP_CREATE, target_label: name });
    const newGroup = onCreateGroup && onCreateGroup(memberIds, name);
    setGroupSelected(new Set());
    setGroupName('');
    setGroupStep('select');
    if (newGroup) {
      setReadChats(prev => new Set([...prev, newGroup.id]));
      onSelectChat(newGroup, true);
    }
  };

  const menuOpenedFromScreenRef = useRef(currentScreen);

  const toggleSidebarMenu = () => {
    const opening = !showMenu;
    const returnScreen = menuOpenedFromScreenRef.current || currentScreen;

    if (opening) {
      menuOpenedFromScreenRef.current = currentScreen;
    }

    logWithPopupContext({
      screen_id:      opening ? currentScreen : SCREENS.SIDEBAR_MENU,
      action_type:    'tap',
      target_id:      TARGETS.NAV_MENU,
      target_label:   'menu',
      next_screen_id: opening ? SCREENS.SIDEBAR_MENU : returnScreen,
    });

    if (opening) {
      const rect = menuAnchorRef.current?.getBoundingClientRect();
      if (rect) {
        const margin = 12;
        const spaceBelow = window.innerHeight - rect.bottom - margin;
        const spaceAbove = rect.top - margin;
        const openUp = spaceBelow < 260 && spaceAbove > spaceBelow;
        setMenuPlacement({ openUp, maxHeight: Math.max(120, openUp ? spaceAbove : spaceBelow) });
      }
    }
    setShowMenu(v => !v);
  };

  const unreadCount = liveChats.filter(c => isUnread(c)).length;

  const sidebarMenuItems = [
    { label:'New group', id: TARGETS.SIDEBAR_MENU_NEW_GROUP, nextScreen: SCREENS.NEW_GROUP, action: () => {
        setGroupStep('select'); setGroupSelected(new Set()); setGroupName(''); setSearchQuery('');
        onNavigate(SCREENS.NEW_GROUP);
      } },
    { label:'Archived', id: TARGETS.SIDEBAR_MENU_ARCHIVED, nextScreen: SCREENS.CHAT_LIST, action: () => setViewingArchived(true) },
    { label:'Starred messages', id: TARGETS.NAV_STARRED, nextScreen: SCREENS.STARRED, action: () => onNavigate(SCREENS.STARRED) },
    { label:'Select chats', id: TARGETS.SIDEBAR_MENU_SELECT_CHATS, nextScreen: SCREENS.CHAT_LIST, action: () => { setSelectMode(v => !v); setSelectedChats(new Set()); } },
    { label:'Mark all as read', id: TARGETS.SIDEBAR_MENU_MARK_ALL_READ, nextScreen: SCREENS.CHAT_LIST, action: () => setReadChats(new Set(liveChats.map(c => c.id))) },
    { label:'App lock', id: TARGETS.SIDEBAR_MENU_APP_LOCK, nextScreen: currentScreen, action: () => {} },
    { label:'Settings', id: TARGETS.SIDEBAR_MENU_SETTINGS, nextScreen: SCREENS.SETTINGS, action: () => onNavigate(SCREENS.SETTINGS) },
    { label:'Log out', id: TARGETS.SIDEBAR_MENU_LOGOUT, danger:true, nextScreen: SCREENS.PARTICIPANT_SETUP,
      action: () => { if (window.confirm('Log out of this research session?')) onLogout && onLogout(); } },
  ];

  return (
    <div style={{ display:'flex', height:'100%', width: isMobile ? '100%' : 'auto', flex: isMobile ? '1 1 auto' : '0 0 auto' }}>
      {!isMobile && <IconRail currentScreen={currentScreen} onNavigate={onNavigate} onLog={onLog} unreadCount={unreadCount} />}

      <div style={{ width: isMobile ? '100%' : 412, background:'#ffffff', borderRight: isMobile ? 'none' : '1px solid #e9edef', display:'flex', flexDirection:'column', height:'100%', flexShrink:0, overflow:'hidden' }}>
        <div style={{ padding:'12px 16px', background:'#ffffff', borderBottom:'1px solid #e9edef', display:'flex', alignItems:'center', justifyContent:'space-between', minHeight:60, flexShrink:0 }}>
          {isSearch || isNewChat || isArchived || isNewGroup ? (
            <div style={{ display:'flex', alignItems:'center', gap:12, flex:1 }}>
              <button onClick={() => {
                  if (isArchived) { setViewingArchived(false); return; }
                  if (isNewGroup) {
                    if (groupStep === 'details') { setGroupStep('select'); return; }
                    setGroupSelected(new Set()); setGroupName('');
                    onNavigate(SCREENS.CHAT_LIST); setSearchQuery('');
                    return;
                  }
                  onNavigate(SCREENS.CHAT_LIST); setSearchQuery('');
                }}
                style={{ background:'none', border:'none', color:'#54656f', cursor:'pointer', padding:'4px 8px 4px 0', fontSize:20, lineHeight:1 }}>
                ←
              </button>
              <span style={{ color:'#111b21', fontSize:16, fontWeight:500 }}>
                {isSearch ? 'Search' : isNewChat ? 'New Chat' : isArchived ? 'Archived' : (groupStep === 'select' ? 'Add group participants' : 'New group')}
              </span>
            </div>
          ) : selectMode ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <button onClick={() => { setSelectMode(false); setSelectedChats(new Set()); }}
                  style={{ background:'none', border:'none', color:'#54656f', cursor:'pointer', fontSize:20, lineHeight:1 }}>×</button>
                <span style={{ color:'#111b21', fontSize:15, fontWeight:500 }}>{selectedChats.size} selected</span>
              </div>
              <button onClick={() => { setReadChats(prev => new Set([...prev, ...selectedChats])); setSelectMode(false); setSelectedChats(new Set()); }}
                style={{ background:'none', border:'none', color:'#00a884', cursor:'pointer', fontSize:13, fontWeight:600 }}>
                Mark read
              </button>
            </div>
          ) : (
            <>
              <span style={{ color:'#00a884', fontSize:22, fontWeight:600 }}>WhatsApp</span>
              <div style={{ display:'flex', gap:4 }}>
                <IconBtn onClick={handleNewChatClick} title="New chat">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/></svg>
                </IconBtn>
                <div ref={menuAnchorRef} style={{ position:'relative' }}>
                  <IconBtn onClick={toggleSidebarMenu} title="Menu">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                  </IconBtn>
                  {showMenu && (
                    <div style={{
                      position:'absolute', right:0,
                      ...(menuPlacement.openUp ? { bottom:'100%', marginBottom:8 } : { top:'100%', marginTop:0 }),
                      background:'#ffffff', borderRadius:8, boxShadow:'0 4px 18px rgba(0,0,0,0.18)', border:'1px solid #e9edef',
                      zIndex:100, minWidth:220, maxWidth:'calc(100vw - 24px)',
                      maxHeight: menuPlacement.maxHeight, overflowY:'auto', padding:'6px 0',
                    }}>
                      {sidebarMenuItems.map(item => (
                        <div key={item.label}
                          onClick={() => {
                            setShowMenu(false);
                            logWithPopupContext({
                              screen_id: SCREENS.SIDEBAR_MENU,
                              action_type: 'tap',
                              target_id: item.id,
                              target_label: item.label,
                              next_screen_id: item.nextScreen || currentScreen,
                            });
                            item.action();
                          }}
                          style={{ padding:'11px 20px', color: item.danger ? '#ea0038' : '#111b21', fontSize:14, cursor:'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
                          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                          {item.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {!isArchived && !(isNewGroup && groupStep === 'details') && (
          <div style={{ padding:'8px 12px', background:'#ffffff', flexShrink:0 }}>
            <div style={{ background:'#f0f2f5', borderRadius:8, display:'flex', alignItems:'center', gap:8, padding:'8px 12px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  logWithPopupContext({ screen_id: currentScreen, action_type: 'text_input', target_id: TARGETS.SEARCH_INPUT, target_label: 'search field' });
                }}
                onFocus={() => {
                  if (currentScreen !== SCREENS.SEARCH && currentScreen !== SCREENS.NEW_CHAT && currentScreen !== SCREENS.NEW_GROUP) handleSearchClick();
                }}
                placeholder={isNewChat || isNewGroup ? 'Search contacts' : 'Search or start new chat'}
                style={{ background:'none', border:'none', outline:'none', color:'#111b21', fontSize:14, flex:1, fontFamily:'inherit' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ background:'none', border:'none', color:'#54656f', cursor:'pointer', fontSize:18 }}>×</button>
              )}
            </div>
          </div>
        )}

        {!isSearch && !isNewChat && !isArchived && !isNewGroup && (
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'2px 12px 10px', background:'#ffffff', flexShrink:0, overflowX:'auto' }}>
            {[
              { key:'all',        label:'All' },
              { key:'unread',     label:`Unread${unreadCount > 0 ? ` ${unreadCount}` : ''}` },
              { key:'favourites', label:'Favourites' },
              { key:'groups',     label:'Groups' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding:'6px 14px', borderRadius:20, cursor:'pointer', flexShrink:0,
                background: tab === t.key ? '#00a884' : 'transparent',
                border: tab === t.key ? 'none' : '1px solid #d1d7db',
                color: tab === t.key ? '#ffffff' : '#54656f',
                fontSize:13, fontWeight:600, letterSpacing:0.2,
              }}>
                {t.label}
              </button>
            ))}
            <button title="Add filter" style={{
              width:28, height:28, borderRadius:'50%', border:'1px solid #d1d7db', background:'transparent',
              color:'#54656f', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              flexShrink:0, marginLeft:2,
            }}>
              +
            </button>
          </div>
        )}

        {isNewChat && (
          <div style={{ flex:1, overflowY:'auto' }}>
            <div style={{ padding:'6px 16px 4px', color:'#00a884', fontSize:13, fontWeight:600 }}>CONTACTS ON WHATSAPP</div>
            {CONTACTS
              .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(contact => (
                <div key={contact.id} onClick={() => handleContactSelect(contact)}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', cursor:'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <Avatar contact={contact} />
                  <div>
                    <div style={{ color:'#111b21', fontSize:15, fontWeight:400 }}>{contact.name}</div>
                    <div style={{ color:'#667781', fontSize:13 }}>{contact.phone}</div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {isNewGroup && groupStep === 'select' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
            {groupSelected.size > 0 && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', padding:'10px 16px', borderBottom:'1px solid #e9edef', maxHeight:100, overflowY:'auto' }}>
                {[...groupSelected].map(id => {
                  const c = CONTACTS.find(x => x.id === id);
                  if (!c) return null;
                  return (
                    <div key={id} style={{ display:'flex', alignItems:'center', gap:6, background:'#f0f2f5', borderRadius:16, padding:'4px 8px 4px 4px' }}>
                      <div style={{ width:22, height:22, borderRadius:'50%', background:c.color+'33', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600, color:c.color }}>{c.avatar}</div>
                      <span style={{ fontSize:12, color:'#111b21' }}>{c.name.split(' ')[0]}</span>
                      <span onClick={() => toggleGroupMember(id)} style={{ cursor:'pointer', color:'#667781', fontSize:14 }}>×</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ flex:1, overflowY:'auto' }}>
              <div style={{ padding:'6px 16px 4px', color:'#00a884', fontSize:13, fontWeight:600 }}>CONTACTS ON WHATSAPP</div>
              {CONTACTS
                .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(contact => {
                  const checked = groupSelected.has(contact.id);
                  return (
                    <div key={contact.id} onClick={() => toggleGroupMember(contact.id)}
                      style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', cursor:'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <Avatar contact={contact} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ color:'#111b21', fontSize:15, fontWeight:400 }}>{contact.name}</div>
                        <div style={{ color:'#667781', fontSize:13 }}>{contact.phone}</div>
                      </div>
                      <div style={{
                        width:22, height:22, borderRadius:'50%', flexShrink:0,
                        border: checked ? 'none' : '2px solid #b3bbc0',
                        background: checked ? '#00a884' : 'transparent',
                        display:'flex', alignItems:'center', justifyContent:'center', color:'#ffffff', fontSize:12,
                      }}>
                        {checked ? '✓' : ''}
                      </div>
                    </div>
                  );
                })}
            </div>
            {groupSelected.size > 0 && (
              <div style={{ padding:'12px 16px', borderTop:'1px solid #e9edef' }}>
                <button onClick={handleGroupNext} style={{ width:'100%', padding:'12px 0', background:'#00a884', border:'none', borderRadius:8, color:'#ffffff', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                  Next ({groupSelected.size} selected) →
                </button>
              </div>
            )}
          </div>
        )}

        {isNewGroup && groupStep === 'details' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
            <div style={{ padding:'24px 20px', display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'#f0f2f5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>👥</div>
              <input
                value={groupName}
                onChange={e => {
                  setGroupName(e.target.value);
                  logWithPopupContext({ screen_id: SCREENS.NEW_GROUP, action_type:'text_input', target_id: TARGETS.NEW_GROUP_NAME_INPUT, target_label:'group name' });
                }}
                placeholder="Group name (optional)"
                style={{ flex:1, border:'none', borderBottom:'1px solid #d1d7db', outline:'none', fontSize:16, padding:'8px 4px', fontFamily:'inherit', color:'#111b21' }}
              />
            </div>
            <div style={{ padding:'0 20px 8px', color:'#667781', fontSize:13, fontWeight:600 }}>
              PARTICIPANTS: {groupSelected.size}
            </div>
            <div style={{ flex:1, overflowY:'auto', padding:'0 8px' }}>
              {[...groupSelected].map(id => {
                const c = CONTACTS.find(x => x.id === id);
                if (!c) return null;
                return (
                  <div key={id} style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 12px' }}>
                    <Avatar contact={c} size={40} />
                    <span style={{ color:'#111b21', fontSize:14 }}>{c.name}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ padding:'12px 16px', borderTop:'1px solid #e9edef' }}>
              <button onClick={handleCreateGroup} style={{ width:'100%', padding:'13px 0', background:'#00a884', border:'none', borderRadius:8, color:'#ffffff', fontSize:15, fontWeight:600, cursor:'pointer' }}>
                Create Group →
              </button>
            </div>
          </div>
        )}

        {isArchived && (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ textAlign:'center', color:'#667781', fontSize:14, padding:'40px 20px' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🗄️</div>
              No archived chats
            </div>
          </div>
        )}

        {!isNewChat && !isArchived && !isNewGroup && (
          <div style={{ flex:1, overflowY:'auto' }}>
            {filteredChats.length === 0 && (
              <div style={{ textAlign:'center', color:'#667781', fontSize:14, padding:'40px 20px' }}>
                {isSearch ? (searchQuery ? 'No results found' : 'Search by name or keyword') :
                  tab === 'unread' ? 'No unread chats' :
                  tab === 'favourites' ? 'No favourite chats yet' :
                  tab === 'groups' ? 'No group chats yet' : 'No chats found'}
              </div>
            )}
            {filteredChats.map(chat => {
              const contact = getChatContact(chat);
              const last = getLastMsg(chat);
              const isActive = activeChat?.id === chat.id;
              const unread = isUnread(chat);
              const isSelected = selectedChats.has(chat.id);
              const isFav = isFavoriteChat(chat);

              let matchedMessageId = null;
              let bodyContent = last
                ? (last.from === 'me' ? <><span style={{ color:'#3b4a54' }}>You: </span>{last.text}</> : last.text)
                : 'No messages yet';

              if (isSearch && searchQuery) {
                const q = searchQuery.toLowerCase();
                const nameMatches = contact.name.toLowerCase().includes(q);
                if (!nameMatches) {
                  const matchedMsg = chat.messages.find(m => m.text.toLowerCase().includes(q));
                  if (matchedMsg) {
                    matchedMessageId = matchedMsg.id;
                    bodyContent = <HighlightedSnippet text={matchedMsg.text} query={searchQuery} sender={matchedMsg.from === 'me' ? 'You' : contact.name} />;
                  }
                }
              }

              return (
                <div key={chat.id} onClick={() => handleChatSelect(chat, matchedMessageId)}
                  style={{
                    display:'flex', alignItems:'center', gap:14, padding:'12px 16px',
                    cursor:'pointer', background: isSelected ? '#e7f8f3' : (isActive ? '#f0f2f5' : 'transparent'),
                    transition:'background 0.1s', borderBottom:'1px solid #f0f2f5',
                  }}
                  onMouseEnter={e => { if (!isActive && !isSelected) e.currentTarget.style.background='#f5f6f6'; }}
                  onMouseLeave={e => { if (!isActive && !isSelected) e.currentTarget.style.background='transparent'; }}>
                  {selectMode && (
                    <div style={{
                      width:20, height:20, borderRadius:'50%', flexShrink:0,
                      border: isSelected ? 'none' : '2px solid #b3bbc0',
                      background: isSelected ? '#00a884' : 'transparent',
                      display:'flex', alignItems:'center', justifyContent:'center', color:'#ffffff', fontSize:12,
                    }}>
                      {isSelected ? '✓' : ''}
                    </div>
                  )}
                  <Avatar contact={contact} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                      <span style={{ display:'flex', alignItems:'center', gap:5, color:'#111b21', fontSize:15, fontWeight: unread ? 600 : 400 }}>
                        {contact.name}
                        {isFav && !isSearch && <span style={{ fontSize:11 }}>❤️</span>}
                      </span>
                      <span style={{ color: unread ? '#00a884' : '#667781', fontSize:12, flexShrink:0 }}>
                        {last ? formatTime(last.time) : ''}
                      </span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ color:'#667781', fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>
                        {bodyContent}
                      </div>
                      {unread && !selectMode && !isSearch && (
                        <div style={{ width:9, height:9, borderRadius:'50%', background:'#00a884', flexShrink:0, marginLeft:8 }} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, title }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#f0f2f5' : 'none', border:'none', borderRadius:'50%',
        width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', transition:'background 0.15s',
      }}>
      {children}
    </button>
  );
}