import { useRef, useState } from 'react'
import Tiptap from './Tiptap'
import '../styles/note.scss'
import BottomMenu from './BottomMenu';
import clsx from 'clsx';
import OutsideClickHandler from 'react-outside-click-handler';

const Note = () => {
    const [editMode, setEditMode] = useState(false);
    const ref = useRef()
    const handleClick = (e) => {
        e.target.focus();
        if (!editMode)
            setEditMode(true);
    }

    const handleBackgroundClick = () => {
        if (editMode) {
            setEditMode(false);
        }
    }
    return (
        <OutsideClickHandler onOutsideClick={handleBackgroundClick}>
            <div className={clsx({ 'note-container': true, 'note-active': editMode })}>
                <div onClick={handleClick}>
                    <input disabled={!editMode} defaultValue={"Test"} className='title' type={'text'} />
                    <Tiptap editMode={editMode} />
                </div>
                <BottomMenu />
            </div>
        </OutsideClickHandler>
    )
}

export default Note