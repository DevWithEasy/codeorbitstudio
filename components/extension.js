// extension.js
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import HardBreak from '@tiptap/extension-hard-break'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'

const extenstions =  [
  StarterKit,
  Link.configure({ openOnClick: false }),
  HardBreak,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Color,
  Placeholder.configure({
    placeholder: 'Type something here...',
  }),
]

export default extenstions;
