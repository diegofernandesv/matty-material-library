import { useState, useRef, useEffect, useCallback } from 'react';
import { apiFetch } from '../../lib/apiFetch.js';
import './MattyAI.css';

function IconCreate() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconFind() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconCompare() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4H7M2 8H7M2 12H7M9 4H14M9 8H14M9 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M8 2V14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/></svg>;
}
function IconUpload() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 10V3M5 6L8 3L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 12H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconSend() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 2.5L7 9M13.5 2.5L9 14L7 9M13.5 2.5L2 6.5L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function MattyLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" style={{display:'block',flexShrink:0}} xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.8758 12.0088L11.1104 11.8324L10.2237 10.9203C9.23988 11.696 7.97575 12.1229 6.6681 12.1212C5.36058 12.1195 4.09841 11.6895 3.11713 10.9115L2.22708 11.8211L2.4611 11.9981C3.57185 12.8013 4.9374 13.2667 6.36046 13.3268L6.66679 13.3333C8.19914 13.3352 9.68301 12.8662 10.8758 12.0088Z" fill="currentColor"/>
      <path d="M4.65663 1.21212C4.65663 1.88156 4.05389 2.42424 3.31039 2.42424C3.27602 2.42424 3.24195 2.42308 3.20822 2.4208C3.18382 2.41915 3.15959 2.41692 3.13557 2.41411C2.47465 2.33695 1.96414 1.82821 1.96414 1.21212C1.96414 0.542685 2.56688 0 3.31039 0C4.05389 0 4.65663 0.542685 4.65663 1.21212Z" fill="currentColor"/>
      <path d="M11.3878 1.21212C11.3878 1.82821 10.8773 2.33695 10.2164 2.41411C10.1924 2.41692 10.1682 2.41915 10.1438 2.4208C10.11 2.42308 10.076 2.42424 10.0416 2.42424C9.29808 2.42424 8.69535 1.88156 8.69535 1.21212C8.69535 0.542685 9.29808 0 10.0416 0C10.7851 0 11.3878 0.542685 11.3878 1.21212Z" fill="currentColor"/>
      <path d="M6.67599 6.03575L3.20822 2.4208C3.18382 2.41915 3.15959 2.41692 3.13557 2.41411L0.00772882 8.04657L0.00148992 8.0578C0.0886747 8.6587 0.274614 9.23945 0.549007 9.78256L1.61661 7.85986L3.46092 4.53835L6.14273 7.33461L6.67599 7.89062L7.20795 7.33585L9.8904 4.53835L11.743 7.87401L12.8029 9.78241C13.0762 9.24147 13.2673 8.66419 13.3549 8.06569L10.2164 2.41411C10.1924 2.41692 10.1682 2.41915 10.1438 2.4208L6.67599 6.03575Z" fill="currentColor"/>
    </svg>
  );
}
function MaximizeIcon({ rotated }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{display:'block', transform: rotated ? 'rotate(180deg)' : 'none', flexShrink:0}}>
      <path d="M9.5 2H14V6.5M14 2L9 7M6.5 14H2V9.5M2 14L7 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconNewChat() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3H13a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V8M5 1L1 5m0 0l4 4M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconSearchChat() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}

const QUICK_ACTIONS = [
  { id: 'create',  Icon: IconCreate,  label: 'Create a material' },
  { id: 'find',    Icon: IconFind,    label: 'Find materials' },
  { id: 'compare', Icon: IconCompare, label: 'Compare materials' },
];

const FIND_FILTERS = {
  brand: [
    'Vero Moda', 'Jack & Jones', 'Vila', 'Only', 'Selected Homme',
    'Junarose', 'Pieces', 'Mamalicious', 'Noisy May', 'Object', 'Name It',
  ],
  category: ['Woven', 'Knit', 'Filling', 'Leather', 'Technical', 'Non-Woven'],
  composition: ['Cotton', 'Polyester', 'Wool', 'Silk', 'Linen', 'Nylon', 'Viscose', 'Recycled'],
};

