import React, { useRef, useEffect, useState, ReactNode } from "react";
import Tiptap from "./Tiptap";
import styles from "@/styles/home/note.module.scss";
import BottomMenu from "./BottomMenu";
import clsx from "clsx";
// import OutsideClickHandler from "react-outside-click-handler";
import { IoClose } from "react-icons/io5";
import { updateNote } from "./../../../utils/firebase/firestore";
import { colors } from "../../../utils/common/noteColors";
import { motion } from "framer-motion";

type NoteProps = {
  title: string;
  content: string;
  active: boolean;
  fsId: string;
  color: number;
  updateNote: Function;
  deleteNote: Function;
};

const Note = ({
  title: noteTitle,
  content,
  active,
  fsId,
  color: noteColor,
  updateNote,
  deleteNote,
}: NoteProps) => {
  const [editMode, setEditMode] = useState<boolean>(active);
  const [title, setTitle] = useState<string>(noteTitle);
  const [colorIndex, setColorIndex] = useState<number>(noteColor);
  const ref = useRef<HTMLInputElement | null>(null);
  const noteRef = useRef<HTMLDivElement | null>(null);

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
  }, [fsId, noteTitle, title, updateNote]);

  useEffect(() => {
    if (colorIndex !== noteColor) {
      updateNote(fsId, {
        color: colorIndex,
      });
    }
  }, [noteColor, colorIndex, fsId, updateNote]);

  const handleClick = () => {
    if (!editMode) {
      setEditMode(true);
    }
  };

  const handleBackgroundClick = () => {
    if (editMode) {
      setEditMode(false);
    }
  };

  const closeNote = () => {
    setEditMode(false);
  };
  const OutsideClickHandler = ({
    children,
    onOutsideClick,
  }: {
    children: ReactNode;
    onOutsideClick: Function;
  }) => {
    return <div>{children}</div>;
  };
  return (
    <OutsideClickHandler onOutsideClick={handleBackgroundClick}>
      <motion.div
        layoutId={fsId}
        ref={noteRef}
        style={{ backgroundColor: colors[colorIndex] ?? colors[2] }}
        className={clsx({
          [styles.note_container]: true,
          [styles.note_active]: editMode,
          [styles.dark]: colorIndex > 2,
        })}
        id={fsId}
      >
        <div className={styles.note_main} onClick={handleClick}>
          <div style={{ display: "flex" }}>
            {(title != "" || editMode) && (
              <input
                ref={ref}
                style={{ backgroundColor: colors[colorIndex] ?? colors[2] }}
                disabled={!editMode}
                defaultValue={title}
                placeholder="Enter Title"
                className={styles.title}
                type={"text"}
                onChange={(e) => setTitle(e.target.value)}
              />
            )}
            {editMode && (
              <button onClick={closeNote} className={'icon_button'} >
                <IoClose style={{ mixBlendMode: "difference" }} size={25} />
              </button>
            )}
          </div>
          <Tiptap
            fsId={fsId}
            editMode={editMode}
            updateNote={updateNote}
            content={content}
          />
        </div>
        {/* <Tags /> */}
        <BottomMenu
          fsId={fsId}
          active={editMode}
          deleteNote={deleteNote}
          setEditMode={(flag: boolean) => {
            noteRef.current!.scrollIntoView();
            setEditMode(flag);
          }}
          setColor={setColorIndex}
          theme={colorIndex ?? 2 < 3 ? "light" : "dark"}
        />
      </motion.div>
    </OutsideClickHandler>
  );
};

export default Note;
