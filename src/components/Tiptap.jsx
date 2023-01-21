import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import FloatingMenu from './minor/FloatingMenu';
import StarterKit from '@tiptap/starter-kit'
import '../styles/tiptap.scss'
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

const Tiptap = ({ editMode, content }) => {


    const editor = useEditor({
        extensions: [
            StarterKit,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        editable: false,
        content: content,
        onCreate: () => {
            console.log('editor being created')
        }
    })

    useEffect(() => {
        if (editor && !editor.isDestroyed) {
            if (editMode) {
                editor.setEditable(true);
            } else {
                editor.setEditable(false);
            }
        }
    }, [editMode, editor])

    return (
        <>

            <FloatingMenu editor={editor} />
            <EditorContent className='editor' editor={editor} />
        </>
    )
}

export default Tiptap
