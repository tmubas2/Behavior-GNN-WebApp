import React, { useState, useRef, useEffect } from 'react';

export default function TaskBar({ task, taskIndex, totalTasks, active = true, onLog, onHeightChange, onMaxAttemptsReached }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const timeoutRef = useRef(null);
  const barRef = useRef(null);
  const prematureClicksRef = useRef(0);

  useEffect(() => {
    setShowFeedback(false);
    prematureClicksRef.current = 0;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [task?.task_id]);

  useEffect(() => {
    const el = barRef.current;
    if (!el || !onHeightChange) return;
    const measure = () => onHeightChange(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onHeightChange, showFeedback]);

  const handleDoneClick = () => {
    if (!active) return;

    prematureClicksRef.current += 1;

    onLog && onLog({
      action_type:  'tap',
      target_id:    'TGT_TASK_DONE',
      target_label: `done button (premature attempt ${prematureClicksRef.current})`,
    });

    if (prematureClicksRef.current >= 2) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setShowFeedback(false);
      onMaxAttemptsReached && onMaxAttemptsReached();
      return;
    }

    setShowFeedback(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowFeedback(false), 4000);
  };

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 300,
        background: '#ffffff',
        borderBottom: '2px solid #00a884',
        boxShadow: '0 4px 20px rgba(0,168,132,0.15)',
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:16, padding:'10px 20px', position:'relative' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
            <span style={{ background:'#00a884', color:'white', fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:20, letterSpacing:0.5, flexShrink:0 }}>
              TASK {taskIndex+1}/{totalTasks}
            </span>
            <span style={{ color:'#111b21', fontSize:14, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {task.task_name}
            </span>
          </div>
          <p style={{ color:'#667781', fontSize:12, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {task.task_description}
          </p>
        </div>

        <div style={{ display:'flex', gap:8, flexShrink:0 }}>
          <button
            onClick={handleDoneClick}
            disabled={!active}
            style={{
              padding:'7px 16px',
              background: active ? '#00a884' : '#cfe9e0',
              border:'none', borderRadius:8,
              color: active ? 'white' : '#7fae9f',
              fontSize:13, fontWeight:600,
              cursor: active ? 'pointer' : 'default',
              fontFamily:'inherit',
            }}
          >
            ✓ Skip
          </button>
        </div>

        {showFeedback && (
          <div style={{
            position:'absolute', top:'100%', left:20, right:20, marginTop:8,
            background:'#fdecea', border:'1px solid #e57373', borderRadius:6,
            padding:'6px 12px', fontSize:12, color:'#c0392b',
            boxShadow:'0 4px 12px rgba(0,0,0,0.1)',
          }}>
            ⚠️ Not quite yet — this task isn't complete. Keep going!
          </div>
        )}
      </div>
    </div>
  );
}