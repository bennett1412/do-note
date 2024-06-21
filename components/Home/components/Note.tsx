import React, { useRef, useEffect, useState, useContext, createContext } from "react";
import Tiptap from "./Tiptap";
import styles from "../styles/note.module.scss";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import { colors } from "../../../utils/common/noteColors";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { NoteContextType, NotesContextValue } from "@/types/Note";
import Button from "@/components/Common/Button";
import useDarkModeDetection from "@/hooks/useDarkMode";
import { CustomStyle } from "@/types/Styles";
import { NotesContext } from "./NotesList";
import Backdrop from "./Backdrop";

type NoteProps = {
  title: string;
  content: string;
  active: boolean;
  fsId: string;
  color: string;
  setSelectedId: (id: string | null) => void;
};

export const NoteContext = createContext<NoteContextType | undefined>(undefined);

const Note: React.FC<NoteProps> = ({
  title: noteTitle,
  content,
  active,
  fsId,
  color: noteColor,
  // updateNote,
  // deleteNote,
  setSelectedId,
}) => {
  const { updateNote } = useContext(NotesContext) as NotesContextValue;
  const [editMode, setEditMode] = useState<boolean>(active);
  const [title, setTitle] = useState<string>(noteTitle);
  const [color, setColor] = useState<string>(noteColor ?? "var(--note-bg-dark-4)");
  const ref = useRef<HTMLInputElement | null>(null);
  const noteRef = useRef<HTMLDivElement | null>(null);
  // const [inTransition, setInTransition] = useState<boolean>(false);
  const isDarkMode = useDarkModeDetection();
  useEffect(() => {
    const titleHandler = setTimeout(() => {
      if (title !== "" && title !== noteTitle) {
        // console.log("being updated");
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
    if (color !== noteColor) {
      updateNote(fsId, {
        color: color,
      });
    }
  }, [noteColor, color, fsId, updateNote]);

  const closeNote = () => {
    setEditMode(false);
    // if(noteRef.current) noteRef.current.style.zIndex = '0';
    setSelectedId(null);
  };

  // useOnClickOutside(noteRef, () => closeNote());
  useEffect(() => {
    if(noteRef.current && editMode) 
      noteRef.current.style.zIndex = '3';
  
  }, [editMode])
  
  const handleClick = () => {
    if (!editMode) {
      setEditMode(true);
      setSelectedId(fsId);
    }
  };

  const getColor = (index: number | undefined) => {
    // console.log(colors[index]);
    if (index) return colors[index];
    return isDarkMode ? "var(--color-surface-200)" : "var(--color-primary-200)";
  };

  const isNoteDarkThemed = (color: string): boolean => {
    return /dark/i.test(color);
  };
  // const handleAnimationStart = () => {
  //   if(noteRef.current && editMode) noteRef.current.style.zIndex = '2'
  // }
  const handleAnimationComplete = () => {
    if(noteRef.current && editMode === false) {
      noteRef.current.style.zIndex = '0';
    } 
  }
  return (
    <NoteContext.Provider
      value={{ noteTitle, content, editMode, fsId, color, setEditMode, setColor }}
    >
      <motion.div
      layout="position"
      // key={fs}
      className={styles.note_placeholder}
      >
        <AnimatePresence
          initial={false}
          // Fires when all exiting nodes have completed animating out
          onExitComplete={() => null}
        >
        {editMode && <Backdrop key={fsId} onClick={closeNote}/>}
        <motion.div
          ref={noteRef}
          layout
          style={{
            backgroundColor: color,
          }}
          className={clsx({
            [styles.note_container]: true,
            [styles.note_active]: editMode,
            [styles.dark]: isNoteDarkThemed(color),
          })}
          id={fsId}
          layoutId={fsId}
          // onAnimationStart={handleAnimationStart}
          onLayoutAnimationComplete={handleAnimationComplete}
          layoutDependency={editMode}
        >
          <motion.div
            style={{ "--note-bg": color } as CustomStyle}
            layout="position"
            className={styles.note_main}
            onClick={handleClick}
          >
            <div style={{ display: "flex" }}>
              {(title != "" || editMode) && (
                <input
                  // layout='position'
                  ref={ref}
                  // style={{ backgroundColor: color}}
                  disabled={!editMode}
                  defaultValue={title}
                  placeholder="Enter Title"
                  className={styles.title}
                  type={"text"}
                  onChange={(e) => setTitle(e.target.value)}
                />
              )}
              {editMode && (
                <Button
                  onClick={closeNote}
                  className={clsx({
                    [styles.note_button]: true,
                    [styles.dark_button]: !isNoteDarkThemed(color),
                    [styles.light_button]: isNoteDarkThemed(color),
                  })}
                >
                  <IoClose size={25} />
                </Button>
              )}
            </div>
            {/* text editor component */}
            <Tiptap />
          </motion.div>
          
          {/* <Tags /> */}
          {/* <BottomMenu */}
          {/*   fsId={fsId} */}
          {/*   active={editMode} */}
          {/*   deleteNote={deleteNote} */}
          {/*   setEditMode={(flag: boolean) => { */}
          {/*     if (noteRef.current) noteRef.current.scrollIntoView(); */}
          {/*     setEditMode(flag); */}
          {/*   }} */}
          {/*   setColor={setcolor} */}
          {/*   theme={color ?? 2 < 3 ? "light" : "dark"} */}
          {/* /> */}
        </motion.div>
        </AnimatePresence>
      </motion.div>
    </NoteContext.Provider>
  );
};

export default Note;
