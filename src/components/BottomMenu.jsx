import React from 'react'
import '../styles/bottommenu.scss'
import { IoIosColorPalette } from 'react-icons/io'
import { FiEdit3 } from 'react-icons/fi'
import { TbPinned } from 'react-icons/tb'
import clsx from 'clsx'

const BottomMenu = ({ setEditMode }) => {
    return (
        <div className='toolbar'>
            <button className='toolbar-button'><IoIosColorPalette color="white" /></button>
            <button onClick={setEditMode} className='toolbar-button'><FiEdit3 /></button>
            <button className='toolbar-button'><TbPinned /></button>
        </div>
    )
}

export default BottomMenu