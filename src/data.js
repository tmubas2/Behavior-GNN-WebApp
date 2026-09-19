export const SCREENS = {
  PARTICIPANT_SETUP: 'SCR_SETUP',
  TASK_BRIEFING:     'SCR_TASK_BRIEF',
  CHAT_LIST:         'SCR_CHAT_LIST',
  CHAT_VIEW:         'SCR_CHAT_VIEW',
  CONTACT_INFO:      'SCR_CONTACT_INFO',
  NEW_CHAT:          'SCR_NEW_CHAT',
  NEW_GROUP:         'SCR_NEW_GROUP',
  SEARCH:            'SCR_SEARCH',
  STARRED:           'SCR_STARRED',
  SETTINGS:          'SCR_SETTINGS',
  STATUS:            'SCR_STATUS',
  TASK_COMPLETE:     'SCR_TASK_COMPLETE',
  SESSION_COMPLETE:  'SCR_SESSION_COMPLETE',

  CHAT_SEARCH:        'SCR_CHAT_SEARCH',

  FORWARD_MODAL:      'SCR_FORWARD_MODAL',
  ATTACH_MENU:        'SCR_ATTACH_MENU',
  CHAT_MORE_MENU:     'SCR_CHAT_MORE_MENU',
  MSG_ACTION_MENU:    'SCR_MSG_ACTION_MENU',
  SIDEBAR_MENU:       'SCR_SIDEBAR_MENU',
};

