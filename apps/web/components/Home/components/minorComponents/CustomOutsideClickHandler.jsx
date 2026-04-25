import React, { useRef, useEffect } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
const CustomOutsideClickHandler = ({ children, className, onOutsideClick, refProp }) => {
    const ref = useRef();
    useEffect(() => {
        ref.current.class = className;
    }, [className])

    return (
        <OutsideClickHandler ref={refProp} onOutsideClick={onOutsideClick}>
            {children}
        </OutsideClickHandler>
    )
}

export default CustomOutsideClickHandler