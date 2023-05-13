import React, { useRef, useEffect, useState } from "react";
import Tiptap from "./Tiptap";
import styles from "@/styles/home/note.module.scss";
import BottomMenu from "./BottomMenu";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import { colors } from "../../../utils/common/noteColors";
import { motion } from "framer-motion";
// import useOnClickOutside from "@/hooks/useOnClickOutside";
import Head from "next/head";
import { DeleteMutation, UpdateNoteFn } from "@/types/Note";
import Button from "@/components/Common/Button";

type NoteProps = {
  title: string;
  content: string;
  active: boolean;
  fsId: string;
  color: number;
  updateNote: UpdateNoteFn;
  deleteNote: DeleteMutation;
  setSelectedId: (id: string | null) => void;
};

const Note: React.FC<NoteProps> = ({
  title: noteTitle,
  content,
  active,
  fsId,
  color: noteColor,
  updateNote,
  deleteNote,
  setSelectedId,
}) => {
  const [editMode, setEditMode] = useState<boolean>(active);
  const [title, setTitle] = useState<string>(noteTitle);
  const [colorIndex, setColorIndex] = useState<number>(noteColor);
  const ref = useRef<HTMLInputElement | null>(null);
  const noteRef = useRef<HTMLDivElement | null>(null);
  // const [inTransition, setInTransition] = useState<boolean>(false);
  useEffect(() => {
    const titleHandler = setTimeout(() => {
      if (title !== "" && title !== noteTitle) {
        console.log("being updated");
        updateNote(fsId, {
          noteTitle: title,
        });
      }
    }, 3000);
    return () => {
      clearTimeout(titleHandler);
    };
  }, [fsId, title, noteTitle, updateNote]);

  useEffect(() => {
    if (colorIndex !== noteColor) {
      updateNote(fsId, {
        colorIndex: colorIndex,
      });
    }
  }, [noteColor, colorIndex, fsId, updateNote]);

  const closeNote = () => {
    console.log("closing note");
    setEditMode(false);
    setSelectedId(null);
  };

  // useOnClickOutside(noteRef, () => closeNote());

  const handleClick = () => {
    if (!editMode) {
      setEditMode(true);
      setSelectedId(fsId);
    }
  };

  //   const handleBackgroundClick = () => {
  //     if (editMode) {
  //       setEditMode(false);
  //     }
  //   };

  return (
    <div>
      <Head>
        <title>Notes</title>
      </Head>
      <motion.div
        ref={noteRef}
        transition={{ zIndex: { duration: 0 } }}
        layout
        style={{
          backgroundColor: colors[colorIndex] ?? colors[2],
        }}
        className={clsx({
          [styles.note_container]: true,
          [styles.note_active]: editMode,
          [styles.dark]: colorIndex > 2,
        })}
        id={fsId}
        layoutId={fsId}
      >
        <motion.div layout="position" className={styles.note_main} onClick={handleClick}>
          <div style={{ display: "flex" }}>
            {(title != "" || editMode) && (
              <input
                // layout='position'
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
              <Button onClick={closeNote} className={"icon_button"}>
                {/* <IoClose style={{ mixBlendMode: "difference" }} size={25} /> */}
              </Button>
            )}
          </div>
          {/* text editor component */}
          <Tiptap fsId={fsId} editMode={editMode} updateNote={updateNote} content={content} />
        </motion.div>
        {/* <Tags /> */}
        <BottomMenu
          fsId={fsId}
          active={editMode}
          deleteNote={deleteNote}
          setEditMode={(flag: boolean) => {
            if (noteRef.current) noteRef.current.scrollIntoView();
            setEditMode(flag);
          }}
          setColor={setColorIndex}
          theme={colorIndex ?? 2 < 3 ? "light" : "dark"}
        />
      </motion.div>
    </div>
  );
};

export default Note;