export const TARGETS = {
 
  NAV_SEARCH_ICON:     'TGT_NAV_SEARCH',
  NAV_NEW_CHAT:        'TGT_NAV_NEWCHAT',
  NAV_MENU:            'TGT_NAV_MENU',
  NAV_STARRED:         'TGT_NAV_STARRED',
  NAV_SETTINGS:        'TGT_NAV_SETTINGS',
  NAV_STATUS_ICON:     'TGT_NAV_STATUS_ICON',
  STATUS_ADD_BTN:      'TGT_STATUS_ADD_BTN',
  STATUS_TEXT_INPUT:   'TGT_STATUS_TEXT_INPUT',
  STATUS_POST_BTN:     'TGT_STATUS_POST_BTN',
  STATUS_CANCEL_BTN:   'TGT_STATUS_CANCEL_BTN',

  CHAT_ITEM:           'TGT_CHAT_ITEM',
  SEARCH_INPUT:        'TGT_SEARCH_INPUT',
  SEARCH_RESULT:       'TGT_SEARCH_RESULT',

  BACK_BUTTON:         'TGT_BACK_BTN',
  CONTACT_HEADER:      'TGT_CONTACT_HEADER',
  MSG_REPLY:           'TGT_MSG_REPLY',
  MSG_FORWARD:         'TGT_MSG_FORWARD',
  MSG_STAR:            'TGT_MSG_STAR',
  MSG_ITEM:            'TGT_MSG_ITEM',
  MSG_MORE_BTN:        'TGT_MSG_MORE_BTN',
  MSG_COPY:            'TGT_MSG_COPY',
  MSG_DELETE:          'TGT_MSG_DELETE',
  REPLY_CANCEL:        'TGT_REPLY_CANCEL',
  SEND_BTN:            'TGT_SEND_BTN',
  ATTACH_BTN:          'TGT_ATTACH_BTN',
  EMOJI_BTN:           'TGT_EMOJI_BTN',
  MSG_INPUT:           'TGT_MSG_INPUT',
  SCROLL_ACTION:       'TGT_SCROLL',

  CONTACT_MUTE:        'TGT_CONTACT_MUTE',
  CONTACT_BLOCK:       'TGT_CONTACT_BLOCK',
  CONTACT_MEDIA_TAB:   'TGT_CONTACT_MEDIA_TAB',
  CONTACT_SEARCH:        'TGT_CONTACT_SEARCH',
  CONTACT_STARRED:       'TGT_CONTACT_STARRED',
  CONTACT_DISAPPEARING:  'TGT_CONTACT_DISAPPEARING',
  CONTACT_PRIVACY:       'TGT_CONTACT_PRIVACY',
  CONTACT_ENCRYPTION:    'TGT_CONTACT_ENCRYPTION',
  CONTACT_FAVORITE:      'TGT_CONTACT_FAVORITE',
  CONTACT_PANEL_CLOSE:   'TGT_CONTACT_PANEL_CLOSE',

  FORWARD_CONTACT:     'TGT_FORWARD_CONTACT',
  FORWARD_SEND:        'TGT_FORWARD_SEND',
  FORWARD_CANCEL:      'TGT_FORWARD_CANCEL',

  NEW_CHAT_CONTACT:    'TGT_NEWCHAT_CONTACT',
  NEW_CHAT_SEARCH:     'TGT_NEWCHAT_SEARCH',

  NEW_GROUP_CONTACT:    'TGT_NEWGROUP_CONTACT',
  NEW_GROUP_NEXT:       'TGT_NEWGROUP_NEXT',
  NEW_GROUP_NAME_INPUT: 'TGT_NEWGROUP_NAME_INPUT',
  NEW_GROUP_CREATE:     'TGT_NEWGROUP_CREATE',

  HELP_BTN:            'TGT_HELP_BTN',
  TASK_DONE_BTN:       'TGT_TASK_DONE',
  NEXT_TASK_BTN:       'TGT_NEXT_TASK',

  CHAT_MORE_BTN:          'TGT_CHAT_MORE_BTN',
  CHAT_MENU_INFO:         'TGT_CHAT_MENU_INFO',
  CHAT_MENU_SEARCH:       'TGT_CHAT_MENU_SEARCH',
  CHAT_MENU_SELECT:       'TGT_CHAT_MENU_SELECT',
  CHAT_MENU_DISAPPEARING: 'TGT_CHAT_MENU_DISAPPEARING',
  CHAT_MENU_ADD_LIST:     'TGT_CHAT_MENU_ADD_LIST',
  CHAT_MENU_CLOSE_CHAT:   'TGT_CHAT_MENU_CLOSE_CHAT',
  CHAT_MENU_CALL_LINK:    'TGT_CHAT_MENU_CALL_LINK',
  CHAT_MENU_REPORT:       'TGT_CHAT_MENU_REPORT',
  CHAT_MENU_CLEAR:        'TGT_CHAT_MENU_CLEAR',
  CHAT_MENU_DELETE:       'TGT_CHAT_MENU_DELETE',

  SIDEBAR_MENU_NEW_GROUP:     'TGT_SB_NEW_GROUP',
  SIDEBAR_MENU_ARCHIVED:      'TGT_SB_ARCHIVED',
  SIDEBAR_MENU_SELECT_CHATS:  'TGT_SB_SELECT_CHATS',
  SIDEBAR_MENU_MARK_ALL_READ: 'TGT_SB_MARK_ALL_READ',
  SIDEBAR_MENU_APP_LOCK:      'TGT_SB_APP_LOCK',
  SIDEBAR_MENU_SETTINGS:      'TGT_SB_SETTINGS',
  SIDEBAR_MENU_LOGOUT:        'TGT_SB_LOGOUT',

  ATTACH_MENU_DOC:     'TGT_ATTACH_DOC',
  ATTACH_MENU_PHOTOS:  'TGT_ATTACH_PHOTOS',
  ATTACH_MENU_CAMERA:  'TGT_ATTACH_CAMERA',
  ATTACH_MENU_CONTACT: 'TGT_ATTACH_CONTACT',
  ATTACH_MENU_POLL:    'TGT_ATTACH_POLL',

  OVERLAY_DISMISS:     'TGT_OVERLAY_DISMISS',
};

export const ADAPTIVE_PANEL_SCREENS = new Set([
  SCREENS.CONTACT_INFO,
  SCREENS.CHAT_SEARCH,
]);

export const POPUP_SCREENS = new Set([
  SCREENS.FORWARD_MODAL,
  SCREENS.ATTACH_MENU,
  SCREENS.CHAT_MORE_MENU,
  SCREENS.MSG_ACTION_MENU,
  SCREENS.SIDEBAR_MENU,
]);