function FindFilterMessage({ onSearch }) {
  const [sel, setSel] = useState({ brand: [], category: [], composition: [] });

  const toggle = (group, value) => {
    setSel(prev => {
      const has = prev[group].includes(value);
      return { ...prev, [group]: has ? prev[group].filter(v => v !== value) : [...prev[group], value] };
    });
  };

  const totalSelected = sel.brand.length + sel.category.length + sel.composition.length;

  const handleSearch = () => {
    const parts = [];
    if (sel.brand.length)       parts.push(`brand is ${sel.brand.join(' or ')}`);
    if (sel.category.length)    parts.push(`category is ${sel.category.join(' or ')}`);
    if (sel.composition.length) parts.push(`composition contains ${sel.composition.join(' or ')}`);
    const query = parts.length
      ? `Find materials where ${parts.join(', ')}`
      : 'Show me all materials';
    onSearch(query);
  };

  return (
    <div className="matty-find">
      <p className="matty-find__intro">Pick filters and I'll search for you:</p>

      {Object.entries(FIND_FILTERS).map(([group, options]) => (
        <div key={group} className="matty-find__group">
          <span className="matty-find__group-label">{group.toUpperCase()}</span>
          <div className="matty-find__chips">
            {options.map(opt => (
              <button
                key={opt}
                className={`matty-find__chip${sel[group].includes(opt) ? ' matty-find__chip--on' : ''}`}
                onClick={() => toggle(group, opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        className="matty-find__search-btn"
        onClick={handleSearch}
      >
        <IconFind />
        {totalSelected > 0 ? `Search (${totalSelected} filter${totalSelected > 1 ? 's' : ''})` : 'Show all materials'}
      </button>
    </div>
  );
}

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  type: 'welcome',
  content: "Hello 👋\n\nI'm Mat-ty, your materials assistant.\nI can help you explore materials and material templates from our internal library — for example:\n\n• Find materials by brand, category, composition, or supplier\n• Review material details like composition, weight, size, and tags\n• Check how many materials exist in a category or state\n• Understand material templates and their required fields\n\nJust let me know what you'd like to look up.",
};

// Renders **bold** inline
function Inline({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

// Parse a markdown table block into { headers, rows }
function parseMarkdownTable(lines) {
  const dataLines = lines.filter(l => !/^\|[-| :]+\|$/.test(l.trim()));
  return dataLines.map(line =>
    line.split('|').slice(1, -1).map(c => c.trim())
  );
}

// Full markdown → React renderer
function MarkdownContent({ content }) {
  const lines = content.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    // Markdown table
    if (line.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const [headers, ...rows] = parseMarkdownTable(tableLines);
      if (headers) {
        blocks.push(
          <div key={blocks.length} className="matty-table-wrap">
            <table className="matty-table">
              <thead>
                <tr>{headers.map((h, j) => <th key={j}><Inline text={h} /></th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row, j) => (
                  <tr key={j}>
                    {row.map((cell, k) => <td key={k}><Inline text={cell} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Bullet list — collect consecutive bullet lines
    if (line.match(/^[-•*]\s/)) {
      const items = [];
      while (i < lines.length && lines[i].trim().match(/^[-•*]\s/)) {
        items.push(lines[i].trim().replace(/^[-•*]\s/, ''));
        i++;
      }
      blocks.push(
        <ul key={blocks.length} className="matty-md-list">
          {items.map((item, j) => <li key={j}><Inline text={item} /></li>)}
        </ul>
      );
      continue;
    }

    // Heading (## or ###)
    if (line.startsWith('## ') || line.startsWith('### ')) {
      blocks.push(
        <p key={blocks.length} className="matty-md-heading">
          <Inline text={line.replace(/^#+\s/, '')} />
        </p>
      );
      i++;
      continue;
    }

    // Non-empty paragraph
    if (line) {
      blocks.push(<p key={blocks.length}><Inline text={line} /></p>);
    }

    i++;
  }

  return <>{blocks}</>;
}

function Message({ msg, onFindSearch }) {
  if (msg.role === 'user') {
    return (
      <div className="matty-msg matty-msg--user">
        <div className="matty-msg__bubble">{msg.content}</div>
      </div>
    );
  }

  if (msg.type === 'find-filter') {
    return (
      <div className="matty-msg matty-msg--assistant">
        <FindFilterMessage onSearch={onFindSearch} />
      </div>
    );
  }

  return (
    <div className="matty-msg matty-msg--assistant">
      <div className="matty-msg__body">
        <MarkdownContent content={msg.content} />
      </div>
    </div>
  );
}

function ThreadItem({ thread, isActive, onSelect, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      const res = await apiFetch(`/api/threads/${thread.id}`, { method: 'DELETE' });
      if (res.ok) onDelete(thread.id);
    } catch {
      // silently fail
    }
    setDeleting(false);
  };

  return (
    <li
      className={`matty-thread-item${isActive ? ' matty-thread-item--active' : ''}`}
      onClick={() => onSelect(thread)}
    >
      <span className="matty-thread-item__title">{thread.title}</span>
      <button
        className="matty-thread-item__del"
        onClick={handleDelete}
        disabled={deleting}
        title="Delete conversation"
        aria-label={`Delete: ${thread.title}`}
      >
        {deleting ? '···' : '×'}
      </button>
    </li>
  );
}

export default function MattyAI({ isOpen, onClose, onExpand }) {
  const [view, setView] = useState('chat'); // 'chat' | 'threads'
  const [expanded, setExpanded] = useState(false);
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [threadSearch, setThreadSearch] = useState('');
  const currentThreadRef = useRef(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const lastUserMsg = messages.filter(m => m.role === 'user').at(-1);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && view === 'chat') inputRef.current?.focus();
  }, [isOpen, view]);

  const loadThreads = useCallback(async () => {
    try {
      const res = await apiFetch('/api/threads');
      if (res.ok) {
        const data = await res.json();
        setThreads(data);
        return data;
      }
    } catch {
      // If API isn't running, fall back to welcome message
    }
    return [];
  }, []);

  const loadThreadMessages = useCallback(async (threadId) => {
    try {
      const res = await apiFetch(`/api/threads/${threadId}/messages`);
      if (res.ok) {
        const data = await res.json();
        return data.map(m => ({
          id: m.id,
          role: m.type === 'bot' ? 'assistant' : 'user',
          content: m.content,
        }));
      }
    } catch {
      // fall through
    }
    return [];
  }, []);

  // Every time the panel opens: refresh thread list.
  // Only auto-load a thread if none is currently selected.
  useEffect(() => {
    if (!isOpen) return;
    loadThreads().then(data => {
      if (data.length > 0 && !currentThreadRef.current) {
        loadThreadMessages(data[0].id).then(msgs => {
          setCurrentThread(data[0]);
          currentThreadRef.current = data[0];
          setMessages(msgs.length > 0 ? msgs : [WELCOME_MESSAGE]);
        });
      }
    });
  }, [isOpen, loadThreads, loadThreadMessages]);

  const selectThread = async (thread) => {
    setCurrentThread(thread);
    currentThreadRef.current = thread;
    setView('chat');
    const msgs = await loadThreadMessages(thread.id);
    setMessages(msgs.length > 0 ? msgs : [WELCOME_MESSAGE]);
  };

  const startNewThread = () => {
    setCurrentThread(null);
    currentThreadRef.current = null;
    setMessages([WELCOME_MESSAGE]);
    setInput('');
    setView('chat');
  };

  const openThreads = async () => {
    const data = await loadThreads();
    setThreads(data);
    setView('threads');
  };

  const handleDeleteThread = (deletedId) => {
    setThreads(prev => {
      const remaining = prev.filter(t => t.id !== deletedId);
      if (currentThreadRef.current?.id === deletedId) {
        currentThreadRef.current = null;
        setCurrentThread(null);
        if (remaining.length > 0) {
          selectThread(remaining[0]);
        } else {
          setMessages([WELCOME_MESSAGE]);
          setView('chat');
        }
      }
      return remaining;
    });
  };

  const showFindFilter = () => {
    // Replace any existing find-filter card and show a fresh one
    setMessages(prev => [
      ...prev.filter(m => m.type !== 'find-filter'),
      { id: 'find-filter-' + Date.now(), role: 'assistant', type: 'find-filter', content: '' },
    ]);
  };

  const handleQuickAction = (id) => {
    if (id === 'find') {
      showFindFilter();
    } else {
      const labels = { create: 'Create a material: ', compare: 'Compare materials: ' };
      setInput(labels[id] || '');
      inputRef.current?.focus();
    }
  };

  // Sends a pre-built query string (e.g. from the find-filter UI)
  const sendQuery = async (text) => {
    // Remove the filter card from the message list
    setMessages(prev => prev.filter(m => m.type !== 'find-filter'));
    // Temporarily set input so `send` picks it up
    setInput(text);
    await sendText(text);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');
    await sendText(text);
  };

  const sendText = async (text) => {
    if (!text || isTyping) return;
    setIsTyping(true);

    if (!currentThread) {
      // Create a new thread
      const title = text.length > 50 ? text.slice(0, 50) + '...' : text;

      // Optimistic: show user message immediately
      const optimisticId = Date.now();
      setMessages(prev => [
        ...prev.filter(m => m.id !== 'welcome'),
        { id: optimisticId, role: 'user', content: text },
      ]);

      try {
        const res = await apiFetch('/api/threads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content: text }),
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentThread(data.thread);
          currentThreadRef.current = data.thread;
          setThreads(prev => [data.thread, ...prev]);

          const newMsgs = [
            { id: data.userMessage.id, role: 'user', content: data.userMessage.content },
          ];
          if (data.botMessage) {
            newMsgs.push({ id: data.botMessage.id, role: 'assistant', content: data.botMessage.content });
          }
          setMessages(newMsgs);
        } else {
          // API error – show a friendly fallback
          setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'assistant',
            content: 'Sorry, I couldn\'t connect to the server. Please check that the backend is running.',
          }]);
        }
      } catch {
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'assistant',
          content: 'Connection error. Make sure the backend server is running.',
        }]);
      }
    } else {
      // Existing thread – add user message optimistically
      setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: text }]);

      try {
        const res = await apiFetch(`/api/threads/${currentThread.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'user', content: text }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.botMessage) {
            setMessages(prev => [
              ...prev,
              { id: data.botMessage.id, role: 'assistant', content: data.botMessage.content },
            ]);
          }
        } else {
          setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
          }]);
        }
      } catch {
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'assistant',
          content: 'Connection error. Make sure the backend server is running.',
        }]);
      }
    }

    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const filteredThreads = threads.filter(t =>
    t.title.toLowerCase().includes(threadSearch.toLowerCase())
  );

  const chevronLeft = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const clockIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 8V12L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const plusIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  // Inline JSX blocks — NOT sub-components (avoids remount on every keystroke)
  const inputArea = (
    <div className="matty__input-area">
      <div className="matty__quick-actions">
        {QUICK_ACTIONS.map(({ id, Icon, label }) => (
          <button key={id} className="matty__quick-btn" onClick={() => handleQuickAction(id)}>
            <Icon />
            <span>{label.toUpperCase()}</span>
          </button>
        ))}
      </div>
      <div className="matty__input-box">
        <div className="matty__input-inner">
          <textarea
            ref={inputRef}
            className="matty__textarea"
            placeholder="Ask Matty anything…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <div className="matty__input-footer">
            <button className="matty__upload-btn">
              <IconUpload />
              <span>UPLOAD FILE</span>
            </button>
            <button className="matty__send-btn" onClick={send} disabled={!input.trim() || isTyping}>
              <IconSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const messagesArea = (
    <div className="matty__messages">
      {messages.map(msg => (
        <Message key={msg.id} msg={msg} onFindSearch={sendQuery} />
      ))}
      {isTyping && (
        <div className="matty-msg matty-msg--assistant">
          <div className="matty-msg__body matty-msg__typing">
            <span /><span /><span />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  // ── Expanded view (full two-column layout) ───────────────────────────────────
  if (expanded && isOpen) {
    return (
      <aside className="matty matty--open matty--expanded">

        {/* Brand header — matches Figma "Header Matty Expanded" exactly */}
        <div className="matty__exp-header">
          <div className="matty__exp-brand">
            <MattyLogo />
            <span>matty</span>
          </div>
          <button className="matty__exp-collapse" onClick={() => setExpanded(false)} title="Collapse">
            <MaximizeIcon />
          </button>
        </div>

        {/* Body: sidebar + chat */}
        <div className="matty__exp-body">

          {/* Thread sidebar */}
          <aside className="matty__exp-sidebar">
            <div className="matty__exp-sidebar-topbar">
              <button className="matty__back" onClick={() => {}} title="Back">
                {chevronLeft}
              </button>
              <span className="matty__topbar-query" title={lastUserMsg?.content}>
                {lastUserMsg?.content || 'Ask Matty anything…'}
              </span>
              <button className="matty__history" onClick={startNewThread} title="New chat">{plusIcon}</button>
              <button className="matty__history" onClick={openThreads} title="History">{clockIcon}</button>
            </div>

            <button className="matty__exp-action" onClick={startNewThread}>
              <IconNewChat /> <span>NEW CHAT</span>
            </button>
            <button className="matty__exp-action" onClick={openThreads}>
              <IconSearchChat /> <span>SEARCH CHATS</span>
            </button>

            <span className="matty__exp-section">Recents</span>

            <ul className="matty__thread-list">
              {filteredThreads.length === 0 && (
                <li className="matty__thread-empty">
                  {threads.length === 0 ? 'No conversations yet' : 'No matches'}
                </li>
              )}
              {filteredThreads.map(t => (
                <ThreadItem
                  key={t.id}
                  thread={t}
                  isActive={t.id === currentThread?.id}
                  onSelect={selectThread}
                  onDelete={handleDeleteThread}
                />
              ))}
            </ul>
          </aside>

          {/* Chat panel */}
          <div className="matty__exp-chat">
            {messagesArea}
            {inputArea}
          </div>
        </div>
      </aside>
    );
  }

  // ── Threads view (compact) ───────────────────────────────────────────────────
  if (view === 'threads') {
    return (
      <aside className={`matty${isOpen ? ' matty--open' : ''}`}>
        <div className="matty__topbar">
          <button className="matty__back" onClick={() => setView('chat')}>{chevronLeft}</button>
          <span className="matty__topbar-query">Conversations</span>
          <button className="matty__history" onClick={startNewThread} title="New chat">{plusIcon}</button>
        </div>

        <div className="matty__thread-search">
          <input
            type="text"
            placeholder="Search conversations…"
            value={threadSearch}
            onChange={e => setThreadSearch(e.target.value)}
            className="matty__thread-search-input"
          />
        </div>

        <ul className="matty__thread-list">
          {filteredThreads.length === 0 && (
            <li className="matty__thread-empty">
              {threads.length === 0 ? 'No conversations yet' : 'No matches'}
            </li>
          )}
          {filteredThreads.map(t => (
            <ThreadItem
              key={t.id}
              thread={t}
              isActive={t.id === currentThread?.id}
              onSelect={selectThread}
              onDelete={handleDeleteThread}
            />
          ))}
        </ul>
      </aside>
    );
  }

  // ── Compact chat view ────────────────────────────────────────────────────────
  return (
    <aside className={`matty${isOpen ? ' matty--open' : ''}`}>
      {/* Compact topbar — matches Figma "header matty": rotated maximize + matty title */}
      <div className="matty__topbar">
        <button className="matty__expand-btn" onClick={() => { setExpanded(true); onExpand?.(); }} title="Expand">
          <MaximizeIcon rotated />
        </button>
        <div className="matty__topbar-brand">
          <MattyLogo />
          <span className="matty__topbar-brand-text">matty</span>
        </div>
        <button className="matty__history" onClick={openThreads} title="History">{clockIcon}</button>
        <button className="matty__back" onClick={onClose} title="Close">{chevronLeft}</button>
      </div>

      {messagesArea}
      {inputArea}
    </aside>
  );
}
