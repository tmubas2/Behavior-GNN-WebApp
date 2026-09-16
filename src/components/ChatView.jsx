import React, { useState, useRef, useEffect } from 'react';
import { CONTACTS, CHATS, getChatContact } from '../data';
import { SCREENS, TARGETS } from '../data';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
}

function Avatar({ contact, size = 40 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', background: contact.color + '33',
      border:`2px solid ${contact.color}66`, display:'flex', alignItems:'center',
      justifyContent:'center', flexShrink:0, fontSize:size*0.3, fontWeight:600, color:contact.color,
    }}>
      {contact.avatar}
    </div>
  );
}

export default function ChatView({
  chat, onNavigate, onLog, onSend, onForward, onStar, onViewMessage, taskState, updateTaskState,
  onOpenContactPanel,
  isMuted, isBlocked, isFavorite,
  onToggleMute, onToggleBlock, onToggleFavorite,
  onClearChat, onDeleteChat,
  highlightMessageId,
  onOpenChatSearch,
  activeAdaptivePopupId,
}) {
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [hoveredMsg, setHoveredMsg] = useState(null);
  const [showForward, setShowForward] = useState(null);
  const [showMsgMenu, setShowMsgMenu] = useState(null);
  const [msgMenuPos, setMsgMenuPos] = useState({ left: 0, top: 0, maxHeight: 220 });
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [moreMenuPlacement, setMoreMenuPlacement] = useState({ openUp: false, maxHeight: 500, right: 12, top: 60, bottom: null });
  const moreMenuAnchorRef = useRef(null);
  const [attachAccept, setAttachAccept] = useState('*/*');
  const [messages, setMessages] = useState(chat.messages);
  const [flashId, setFlashId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const contact = getChatContact(chat);

  const getActivePopupId = () => {
    if (showMsgMenu) return SCREENS.MSG_ACTION_MENU;
    if (showForward) return SCREENS.FORWARD_MODAL;
    if (showAttachMenu) return SCREENS.ATTACH_MENU;
    if (showMoreMenu) return SCREENS.CHAT_MORE_MENU;
    return activeAdaptivePopupId || null;
  };

  const logWithPopupContext = (params) => onLog({ ...params, active_popup_id: getActivePopupId() });

  const handleOpenChatSearch = () => {
    logWithPopupContext({ screen_id: SCREENS.CHAT_VIEW, action_type: 'tap', target_id: TARGETS.CHAT_MENU_SEARCH, target_label: 'search in chat', next_screen_id: SCREENS.CHAT_SEARCH });
    onOpenChatSearch && onOpenChatSearch();
  };

  useEffect(() => {
    setMessages(chat.messages);
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
    logWithPopupContext({ screen_id: SCREENS.CHAT_VIEW, action_type: 'screen_start', target_id: `TGT_CHAT_${chat.id}`, target_label: contact.name });
    updateTaskState && updateTaskState('viewedChats', chat.id);
  }, [chat.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages]);


  useEffect(() => {
    if (!highlightMessageId) return;
    const t = setTimeout(() => {
      const el = document.getElementById(highlightMessageId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setFlashId(highlightMessageId);
        setTimeout(() => setFlashId(null), 2000);
      }
    }, 150);
    return () => clearTimeout(t);
  }, [highlightMessageId, chat.id]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: `MSG_${Date.now()}`, from:'me', text:input, time:Date.now(), replyTo: replyTo?.id, starred:false };
    setMessages(prev => [...prev, newMsg]);
    logWithPopupContext({ screen_id: SCREENS.CHAT_VIEW, action_type: 'tap', target_id: TARGETS.SEND_BTN, target_label: 'send button' });
    onSend && onSend({ chatId: chat.id, message: newMsg });
    updateTaskState && updateTaskState('sentMessages', { chatId: chat.id, msg: newMsg });
    setInput('');
    setReplyTo(null);
  };


  const handleReply = (msg, fromMenu = false) => {
    logWithPopupContext({
      screen_id:      fromMenu ? SCREENS.MSG_ACTION_MENU : SCREENS.CHAT_VIEW,
      action_type:    'tap',
      target_id:      TARGETS.MSG_REPLY,
      target_label:   'reply to message',
      next_screen_id: fromMenu ? SCREENS.CHAT_VIEW : undefined,
    });
    setReplyTo(msg);
    setShowMsgMenu(null);
    inputRef.current?.focus();
  };

  const handleForwardInit = (msg) => {
    logWithPopupContext({
      screen_id:      SCREENS.MSG_ACTION_MENU,
      action_type:    'tap',
      target_id:      TARGETS.MSG_FORWARD,
      target_label:   'forward message',
      next_screen_id: SCREENS.FORWARD_MODAL,
    });
    setShowForward(msg);
    setShowMsgMenu(null);
  };

  const handleForwardCancel = () => {
    logWithPopupContext({
      screen_id:      SCREENS.FORWARD_MODAL,
      action_type:    'tap',
      target_id:      TARGETS.FORWARD_CANCEL,
      target_label:   'cancel forward',
      next_screen_id: SCREENS.CHAT_VIEW,
    });
    setShowForward(null);
  };

  const handleForwardSend = (targetContact) => {
    logWithPopupContext({ screen_id: SCREENS.FORWARD_MODAL, action_type: 'tap', target_id: `${TARGETS.FORWARD_CONTACT}_${targetContact.id}`, target_label: targetContact.name });
    logWithPopupContext({ screen_id: SCREENS.FORWARD_MODAL, action_type: 'tap', target_id: TARGETS.FORWARD_SEND, target_label: 'send forwarded message', next_screen_id: SCREENS.CHAT_VIEW });
    onForward && onForward({ message: showForward, toContact: targetContact });
    updateTaskState && updateTaskState('forwardedMessages', { msg: showForward, to: targetContact.id });
    setShowForward(null);
  };

  const handleStar = (msg) => {
    logWithPopupContext({
      screen_id:      SCREENS.MSG_ACTION_MENU,
      action_type:    'tap',
      target_id:      TARGETS.MSG_STAR,
      target_label:   msg.starred ? 'unstar message' : 'star message',
      next_screen_id: SCREENS.CHAT_VIEW,
    });
    setMessages(prev => prev.map(m => m.id === msg.id ? {...m, starred:!m.starred} : m));
    onStar && onStar(msg);
    setShowMsgMenu(null);
  };

  const handleCopyMessage = (msg) => {
    logWithPopupContext({
      screen_id:      SCREENS.MSG_ACTION_MENU,
      action_type:    'tap',
      target_id:      TARGETS.MSG_COPY,
      target_label:   'copy message',
      next_screen_id: SCREENS.CHAT_VIEW,
    });
    navigator.clipboard?.writeText(msg.text);
    setShowMsgMenu(null);
  };

  const handleDeleteMessage = (msg) => {
    logWithPopupContext({
      screen_id:      SCREENS.MSG_ACTION_MENU,
      action_type:    'tap',
      target_id:      TARGETS.MSG_DELETE,
      target_label:   'delete message',
      next_screen_id: SCREENS.CHAT_VIEW,
    });
    setMessages(prev => prev.map(m => m.id === msg.id
      ? { ...m, text: 'This message was deleted', deleted: true, starred: false, attachment: null }
      : m
    ));
    updateTaskState && updateTaskState('deletedMessages', { msg });
    setShowMsgMenu(null);
  };

  const handleMsgClick = (msg) => {
    logWithPopupContext({ screen_id: SCREENS.CHAT_VIEW, action_type: 'tap', target_id: `${TARGETS.MSG_ITEM}_${msg.id}`, target_label: msg.text.slice(0,30) });
    updateTaskState && updateTaskState('viewedMessages', msg.id);
    onViewMessage && onViewMessage(msg.id);
  };

  const handleScroll = (e) => {
    logWithPopupContext({ screen_id: SCREENS.CHAT_VIEW, action_type: 'scroll', target_id: TARGETS.SCROLL_ACTION, target_label: 'message list scroll' });
  };

  const handleContactHeader = () => {
    logWithPopupContext({ screen_id: SCREENS.CHAT_VIEW, action_type: 'tap', target_id: TARGETS.CONTACT_HEADER, target_label: contact.name, next_screen_id: SCREENS.CONTACT_INFO });
    onOpenContactPanel && onOpenContactPanel();
  };

  const handleBack = () => {
    logWithPopupContext({ screen_id: SCREENS.CHAT_VIEW, action_type: 'back', target_id: TARGETS.BACK_BUTTON, target_label: 'back to chat list', next_screen_id: SCREENS.CHAT_LIST });
    onNavigate(SCREENS.CHAT_LIST);
  };

  const handleMsgMoreClick = (msg, anchorEl) => {
    const opening = showMsgMenu !== msg.id;

    if (opening) {
      const rect = anchorEl.getBoundingClientRect();
      const margin = 10;
      const menuWidth = 180;
      const estMenuHeight = 190;

      const spaceRight = window.innerWidth - rect.right - margin;
      const spaceLeft = rect.left - margin;
      const openLeft = spaceRight < menuWidth && spaceLeft > spaceRight;
      const left = openLeft ? rect.left - menuWidth - 8 : rect.right + 8;

      const spaceBelow = window.innerHeight - rect.top - margin;
      const spaceAbove = rect.bottom - margin;
      const alignBottom = spaceBelow < estMenuHeight && spaceAbove > spaceBelow;
      const maxHeight = Math.max(100, alignBottom ? spaceAbove : spaceBelow);
      const top = alignBottom
        ? Math.max(margin, rect.bottom - Math.min(estMenuHeight, spaceAbove))
        : rect.top;

      setMsgMenuPos({ left, top, maxHeight });
    }

    logWithPopupContext({
      screen_id:      opening ? SCREENS.CHAT_VIEW : SCREENS.MSG_ACTION_MENU,
      action_type:    'tap',
      target_id:      TARGETS.MSG_MORE_BTN,
      target_label:   'message options',
      next_screen_id: opening ? SCREENS.MSG_ACTION_MENU : SCREENS.CHAT_VIEW,
    });

    setShowMsgMenu(opening ? msg.id : null);
  };

  const handleAttachClick = () => {
    const opening = !showAttachMenu;
    logWithPopupContext({
      screen_id:      opening ? SCREENS.CHAT_VIEW : SCREENS.ATTACH_MENU,
      action_type:    'tap',
      target_id:      TARGETS.ATTACH_BTN,
      target_label:   'attach',
      next_screen_id: opening ? SCREENS.ATTACH_MENU : SCREENS.CHAT_VIEW,
    });
    setShowMoreMenu(false);
    setShowAttachMenu(v => !v);
  };

  const openFilePicker = (accept, targetId, label) => {
    logWithPopupContext({ screen_id: SCREENS.ATTACH_MENU, action_type: 'tap', target_id: targetId, target_label: label, next_screen_id: SCREENS.CHAT_VIEW });
    setAttachAccept(accept);
    setShowAttachMenu(false);
    // Set the accept attribute directly on the DOM node before clicking.
    // React's setAttachAccept(accept) above won't be reflected in the DOM
    // until after this function returns (React batches the re-render), so
    // reading it via the ref right now guarantees the file dialog opens
    // with the correct type filter instead of whatever was set previously.
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('accept', accept);
      fileInputRef.current.click();
    }
  };

  const handleFileChosen = (e) => {
    const file = e.target.files?.[0];
    if (!file) { return; }
    const isImage = file.type.startsWith('image/');
    const newMsg = {
      id: `MSG_ATT_${Date.now()}`,
      from: 'me',
      text: isImage ? '📷 Photo' : `📎 ${file.name}`,
      time: Date.now(),
      starred: false,
      attachment: { name: file.name, type: file.type, isImage, url: isImage ? URL.createObjectURL(file) : null },
    };
    setMessages(prev => [...prev, newMsg]);
    onSend && onSend({ chatId: chat.id, message: newMsg });
    updateTaskState && updateTaskState('sentMessages', { chatId: chat.id, msg: newMsg });
    e.target.value = '';
  };

  const attachOptions = [
    { label:'Document',       color:'#5157ae', icon:'📄', accept:'.pdf,.doc,.docx,.txt,application/*', target: TARGETS.ATTACH_MENU_DOC },
    { label:'Photos & videos',color:'#bf59cf', icon:'🖼️', accept:'image/*,video/*',                    target: TARGETS.ATTACH_MENU_PHOTOS },
    { label:'Camera',         color:'#c0447c', icon:'📷', accept:'image/*',                             target: TARGETS.ATTACH_MENU_CAMERA },
    { label:'Contact',        color:'#4c9fe8', icon:'👤', target: TARGETS.ATTACH_MENU_CONTACT, stub:true },
    { label:'Poll',           color:'#e3a13f', icon:'📊', target: TARGETS.ATTACH_MENU_POLL,    stub:true },
  ];

  const handleAttachStubClick = (item) => {
    logWithPopupContext({ screen_id: SCREENS.ATTACH_MENU, action_type:'tap', target_id:item.target, target_label:item.label, next_screen_id: SCREENS.CHAT_VIEW });
    setShowAttachMenu(false);
  };

  const closeMoreMenu = () => setShowMoreMenu(false);

  const moreMenuItems = [
    { label:'Contact info', target: TARGETS.CHAT_MENU_INFO, nextScreen: SCREENS.CONTACT_INFO,
      action: () => onOpenContactPanel && onOpenContactPanel() },
    { label:'Search', target: TARGETS.CHAT_MENU_SEARCH, nextScreen: SCREENS.CHAT_SEARCH,
      action: () => onOpenChatSearch && onOpenChatSearch() },
    { label:'Select messages', target: TARGETS.CHAT_MENU_SELECT, nextScreen: SCREENS.CHAT_VIEW,
      action: () => {} },
    { label: isMuted ? 'Unmute notifications' : 'Mute notifications', target: TARGETS.CONTACT_MUTE, arrow:true, nextScreen: SCREENS.CHAT_VIEW,
      action: () => onToggleMute && onToggleMute() },
    { label:'Disappearing messages', target: TARGETS.CHAT_MENU_DISAPPEARING, arrow:true, nextScreen: SCREENS.CHAT_VIEW,
      action: () => {} },
    { label: isFavorite ? 'Remove from Favourites' : 'Add to Favourites', target: TARGETS.CONTACT_FAVORITE, nextScreen: SCREENS.CHAT_VIEW,
      action: () => onToggleFavorite && onToggleFavorite() },
    { label:'Add to list', target: TARGETS.CHAT_MENU_ADD_LIST, arrow:true, nextScreen: SCREENS.CHAT_VIEW,
      action: () => {} },
    { divider:true },
    { label:'Close chat', target: TARGETS.CHAT_MENU_CLOSE_CHAT, nextScreen: SCREENS.CHAT_LIST,
      action: () => onNavigate(SCREENS.CHAT_LIST) },
    { label:'Send call link', target: TARGETS.CHAT_MENU_CALL_LINK, nextScreen: SCREENS.CHAT_VIEW,
      action: () => {} },
    { label:'Report', target: TARGETS.CHAT_MENU_REPORT, nextScreen: SCREENS.CHAT_VIEW,
      action: () => { window.confirm(`Report ${contact.name}? They won't be notified.`); } },
    { label: isBlocked ? `Unblock ${contact.name}` : `Block ${contact.name}`, target: TARGETS.CONTACT_BLOCK, danger:true, nextScreen: SCREENS.CHAT_VIEW,
      action: () => onToggleBlock && onToggleBlock() },
    { label:'Clear chat', target: TARGETS.CHAT_MENU_CLEAR, danger:true, nextScreen: SCREENS.CHAT_VIEW,
      action: () => { if (window.confirm('Clear this chat? Messages will be removed for you.')) { onClearChat && onClearChat(chat.id); } } },
    { label:'Delete chat', target: TARGETS.CHAT_MENU_DELETE, danger:true, nextScreen: SCREENS.CHAT_LIST,
      action: () => { if (window.confirm('Delete this chat?')) { onDeleteChat && onDeleteChat(chat.id); } } },
  ];

  const handleMoreMenuItemClick = (item) => {
    logWithPopupContext({
      screen_id:      SCREENS.CHAT_MORE_MENU,
      action_type:    'tap',
      target_id:      item.target,
      target_label:   item.label,
      next_screen_id: item.nextScreen || SCREENS.CHAT_VIEW,
    });
    setShowMoreMenu(false);
    item.action();
  };

  const toggleMoreMenu = () => {
    const opening = !showMoreMenu;
    logWithPopupContext({
      screen_id:      opening ? SCREENS.CHAT_VIEW : SCREENS.CHAT_MORE_MENU,
      action_type:    'tap',
      target_id:      TARGETS.CHAT_MORE_BTN,
      target_label:   'more options',
      next_screen_id: opening ? SCREENS.CHAT_MORE_MENU : SCREENS.CHAT_VIEW,
    });
    setShowAttachMenu(false);
    if (opening) {
      const rect = moreMenuAnchorRef.current?.getBoundingClientRect();
      if (rect) {
        const margin = 12;
        const spaceBelow = window.innerHeight - rect.bottom - margin;
        const spaceAbove = rect.top - margin;
        const openUp = spaceBelow < 420 && spaceAbove > spaceBelow;
        setMoreMenuPlacement({
          openUp,
          maxHeight: Math.max(160, openUp ? spaceAbove : spaceBelow),
          right: window.innerWidth - rect.right,
          top: openUp ? null : rect.bottom + 4,
          bottom: openUp ? (window.innerHeight - rect.top + 4) : null,
        });
      }
    }
    setShowMoreMenu(v => !v);
  };

  const handleOverlayDismiss = () => {
    if (showAttachMenu) {
      logWithPopupContext({ screen_id: SCREENS.ATTACH_MENU, action_type:'tap', target_id: TARGETS.OVERLAY_DISMISS, target_label:'dismiss attach menu', next_screen_id: SCREENS.CHAT_VIEW });
    }
    if (showMoreMenu) {
      logWithPopupContext({ screen_id: SCREENS.CHAT_MORE_MENU, action_type:'tap', target_id: TARGETS.OVERLAY_DISMISS, target_label:'dismiss more menu', next_screen_id: SCREENS.CHAT_VIEW });
    }
    setShowAttachMenu(false);
    setShowMoreMenu(false);
  };

  const replyRef = messages.find(m => m.id === replyTo?.id);

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#efeae2', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, opacity:0.06, backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23111b21' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, zIndex:0 }} />

      <div style={{ background:'#f0f2f5', padding:'0 16px', display:'flex', alignItems:'center', gap:12, minHeight:60, zIndex:10, borderBottom:'1px solid #e9edef' }}>
        <button onClick={handleBack} style={{ background:'none', border:'none', color:'#54656f', cursor:'pointer', fontSize:22, padding:'4px 8px 4px 0', lineHeight:1 }}>←</button>
        <div onClick={handleContactHeader} style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer', flex:1 }}>
          <Avatar contact={contact} />
          <div>
            <div style={{ color:'#111b21', fontSize:15, fontWeight:400 }}>{contact.name}</div>
            <div style={{ color:'#667781', fontSize:13 }}>
              {contact.isGroup ? contact.phone : (isBlocked ? 'blocked' : 'online')}{isMuted ? ' · muted' : ''}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          <IconBtn title="Video call"><svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg></IconBtn>
          <IconBtn title="Search in chat" onClick={handleOpenChatSearch}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></IconBtn>
          <div ref={moreMenuAnchorRef} style={{ position:'relative', zIndex:200 }}>
            <IconBtn title="More options" onClick={toggleMoreMenu}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
            </IconBtn>

            {showMoreMenu && (
              <div style={{
                position:'fixed', right: moreMenuPlacement.right,
                ...(moreMenuPlacement.openUp ? { bottom: moreMenuPlacement.bottom } : { top: moreMenuPlacement.top }),
                background:'#ffffff', borderRadius:8, boxShadow:'0 4px 18px rgba(0,0,0,0.18)', border:'1px solid #e9edef',
                zIndex:500, minWidth:250, maxWidth:'calc(100vw - 32px)',
                maxHeight: moreMenuPlacement.maxHeight, overflowY:'auto', padding:'6px 0',
              }}>
                {moreMenuItems.map((item, i) => item.divider ? (
                  <div key={`div_${i}`} style={{ height:1, background:'#e9edef', margin:'6px 0' }} />
                ) : (
                  <div key={item.label} onClick={() => handleMoreMenuItemClick(item)}
                    style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 20px', color: item.danger ? '#ea0038' : '#111b21', fontSize:14, cursor:'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <span>{item.label}</span>
                    {item.arrow && <span style={{ color:'#8696a0', fontSize:13 }}>›</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div onScroll={handleScroll} style={{ flex:1, overflowY:'auto', padding:'12px 8%', zIndex:1, position:'relative' }}>
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end', minHeight:'100%' }}>
          {messages.map((msg, i) => {
            const isMe = msg.from === 'me';
            const replyMsg = msg.replyTo ? messages.find(m => m.id === msg.replyTo) : null;
            const isHovered = hoveredMsg === msg.id;
            const menuOpen = showMsgMenu === msg.id;
            return (
              <div key={msg.id} id={msg.id} style={{
                  display:'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom:4, position:'relative',
                  background: flashId === msg.id ? 'rgba(0,168,132,0.16)' : 'transparent',
                  borderRadius:10, transition:'background 0.4s',
                }}
                onMouseEnter={() => setHoveredMsg(msg.id)}
                onMouseLeave={() => { setHoveredMsg(null); if (!menuOpen) setShowMsgMenu(null); }}>

                {isHovered && !msg.deleted && (
                  <div style={{ display:'flex', alignItems:'center', gap:4, margin: isMe ? '0 8px 0 0' : '0 0 0 8px', order: isMe ? -1 : 1 }}>
                    <MsgActionBtn title="Reply" onClick={() => handleReply(msg, false)}>↩</MsgActionBtn>
                    <MsgActionBtn title="More" onClick={(e) => handleMsgMoreClick(msg, e.currentTarget)}>⋮</MsgActionBtn>
                  </div>
                )}

                <div onClick={() => handleMsgClick(msg)} style={{ maxWidth:'65%', cursor:'default' }}>
                  {replyMsg && (
                    <div style={{ background: isMe ? '#c5f2bb' : '#ffffff', borderLeft:'4px solid #00a884', borderRadius:'4px 4px 0 0', padding:'6px 10px', fontSize:12, color:'#667781', marginBottom:0 }}>
                      <div style={{ color:'#00a884', fontWeight:600, marginBottom:2 }}>{replyMsg.from === 'me' ? 'You' : contact.name}</div>
                      {replyMsg.text.slice(0,60)}{replyMsg.text.length > 60 ? '...' : ''}
                    </div>
                  )}
                  <div style={{
                    background: isMe ? '#d9fdd3' : '#ffffff',
                    borderRadius: replyMsg ? (isMe ? '0 0 4px 12px' : '0 0 12px 4px') : (isMe ? '12px 4px 12px 12px' : '4px 12px 12px 12px'),
                    padding:'8px 12px 6px', boxShadow:'0 1px 2px rgba(0,0,0,0.1)',
                    border: msg.starred ? '1px solid #f0b42999' : 'none',
                  }}>
                    {msg.forwarded && !msg.deleted && <div style={{ color:'#667781', fontSize:11, marginBottom:3, display:'flex', alignItems:'center', gap:4 }}>↪ Forwarded</div>}
                    {msg.attachment?.isImage && (
                      <img src={msg.attachment.url} alt={msg.attachment.name} style={{ maxWidth:260, maxHeight:260, borderRadius:8, display:'block', marginBottom:4, objectFit:'cover' }} />
                    )}
                    <span style={{
                      color: msg.deleted ? '#667781' : '#111b21',
                      fontStyle: msg.deleted ? 'italic' : 'normal',
                      fontSize:14, fontWeight:400, lineHeight:1.5, wordBreak:'break-word',
                      display:'flex', alignItems:'center', gap:5,
                    }}>
                      {msg.deleted && '🚫'}{msg.text}
                    </span>
                    <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center', gap:4, marginTop:2 }}>
                      {msg.starred && <span style={{ fontSize:10 }}>⭐</span>}
                      <span style={{ color:'#667781', fontSize:11 }}>{formatTime(msg.time)}</span>
                      {isMe && <span style={{ color:'#53bdeb', fontSize:14, lineHeight:1 }}>✓✓</span>}
                    </div>
                  </div>
                </div>

                {menuOpen && (
                  <div style={{
                    position:'fixed', left:msgMenuPos.left, top:msgMenuPos.top,
                    background:'#ffffff', borderRadius:8, boxShadow:'0 4px 18px rgba(0,0,0,0.18)', border:'1px solid #e9edef',
                    zIndex:500, width:180, maxHeight:msgMenuPos.maxHeight, overflowY:'auto',
                  }}>
                    {[
                      { label:'Reply', action:() => handleReply(msg, true) },
                      { label:'Forward', action:() => handleForwardInit(msg) },
                      { label: msg.starred ? 'Unstar' : 'Star message', action:() => handleStar(msg) },
                      { label:'Copy', action:() => handleCopyMessage(msg) },
                      ...(isMe ? [{ label:'Delete', danger:true, action:() => handleDeleteMessage(msg) }] : []),
                    ].map(item => (
                      <div key={item.label} onClick={item.action}
                        style={{ padding:'12px 16px', color: item.danger ? '#ea0038' : '#111b21', fontSize:14, cursor:'pointer' }}
                        onMouseEnter={e => e.target.style.background='#f5f6f6'}
                        onMouseLeave={e => e.target.style.background='transparent'}>
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {replyTo && (
        <div style={{ background:'#f0f2f5', borderTop:'1px solid #e9edef', padding:'8px 16px', display:'flex', alignItems:'center', gap:12, zIndex:10 }}>
          <div style={{ flex:1, borderLeft:'4px solid #00a884', paddingLeft:12 }}>
            <div style={{ color:'#00a884', fontSize:12, fontWeight:600, marginBottom:2 }}>{replyTo.from === 'me' ? 'You' : contact.name}</div>
            <div style={{ color:'#667781', fontSize:13 }}>{replyTo.text.slice(0,60)}</div>
          </div>
          <button onClick={() => { setReplyTo(null); logWithPopupContext({ screen_id:SCREENS.CHAT_VIEW, action_type:'tap', target_id:TARGETS.REPLY_CANCEL, target_label:'cancel reply' }); }}
            style={{ background:'none', border:'none', color:'#667781', cursor:'pointer', fontSize:20, lineHeight:1 }}>×</button>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept={attachAccept} style={{ display:'none' }} onChange={handleFileChosen} />

      <div style={{ background:'#f0f2f5', padding:'8px 12px 10px', zIndex:200, position:'relative' }}>
        {showAttachMenu && (
          <div style={{ position:'absolute', bottom:'100%', left:8, marginBottom:8, background:'#ffffff', borderRadius:12, boxShadow:'0 4px 18px rgba(0,0,0,0.18)', border:'1px solid #e9edef', zIndex:70, padding:'8px 6px', minWidth:230, maxWidth:'calc(100vw - 32px)', maxHeight:'60dvh', overflowY:'auto' }}>
            {attachOptions.map(item => (
              <div key={item.label}
                onClick={() => item.stub ? handleAttachStubClick(item) : openFilePicker(item.accept, item.target, item.label)}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 12px', borderRadius:8, cursor:'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:item.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'white', flexShrink:0 }}>{item.icon}</div>
                <span style={{ color:'#111b21', fontSize:14 }}>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display:'flex', alignItems:'center', gap:0, background:'#ffffff', borderRadius:24, padding:'4px 6px', boxShadow:'0 1px 3px rgba(11,20,26,0.10)' }}>
          <IconBtn title="Attach" onClick={handleAttachClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="2" strokeLinecap="round"
              style={{ transform: showAttachMenu ? 'rotate(45deg)' : 'none', transition:'transform 0.15s' }}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </IconBtn>
          <IconBtn title="Emoji" onClick={() => { setShowAttachMenu(false); logWithPopupContext({ screen_id:SCREENS.CHAT_VIEW, action_type:'tap', target_id:TARGETS.EMOJI_BTN, target_label:'emoji' }); }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#54656f"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
          </IconBtn>
          <input
            ref={inputRef}
            value={input}
            onChange={e => { setInput(e.target.value); logWithPopupContext({ screen_id:SCREENS.CHAT_VIEW, action_type:'text_input', target_id:TARGETS.MSG_INPUT, target_label:'message input' }); }}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            onFocus={() => { setShowAttachMenu(false); setShowMoreMenu(false); }}
            placeholder="Type a message"
            style={{ flex:1, background:'none', border:'none', outline:'none', color:'#111b21', fontSize:15, fontWeight:400, padding:'9px 8px', fontFamily:'inherit' }}
          />
          <IconBtn title={input.trim() ? 'Send' : 'Voice message'} onClick={handleSend}>
            {input.trim() ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#00a884"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f"><path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11h-2z"/></svg>
            )}
          </IconBtn>
        </div>
      </div>

      {(showAttachMenu || showMoreMenu) && (
        <div onClick={handleOverlayDismiss} style={{ position:'fixed', inset:0, zIndex:60 }} />
      )}

      {showForward && (
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#ffffff', borderRadius:12, width:'min(380px, 92vw)', maxHeight:'80dvh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 10px 40px rgba(0,0,0,0.25)' }}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #e9edef', display:'flex', alignItems:'center', gap:12 }}>
              <button onClick={handleForwardCancel}
                style={{ background:'none', border:'none', color:'#667781', cursor:'pointer', fontSize:20 }}>×</button>
              <div>
                <div style={{ color:'#111b21', fontSize:16, fontWeight:600 }}>Forward message</div>
                <div style={{ color:'#667781', fontSize:12 }}>Select a contact</div>
              </div>
            </div>
            <div style={{ padding:'10px 16px', borderBottom:'1px solid #e9edef', background:'#f0f2f5', fontSize:13, color:'#667781', fontStyle:'italic' }}>
              "{showForward.text.slice(0, 60)}{showForward.text.length > 60 ? '...' : ''}"
            </div>
            <div style={{ overflowY:'auto' }}>
              {CONTACTS.filter(c => c.id !== chat.contactId).map(c => (
                <div key={c.id} onClick={() => handleForwardSend(c)}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 20px', cursor:'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:c.color+'33', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:600, color:c.color }}>{c.avatar}</div>
                  <span style={{ color:'#111b21', fontSize:15 }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, title }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} title={title} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? '#e9edef' : 'none', border:'none', borderRadius:'50%', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
      {children}
    </button>
  );
}

function MsgActionBtn({ children, onClick, title }) {
  return (
    <button onClick={onClick} title={title}
      style={{ background:'#ffffff', border:'1px solid #e9edef', borderRadius:'50%', width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#54656f', fontSize:16, boxShadow:'0 2px 6px rgba(0,0,0,0.12)' }}>
      {children}
    </button>
  );
}