export function getScreenType(screenId) {
  if (POPUP_SCREENS.has(screenId)) return 'popup';
  if (ADAPTIVE_PANEL_SCREENS.has(screenId)) return 'adaptive_panel';
  return 'screen';
}

export const CONTACTS = [
  { id: 'C01', name: 'Alice Johnson',   avatar: 'AJ', color: '#6B8CFF', phone: '+1 312 555 0101' },
  { id: 'C02', name: 'Bob Martinez',    avatar: 'BM', color: '#FF8C69', phone: '+1 312 555 0102' },
  { id: 'C03', name: 'Carol Williams',  avatar: 'CW', color: '#69FFB8', phone: '+1 312 555 0103' },
  { id: 'C05', name: 'Emma Davis',      avatar: 'ED', color: '#FF69E1', phone: '+1 312 555 0105' },
];

export function getChatContact(chat) {
  if (!chat) return null;
  if (chat.isGroup) {
    return {
      id: chat.id,
      name: chat.groupName || 'Group',
      avatar: chat.groupAvatar || '👥',
      color: '#8696A0',
      phone: `${chat.members?.length || 0} members`,
      isGroup: true,
      members: chat.members || [],
    };
  }
  return CONTACTS.find(c => c.id === chat.contactId);
}

export function getChatFavKey(chat) {
  if (!chat) return null;
  return chat.isGroup ? chat.id : chat.contactId;
}

const now = Date.now();
const m = (mins) => now - mins * 60000;

export const CHATS = [
  {
    id: 'CH01', contactId: 'C01',
    messages: [
      { id: 'MSG001', from: 'C01', text: 'Hey! Are you coming to the meeting tomorrow?', time: m(120), starred: false },
      { id: 'MSG002', from: 'me',  text: 'Yes, I will be there at 10am', time: m(118), starred: false },
      { id: 'MSG003', from: 'C01', text: 'Great! Do not forget to bring the report', time: m(115), starred: false },
      { id: 'MSG004', from: 'C01', text: 'Also, can you forward me that budget document?', time: m(60), starred: false },
      { id: 'MSG005', from: 'me',  text: 'Sure, I will send it over shortly', time: m(58), starred: false },
      { id: 'MSG006', from: 'C01', text: 'Thanks a lot! See you tomorrow 👍', time: m(30), starred: false },
    ]
  },
  {
    id: 'CH02', contactId: 'C02',
    messages: [
      { id: 'MSG007', from: 'C02', text: 'Did you see the game last night?', time: m(200), starred: false },
      { id: 'MSG008', from: 'me',  text: 'No, I missed it. What happened?', time: m(195), starred: false },
      { id: 'MSG009', from: 'C02', text: 'It was incredible! Last minute goal!', time: m(190), starred: false },
      { id: 'MSG010', from: 'C02', text: 'I recorded it, want me to send you the link?', time: m(45), starred: false },
      { id: 'MSG011', from: 'me',  text: 'Yes please!', time: m(40), starred: false },
    ]
  },
  {
    id: 'CH03', contactId: 'C03',
    messages: [
      { id: 'MSG012', from: 'C03', text: 'Hi! Happy birthday! 🎂🎉', time: m(300), starred: false },
      { id: 'MSG013', from: 'me',  text: 'Thank you so much Carol!', time: m(290), starred: false },
      { id: 'MSG014', from: 'C03', text: 'Are you doing anything special today?', time: m(285), starred: false },
      { id: 'MSG015', from: 'C03', text: 'We should go for dinner!', time: m(280), starred: false },
      { id: 'MSG016', from: 'me',  text: 'That sounds wonderful!', time: m(275), starred: false },
    ]
  },
  {
    id: 'CH05', contactId: 'C05',
    messages: [
      { id: 'MSG021', from: 'C05', text: 'The package arrived! Thank you!', time: m(500), starred: false },
      { id: 'MSG022', from: 'me',  text: 'So glad it got there safely!', time: m(495), starred: false },
      { id: 'MSG023', from: 'C05', text: 'I love it, exactly what I wanted', time: m(490), starred: false },
    ]
  },
];

