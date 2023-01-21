import { useRef, useEffect } from 'react'
import Note from './Note';
import '../styles/noteslist.scss';
import { IoAddOutline } from 'react-icons/io5';
import { notes } from '../notes';
const NotesList = () => {
    const Notes = notes;
    const handleAdd = () => {
        console.log('adding')
        // Notes.append
    }

    return (
        <section className='notes-list'>
            {Notes.map((note, i) => {
                return <Note key={i} title={note.noteTitle} content={note.noteContent} />
            })}
            <button onClick={handleAdd} className='add-button'><IoAddOutline size={25} color='white' /></button>
        </section>
    )
}

export default NotesList