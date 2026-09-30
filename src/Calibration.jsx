import React, { useState } from 'react';
import { SCREENS, CHATS } from './data';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';

// Standalone calibration harness for the Session 1 probe study.
// Not part of the normal participant flow — reached only via ?calibrate=SS1 (or SS2, SS3)
// in the URL. Renders the exact static state each stimulus screen requires, using the
// REAL Sidebar/ChatView components (so fonts/layout/spacing are pixel-identical to the
// live app), then lets you export:
//   1. A rects JSON — every element tagged data-target-id, with its exact
//      getBoundingClientRect() position, so Block 1/2 hit-testing and circled-control
//      images can be built without hand-measuring anything.
//   2. Instructions for capturing the matching screenshot via Chrome DevTools, which
//      shares the same coordinate space as getBoundingClientRect() (viewport-relative),
//      so the two line up exactly.

const noop = () => {};

function freshChats() {
  return CHATS.map(c => ({ ...c, messages: c.messages.map(m => ({ ...m })) }));
}

export default function Calibration({ screenId }) {
  const [chats] = useState(freshChats);
  const [exported, setExported] = useState(false);

  const activeChat =
    screenId === 'SS2' ? chats.find(c => c.contactId === 'C02') // Bob
    : screenId === 'SS3' ? chats.find(c => c.contactId === 'C01') // Alice
    : null;

  const currentScreen = screenId === 'SS1' ? SCREENS.CHAT_LIST : SCREENS.CHAT_VIEW;

  const exportRects = () => {
    const nodes = Array.from(document.querySelectorAll('[data-target-id]'));
    const rects = {};
    nodes.forEach(el => {
      const id = el.getAttribute('data-target-id');
      if (!id) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return; // skip hidden/unmounted elements
      // If the same target_id appears more than once (shouldn't normally happen for a
      // given static screen), keep the first and note the collision rather than silently
      // overwriting it.
      if (rects[id]) {
        rects[id] = { ...rects[id], _duplicate: true };
        return;
      }
      rects[id] = {
        x: Math.round(r.left), y: Math.round(r.top),
        width: Math.round(r.width), height: Math.round(r.height),
        top: Math.round(r.top), left: Math.round(r.left),
        right: Math.round(r.right), bottom: Math.round(r.bottom),
      };
    });

    const payload = {
      screen: screenId,
      captured_at: new Date().toISOString(),
      viewport: { width: window.innerWidth, height: window.innerHeight, devicePixelRatio: window.devicePixelRatio },
      rects,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `calibration_${screenId}_rects.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExported(true);
  };

  const stubProps = {
    onLog: noop, onNavigate: noop, onSelectChat: noop, setSearchQuery: noop,
    onLogout: noop, onCreateGroup: noop, onSend: noop, onForward: noop, onStar: noop,
    onViewMessage: noop, updateTaskState: noop, onOpenContactPanel: noop,
    onToggleMute: noop, onToggleBlock: noop, onToggleFavorite: noop,
    onClearChat: noop, onDeleteChat: noop, onOpenChatSearch: noop,
  };

  return (
    <div style={{ height:'100vh', width:'100vw', display:'flex', flexDirection:'column' }}>
      {/* This bar sits ABOVE the app and is not part of the app's own DOM tree, so
          capturing a screenshot of just the viewport below it (or using DevTools'
          device-toolbar capture, which captures only the emulated viewport) excludes it
          automatically. */}
      <div style={{ background:'#1f2937', color:'#fff', padding:'8px 16px', fontSize:13, display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
        <strong>CALIBRATION MODE — {screenId}</strong>
        <span style={{ opacity:0.8 }}>Viewport: {window.innerWidth}×{window.innerHeight} · Resize the window/DevTools device toolbar to your target dimensions BEFORE capturing.</span>
        <button onClick={exportRects} style={{ marginLeft:'auto', background:'#00a884', border:'none', borderRadius:6, color:'#fff', padding:'6px 14px', cursor:'pointer', fontWeight:600 }}>
          Export rects JSON
        </button>
        {exported && <span style={{ color:'#7ee787' }}>✓ Downloaded</span>}
      </div>

      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        <Sidebar
          {...stubProps}
          currentScreen={currentScreen}
          activeChat={activeChat}
          chats={chats}
          searchQuery=""
          favoriteContacts={new Set()}
          activeAdaptivePopupId={null}
          readChats={new Set()}
          setReadChats={noop}
        />
        {screenId !== 'SS1' && (
          <ChatView
            {...stubProps}
            chat={activeChat}
            taskState={{}}
            isMuted={false} isBlocked={false} isFavorite={false}
            highlightMessageId={null}
            activeAdaptivePopupId={null}
          />
        )}
        {screenId === 'SS1' && <div style={{ flex:1, background:'#f0f2f5' }} />}
      </div>
    </div>
  );
}
