import React from 'react'
import '../styles/bottommenu.scss'
import { IoIosColorPalette } from 'react-icons/io'
const BottomMenu = () => {
    return (
        <div className='note-menu'>
            <button className='note-menu-button'><IoIosColorPalette /></button>
        </div>
    )
}

export default BottomMenu