import React, { useRef, useEffect, useState } from "react";
import Tiptap from "./Tiptap";
import "../../../styles/home/note.scss";
import BottomMenu from "./BottomMenu";
import clsx from "clsx";
import OutsideClickHandler from "react-outside-click-handler";
import { IoClose } from "react-icons/io5";
import { updateNote } from "./../../../utils/firebase/firestore";
import { colors } from "../../../utils/common/noteColors";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Note = ({
  title: noteTitle,
  content,
  active,
  fsId,
  color: noteColor,
}) => {
  const [editMode, setEditMode] = useState(active);
  const [title, setTitle] = useState(noteTitle);
  const [colorIndex, setColorIndex] = useState(noteColor);
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
  useEffect(() => {
    if (colorIndex !== noteColor) {
      updateNote(fsId, {
        color: colorIndex,
      });
    }
  }, [noteColor, colorIndex, fsId]);
  const handleClick = (e) => {
    if (!editMode) {
      setEditMode(true);
    }
  };
  // useEffect(() => {
  //   if (editMode) {
  //     var resizeListener = window.addEventListener("resize", (e) => {
  //       let keyboardHeight = e.target.height;
  //       console.log("resized", keyboardHeight);
  //       noteRef.current.style.height = `${window.innerHeight}px`;
  //     });
  //   }
  //   return () => {
  //     window.removeEventListener("resize", resizeListener);
  //   };
  // }, [editMode]);

  const handleBackgroundClick = () => {
    if (editMode) {
      setEditMode(false);
      // noteRef.current.style.transform = ``;
      // noteRef.current.style.position = "";
      // ref.current.scrollIntoView();
    }
  };

  const closeNote = () => {
    setEditMode(false);
  };
  const [parent] = useAutoAnimate();
  return (
    <OutsideClickHandler onOutsideClick={handleBackgroundClick}>
      <div
        // ref={noteRef}
        ref={parent}
        style={{ backgroundColor: colors[colorIndex] ?? "#d7dede" }}
        className={clsx({
          "note-container": true,
          "note-active": editMode,
          dark: colorIndex > 2,
        })}
        id={fsId}
      >
        <div className="note-main" onClick={handleClick}>
          <div style={{ display: "flex" }}>
            <input
              ref={ref}
              style={{ backgroundColor: colors[colorIndex] ?? "#d7dede" }}
              disabled={!editMode}
              defaultValue={title}
              placeholder="Enter Title"
              className="title"
              type={"text"}
              onChange={(e) => setTitle(e.target.value)}
            />
            {editMode && (
              <button onClick={closeNote} className="icon-button">
                <IoClose style={{ mixBlendMode: "difference" }} size={25} />
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
          setColor={setColorIndex}
        />
      </div>
    </OutsideClickHandler>
  );
};

export default Note;
