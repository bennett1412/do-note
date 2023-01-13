import React from 'react'
import Tiptap from './Tiptap'
import '../styles/note.scss'
import BottomMenu from './BottomMenu';
const Note = () => {
    return (
        <div className='note-container'>
            <input value={"Test"} className='title' type={'text'} />
            <Tiptap />
            <BottomMenu />
        </div>
    )
}

export default Note