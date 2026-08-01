import { useState, useEffect } from 'react';
import { Save, FileText, Trash2, Plus, Download, Eye, Edit3 } from 'lucide-react';

function renderMarkdown(md) {
  if (!md) return '';
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<ul><p>/g, '<ul>').replace(/<\/p><\/ul>/g, '</ul>');
  html = html.replace(/<li><br><\/li>/g, '');
  return html;
}

const defaultNotes = [
  { id: 'welcome', title: 'Welcome', content: '# Welcome to Markdown Notes!\n\nThis is a **free** markdown editor that saves everything in your browser.\n\n## Features\n\n- **Bold** and *italic* text\n- `Code snippets`\n- [Links](https://example.com)\n- Lists\n- Headers\n\nEverything is stored locally. No data ever leaves your browser.\n' }
];

export default function MarkdownNotesTool() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('freeforge_mdnotes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultNotes;
  });

  const [activeId, setActiveId] = useState(() => {
    try {
      const saved = localStorage.getItem('freeforge_mdnotes_active');
      if (saved) {
        const parsed = JSON.parse(saved);
        const stored = JSON.parse(localStorage.getItem('freeforge_mdnotes') || '[]');
        if (stored.some(n => n.id === parsed)) return parsed;
      }
    } catch {}
    return 'welcome';
  });

  const [editorContent, setEditorContent] = useState('');
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeNote = notes.find(n => n.id === activeId);
  const filteredNotes = searchQuery
    ? notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : notes;

  useEffect(() => {
    const note = notes.find(n => n.id === activeId);
    if (note) {
      setEditorContent(note.content);
    }
  }, [activeId, notes]);

  useEffect(() => {
    localStorage.setItem('freeforge_mdnotes', JSON.stringify(notes));
    localStorage.setItem('freeforge_mdnotes_active', JSON.stringify(activeId));
  }, [notes, activeId]);

  useEffect(() => {
    if (!saving) return;
    const timer = setTimeout(() => setSaving(false), 1000);
    return () => clearTimeout(timer);
  }, [saving]);

  const saveNote = () => {
    if (!activeNote) return;
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, content: editorContent } : n));
    setSaving(true);
  };

  const createNote = () => {
    const id = 'note_' + Date.now();
    const newNote = { id, title: 'Untitled', content: '# New Note\n\nStart writing...' };
    setNotes(prev => [...prev, newNote]);
    setActiveId(id);
    setPreview(false);
  };

  const deleteNote = (id) => {
    if (notes.length <= 1) return;
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeId === id) {
      const remaining = notes.filter(n => n.id !== id);
      setActiveId(remaining[0]?.id || '');
    }
  };

  const renameNote = (id, title) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, title } : n));
  };

  const exportNote = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (activeNote.title || 'note') + '.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="utility-tool">
      <div className="tool-options" style={{ marginBottom: '12px' }}>
        <h3 className="options-title">
          <FileText size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Markdown Notes
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 220px', minWidth: '180px' }}>
          <div className="tool-options" style={{ marginBottom: '12px' }}>
            <input
              type="text" className="option-input" placeholder="Search notes..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', marginBottom: '8px' }}
            />
            <button className="process-btn" onClick={createNote} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', justifyContent: 'center' }}>
              <Plus size={14} /> New Note
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '400px', overflowY: 'auto' }}>
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => { setActiveId(note.id); setPreview(false); }}
                style={{
                  background: note.id === activeId ? 'rgba(59,130,246,0.12)' : '#0f172a',
                  border: note.id === activeId ? '1px solid #3b82f6' : '1px solid #334155',
                  borderRadius: '8px', padding: '10px 12px', cursor: 'pointer',
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <FileText size={14} color={note.id === activeId ? '#60a5fa' : '#64748b'} style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  value={note.title}
                  onChange={e => renameNote(note.id, e.target.value)}
                  onClick={e => e.stopPropagation()}
                  style={{
                    flex: 1, background: 'transparent', border: 'none', color: note.id === activeId ? '#f1f5f9' : '#94a3b8',
                    fontSize: '13px', fontWeight: note.id === activeId ? 600 : 400, outline: 'none', cursor: 'text',
                    minWidth: 0, width: '100%', fontFamily: 'inherit'
                  }}
                />
                {notes.length > 1 && (
                  <button
                    onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <div className="tool-options" style={{ marginBottom: '12px' }}>
            <div className="notepad-bar">
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className={`process-btn ${!preview ? 'active' : ''}`}
                  onClick={() => setPreview(false)}
                  style={{ padding: '6px 12px', fontSize: '12px', opacity: preview ? 0.6 : 1 }}
                >
                  <Edit3 size={12} /> Edit
                </button>
                <button
                  className={`process-btn ${preview ? 'active' : ''}`}
                  onClick={() => setPreview(true)}
                  style={{ padding: '6px 12px', fontSize: '12px', opacity: preview ? 1 : 0.6 }}
                >
                  <Eye size={12} /> Preview
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {saving && <span style={{ fontSize: '12px', color: '#4ade80' }}>Saved</span>}
                <span className="notepad-stats">{editorContent.length} chars</span>
                <button onClick={exportNote} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                  <Download size={14} />
                </button>
              </div>
            </div>
          </div>

          {preview ? (
            <div
              className="tool-options"
              style={{ minHeight: '300px', maxHeight: '500px', overflowY: 'auto', lineHeight: '1.7' }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(editorContent) }}
            />
          ) : (
            <textarea
              className="notepad-textarea"
              value={editorContent}
              onChange={e => setEditorContent(e.target.value)}
              placeholder="Start typing markdown..."
              style={{ minHeight: '300px', maxHeight: '500px' }}
            />
          )}

          <div className="service-actions" style={{ marginTop: '12px' }}>
            <button className="process-btn" onClick={saveNote}>
              <Save size={16} /> Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
