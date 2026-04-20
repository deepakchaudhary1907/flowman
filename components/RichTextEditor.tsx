'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useEffect, useState } from 'react';

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const ToolBtn = ({ active, onClick, title, children }: { active: boolean; onClick: () => void; title: string; children: React.ReactNode }) => (
  <button type="button" title={title} onClick={onClick} style={{
    padding: '5px 10px', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.5px',
    background: active ? 'var(--cobalt)' : 'white', color: active ? 'white' : 'var(--ink)',
    border: `1.5px solid ${active ? 'var(--cobalt)' : 'var(--mist)'}`, borderRadius: 4,
    cursor: 'pointer', transition: 'all 0.15s',
  }}>{children}</button>
);

export default function RichTextEditor({ value, onChange }: Props) {
const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!mounted || !editor) return null;


  return (
    <div style={{ border: '1.5px solid var(--mist)', borderRadius: 8, overflow: 'hidden', background: 'white' }}>
      <div style={{ background: 'var(--fog)', borderBottom: '1px solid var(--mist)', padding: '8px 10px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        <ToolBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">B</ToolBtn>
        <ToolBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><em>I</em></ToolBtn>
        <ToolBtn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><u>U</u></ToolBtn>
        <div style={{ width: 1, background: 'var(--mist)', margin: '2px 4px' }} />
        <ToolBtn active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="H1">H1</ToolBtn>
        <ToolBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2">H2</ToolBtn>
        <ToolBtn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="H3">H3</ToolBtn>
        <div style={{ width: 1, background: 'var(--mist)', margin: '2px 4px' }} />
        <ToolBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">• List</ToolBtn>
        <ToolBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered List">1. List</ToolBtn>
        <div style={{ width: 1, background: 'var(--mist)', margin: '2px 4px' }} />
        <ToolBtn active={false} onClick={() => editor.chain().focus().undo().run()} title="Undo">↩</ToolBtn>
        <ToolBtn active={false} onClick={() => editor.chain().focus().redo().run()} title="Redo">↪</ToolBtn>
      </div>
      <div style={{ background: 'white', minHeight: 220, cursor: 'text' }} onClick={() => editor.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
