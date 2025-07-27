'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaParagraph,
  FaHeading,
  FaListOl,
  FaListUl,
  FaQuoteRight,
  FaRedo,
  FaUndo,
  FaLink,
} from 'react-icons/fa';

export default function TiptapEditor({ content, onChange }) {
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[200px] p-4',
      },
    },
    immediatelyRender: false,  // Important for avoiding SSR hydration errors
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!editor || !mounted) return;

    const currentContent = editor.getHTML();
    if (content !== currentContent) {
      editor.commands.setContent(content);
    }
  }, [content, editor, mounted]);

  if (!mounted) {
    return (
      <div className="border rounded bg-white p-4 min-h-[200px]">
        Loading editor...
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded bg-white">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <FaBold />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <FaItalic />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
          title="Strikethrough"
        >
          <FaStrikethrough />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
          title="Heading 1"
        >
          <span className="flex items-center">
            <FaHeading className="mr-1" />1
          </span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          title="Heading 2"
        >
          <span className="flex items-center">
            <FaHeading className="mr-1" />2
          </span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('paragraph') ? 'bg-gray-200' : ''}`}
          title="Paragraph"
        >
          <FaParagraph />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="Bullet List"
        >
          <FaListUl />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="Numbered List"
        >
          <FaListOl />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          title="Blockquote"
        >
          <FaQuoteRight />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('code') ? 'bg-gray-200' : ''}`}
          title="Code"
        >
          <FaCode />
        </button>

        <button
          type="button"
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt('Enter URL', previousUrl || '');
            if (url === null) {
              return;
            }
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
          title="Link"
        >
          <FaLink />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200"
          title="Undo"
        >
          <FaUndo />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200"
          title="Redo"
        >
          <FaRedo />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
