// MenuBar.jsx
import {
  BiUndo, BiRedo
} from "react-icons/bi";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatStrikethrough,
  MdCode,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdClear,
  MdOutlineFormatAlignLeft,
  MdOutlineFormatAlignCenter,
  MdOutlineFormatAlignRight,
  MdOutlineFormatAlignJustify,
} from "react-icons/md";

export default function MenuBar({ editor }) {

  if (!editor) return null;

  const buttons = [
    {
      icon: <BiUndo />,
      label: 'Undo',
      onClick: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
      className: ''
    },
    {
      icon: <BiRedo />,
      label: 'Redo',
      onClick: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
      className: ''
    },
    {
      icon: <MdFormatBold />,
      label: 'Bold',
      onClick: () => editor.chain().focus().toggleBold().run(),
      disabled: !editor.can().toggleBold(),
      className: editor.isActive('bold') ? 'is-active' : ''
    },
    {
      icon: <MdFormatItalic />,
      label: 'Italic',
      onClick: () => editor.chain().focus().toggleItalic().run(),
      disabled: !editor.can().toggleItalic(),
      className: editor.isActive('italic') ? 'is-active' : ''
    },
    {
      icon: <MdFormatStrikethrough />,
      label: 'Strike',
      onClick: () => editor.chain().focus().toggleStrike().run(),
      disabled: !editor.can().toggleStrike(),
      className: editor.isActive('strike') ? 'is-active' : ''
    },
    {
      icon: <MdCode />,
      label: 'Code',
      onClick: () => editor.chain().focus().toggleCode().run(),
      disabled: !editor.can().toggleCode(),
      className: editor.isActive('code') ? 'is-active' : ''
    },
    {
      icon: <MdFormatListBulleted />,
      label: 'Bullet List',
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      disabled: !editor.can().toggleBulletList(),
      className: editor.isActive('bulletList') ? 'is-active' : ''
    },
    {
      icon: <MdFormatListNumbered />,
      label: 'Ordered List',
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      disabled: !editor.can().toggleOrderedList(),
      className: editor.isActive('orderedList') ? 'is-active' : ''
    },
    {
      icon: <MdFormatQuote />,
      label: 'Blockquote',
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      disabled: !editor.can().toggleBlockquote(),
      className: editor.isActive('blockquote') ? 'is-active' : ''
    },
    {
      icon: <MdClear />,
      label: 'Clear Formatting',
      onClick: () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
      disabled: false,
      className: ''
    },
    // Text Align buttons
    {
      icon: <MdOutlineFormatAlignLeft />,
      label: 'Align Left',
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      disabled: false,
      className: editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''
    },
    {
      icon: <MdOutlineFormatAlignCenter />,
      label: 'Align Center',
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      disabled: false,
      className: editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''
    },
    {
      icon: <MdOutlineFormatAlignRight />,
      label: 'Align Right',
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      disabled: false,
      className: editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''
    },
    {
      icon: <MdOutlineFormatAlignJustify />,
      label: 'Align Justify',
      onClick: () => editor.chain().focus().setTextAlign('justify').run(),
      disabled: false,
      className: editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''
    },
  ]

  return (
    <div className="menu-bar p-2 flex flex-wrap gap-2 border-b rounded-tl-lg rounded-tr-lg border-gray-300 bg-white">
      {buttons.map((button, i) => (
        <button
          key={i}
          onClick={button.onClick}
          disabled={button.disabled}
          className={`p-1 border rounded ${button.className} ${button.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
          title={button.label}
          type="button"
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
}
