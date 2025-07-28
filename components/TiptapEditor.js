'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { useState } from 'react';
import MenuBar from './MenuBar';
import extenstions from './extension';

export default function TiptapEditor() {
  const [content, setContent] = useState('<p>Write here...</p>');

  const editor = useEditor({
    extensions: extenstions,
    content: content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'h-full flex-1 overflow-y-auto p-2 font-bangla focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return <div>Loading editor...</div>;

  return (
    <div className="w-full h-96 mx-auto flex flex-col border border-gray-300 rounded-lg">
      <MenuBar editor={editor} />
      <div className="w-full flex flex-col overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