export const TASKS = [
  {
    task_id: 'T01',
    task_name: 'Forward a Message',
    task_description: 'Forward the most recent message from Alice to Bob.',
    // Runs once when the task starts. Whatever it returns is stored as this
    // task's "target" (the specific thing the participant needs to do),
    // computed fresh from current chat state so it stays correct even if
    // messages/chats change between sessions.
    setup: (chats) => {
      const aliceChat = chats.find(c => c.contactId === 'C01');
      const lastAliceMsg = aliceChat?.messages[aliceChat.messages.length - 1];
      return { requiredMessageId: lastAliceMsg?.id || null };
    },
    // Runs on every state change while the task is active. Return true the
    // moment the participant has actually accomplished the task.
    checkCompletion: (taskTarget, taskState, chats) => {
      const requiredMessageId = taskTarget.requiredMessageId;
      return !!requiredMessageId && taskState.forwardedMessages.some(
        (f) => f.to === 'C02' && f.msg?.id === requiredMessageId
      );
    },
  },
  {
    task_id: 'T02',
    task_name: 'Create a Group',
    task_description: 'Create a group chat between Alice, Carol, and Emma.',
    setup: () => ({}),
    checkCompletion: (taskTarget, taskState, chats) => {
      const required = ['C01', 'C03', 'C05'];
      return chats.some((c) => (
        c.isGroup &&
        Array.isArray(c.members) &&
        c.members.length === required.length &&
        required.every((id) => c.members.includes(id))
      ));
    },
  },
  {
    task_id: 'T03',
    task_name: 'Reply to a Message',
    task_description: 'Bob mentioned a game last night. Reply to that message and let him know you saw it.',
    // Finds the target message by matching its text rather than a hardcoded
    // message ID, so this keeps working even if CHATS content changes later.
    setup: (chats) => {
      const bobChat = chats.find(c => c.contactId === 'C02');
      const targetMsg = bobChat?.messages.find(m => m.text.toLowerCase().includes('game last night'));
      return { requiredMessageId: targetMsg?.id || null, chatId: bobChat?.id || null };
    },
    // Completion only requires that the participant used the Reply feature
    // on the correct message (structural correctness) — matching T01's
    // approach, we don't grade the exact wording they typed.
    checkCompletion: (taskTarget, taskState) => {
      const { requiredMessageId, chatId } = taskTarget;
      return !!requiredMessageId && taskState.sentMessages.some(
        (s) => s.chatId === chatId && s.msg?.replyTo === requiredMessageId
      );
    },
  },
  {
    task_id: 'T04',
    task_name: 'Star an Important Message',
    task_description: "Find the message where Carol invites you to dinner, and star it so you don't lose it.",
    setup: (chats) => {
      const carolChat = chats.find(c => c.contactId === 'C03');
      const targetMsg = carolChat?.messages.find(m => m.text.toLowerCase().includes('dinner'));
      return { requiredMessageId: targetMsg?.id || null };
    },
    // Starring updates the authoritative `chats` state directly (see
    // App.jsx's handleStar), so we check live chats rather than taskState.
    checkCompletion: (taskTarget, taskState, chats) => {
      const { requiredMessageId } = taskTarget;
      return !!requiredMessageId && chats.some(c =>
        c.messages.some(m => m.id === requiredMessageId && m.starred)
      );
    },
  },
  {
    task_id: 'T05',
    task_name: 'Search for a Message',
    task_description: "Use search to find the message that mentions a 'budget document', then open that chat.",
    setup: (chats) => {
      const aliceChat = chats.find(c => c.contactId === 'C01');
      const targetMsg = aliceChat?.messages.find(m => m.text.toLowerCase().includes('budget document'));
      return { requiredMessageId: targetMsg?.id || null };
    },
    // Only counts if the participant actually reached this message via the
    // search screen (see App.jsx's handleSelectChat / searchesPerformed) —
    // not just by opening Alice's chat some other way, since that would
    // test recognition, not search usage.
    checkCompletion: (taskTarget, taskState) => {
      const { requiredMessageId } = taskTarget;
      return !!requiredMessageId && taskState.searchesPerformed.some(
        (s) => s.messageId === requiredMessageId
      );
    },
  },
  {
    task_id: 'T06',
    task_name: 'Send a Photo',
    task_description: 'Send a photo to Emma using the attachment button.',
    setup: (chats) => {
      const emmaChat = chats.find(c => c.contactId === 'C05');
      return { chatId: emmaChat?.id || null };
    },
    checkCompletion: (taskTarget, taskState) => {
      const { chatId } = taskTarget;
      return !!chatId && taskState.sentMessages.some(
        (s) => s.chatId === chatId && s.msg?.attachment?.isImage
      );
    },
  },
  {
    task_id: 'T07',
    task_name: 'Mark All Chats as Read',
    task_description: 'Open the menu and mark all your chats as read.',
    // Uses the sidebar's ⋮ menu — a plain dropdown with no invisible
    // backdrop overlapping it, unlike ChatView's popups (which have a known
    // click-registration bug). Already proven reliable via T02 and T09.
    setup: () => ({}),
    // IMPORTANT: this checks whether the "Mark all as read" button was
    // actually clicked (taskState.markAllReadClicks), NOT whether every
    // chat currently happens to be in the readChats set. Simply opening a
    // chat also marks it read as a side effect (see handleChatSelect), so
    // by the time a participant reaches this task, every chat is usually
    // already "read" from earlier tasks (T01/T03/T04/T05/T06 all require
    // opening a chat) — checking readChats directly would auto-complete
    // this task instantly, with zero action from the participant.
    checkCompletion: (taskTarget, taskState) => {
      const clicks = taskState.markAllReadClicks || [];
      return clicks.length > 0;
    },
  },
  {
    task_id: 'T08',
    task_name: 'Delete a Sent Message',
    task_description: "Delete the message where you said 'Yes please!' to Bob.",
    // Targets a message already in the fixture data (from:'me'), rather than
    // requiring the participant to send something new first.
    setup: (chats) => {
      const bobChat = chats.find(c => c.contactId === 'C02');
      const targetMsg = bobChat?.messages.find(m => m.from === 'me' && m.text.toLowerCase().includes('yes please'));
      return { requiredMessageId: targetMsg?.id || null };
    },
    // Deleting a message only updates ChatView's local `messages` state and
    // taskState (see handleDeleteMessage) — it does NOT sync back to the
    // parent `chats` state the way starring does. So completion must be
    // checked via taskState.deletedMessages, not via chats.
    checkCompletion: (taskTarget, taskState) => {
      const { requiredMessageId } = taskTarget;
      return !!requiredMessageId && taskState.deletedMessages.some(
        (d) => d.msg?.id === requiredMessageId
      );
    },
  },
  {
    task_id: 'T09',
    task_name: 'Turn Off Notifications',
    task_description: 'Turn off notifications for the app in Settings.',
    setup: () => ({}),
    // Checks the most recent toggle rather than "was it ever turned off",
    // so a later re-enable correctly reflects as incomplete rather than
    // giving credit for a state that no longer holds.
    checkCompletion: (taskTarget, taskState) => {
      const toggles = taskState.notificationToggles || [];
      return toggles.length > 0 && toggles[toggles.length - 1].enabled === false;
    },
  },
  {
    task_id: 'T10',
    task_name: 'Post a Status Update',
    task_description: 'Add a status update that says: Enjoying a sunny day!',
    // The Status feature didn't exist before this task was added — built new,
    // reachable via the desktop icon rail's Status button (now wired up) or,
    // cross-platform, via the sidebar's ⋮ menu (proven reliable on both
    // mobile and desktop, unlike ChatView's popups).
    setup: () => ({}),
    checkCompletion: (taskTarget, taskState) => {
      const posted = taskState.postedStatuses || [];
      return posted.length > 0;
    },
  },
];