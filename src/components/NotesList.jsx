import React from 'react'
import Note from './Note';
import '../styles/noteslist.scss';
const NotesList = () => {
    return (
        <section className='notes-list'>
            <Note />
        </section>
    )
}

export default NotesList