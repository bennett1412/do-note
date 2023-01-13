// src/Tiptap.jsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import '../styles/tiptap.scss'
const Tiptap = () => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: '<p>Hello World!</p>',
    })

    return (
        <EditorContent className='editor' editor={editor} />
    )
}

export default Tiptap
