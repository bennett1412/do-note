import React, { useRef, useEffect, useState } from "react";
import Tiptap from "./Tiptap";
import "../../../styles/home/note.scss";
import BottomMenu from "./BottomMenu";
import clsx from "clsx";
import OutsideClickHandler from "react-outside-click-handler";
import CustomOutsideClickHandler from "./minor/CustomOutsideClickHandler";
import Tags from "./minor/Tags";
import { IoClose } from "react-icons/io5";
import { updateNote } from "./../../../utils/firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";

const Note = ({
  title: noteTitle,
  content,
  active,
  fsId,
  color: noteColor,
}) => {
  const [editMode, setEditMode] = useState(active);
  const [title, setTitle] = useState(noteTitle);
  const [color, setColor] = useState(noteColor);
  const ref = useRef();
  const noteRef = useRef();
  useEffect(() => {
    const titleHandler = setTimeout(() => {
      if (title !== "" && title !== noteTitle) {
        updateNote(fsId, {
          noteTitle: title,
        });
      }
    }, 3000);
    return () => {
      clearTimeout(titleHandler);
    };
  }, [fsId, noteTitle, title]);

  const handleClick = (e) => {
    if (!editMode) {
      setEditMode(true);
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
        style={{
          backgroundColor: color ?? "#d7dede",
          border: `1px solid ${(color & 0xfefefe) >> 1}`,
        }}
        className={clsx({ "note-container": true, "note-active": editMode })}
        id={fsId}
      >
        <div className="note-main" onClick={handleClick}>
          <div style={{ display: "flex" }}>
            <input
              ref={ref}
              style={{ backgroundColor: color ?? "#d7dede" }}
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
        <BottomMenu
          fsId={fsId}
          active={editMode}
          setEditMode={(flag) => {
            noteRef.current.scrollIntoView();
            setEditMode(flag);
          }}
          setColor={setColor}
        />
      </div>
    </OutsideClickHandler>
  );
};

export default Note;
