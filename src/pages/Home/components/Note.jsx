import { useRef, useEffect, useState } from "react";
import Tiptap from "./Tiptap";
import "../../../styles/home/note.scss";
import BottomMenu from "./BottomMenu";
import clsx from "clsx";
import OutsideClickHandler from "react-outside-click-handler";
import CustomOutsideClickHandler from "./minor/CustomOutsideClickHandler";
import Tags from "./minor/Tags";
import { IoClose } from "react-icons/io5";
import { updateNote } from "./../../../utils/firebase/firestore";
const Note = ({ title: noteTitle, content, active, fsId }) => {
  const [editMode, setEditMode] = useState(active);
  const [title, setTitle] = useState(noteTitle);
  const ref = useRef();
  const noteRef = useRef();

  useEffect(() => {
    const titleHandler = setTimeout(() => {
      if (title != "") {
        console.log("updateing title");
        updateNote(fsId, {
          noteTitle: title,
        });
      }
    }, 3000);
    return () => {
      clearTimeout(titleHandler);
    };
  }, [title]);
  useEffect(() => {
    // let grid = noteRef.current;
    // let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    // let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    // let rowSpan = Math.ceil((grid.querySelector('.content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
    // grid.style.gridRowEnd = "span " + rowSpan;
  }, []);

  const handleClick = (e) => {
    e.target.focus();
    if (!editMode) {
      setEditMode(true);
      // let box = noteRef.current.getBoundingClientRect()
      // console.log('running')
      // noteRef.current.style.position = 'fixed';
      // let centerX = window.innerWidth / 2 - (box.left + box.right) / 2;
      // let centerY = window.innerHeight / 2 - (box.top + box.bottom) / 2;
      // console.log(centerX, centerY)
      // noteRef.current.style.transform = `translate(${centerX}px ,${centerY}px)`;
    }
  };

  const handleBackgroundClick = () => {
    if (editMode) {
      setEditMode(false);
      noteRef.current.style.transform = ``;
      noteRef.current.style.position = "";
      ref.current.scrollIntoView();
    }
  };

  const closeNote = () => {
    setEditMode(false);
  };
  return (
    <OutsideClickHandler onOutsideClick={handleBackgroundClick}>
      <div
        ref={noteRef}
        className={clsx({ "note-container": true, "note-active": editMode })}
      >
        <div className="note-main" onClick={handleClick}>
          <div style={{ display: "flex" }}>
            <input
              ref={ref}
              disabled={!editMode}
              defaultValue={title}
              placeholder="Enter Title"
              className="title"
              type={"text"}
              onChange={(e) => setTitle(e.target.value)}
            />
            {editMode && (
              <button onClick={closeNote} className="icon-button">
                <IoClose color="black" size={25} />
              </button>
            )}
          </div>
          <Tiptap fsId={fsId} editMode={editMode} content={content} />
        </div>
        {/* <Tags /> */}
        <BottomMenu setEditMode={handleClick} />
      </div>
    </OutsideClickHandler>
  );
};

export default Note;
