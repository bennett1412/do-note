import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import '../styles/tiptap.scss'

const Tiptap = ({ editMode }) => {


    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: '<p>Hello World!</p>',
        editable: editMode
    })

    useEffect(() => {
        if (editor && !editor.isDestroyed) {
            if (editMode) {
                editor.setEditable();
            }
        }
    }, [editMode])

    return (
        <EditorContent className='editor' editor={editor} />
    )
}

export default Tiptap
