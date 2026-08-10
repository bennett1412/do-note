import type React from "react";
import { useRef, useEffect, useState, useContext, createContext } from "react";
import Tiptap from "./Tiptap";
import styles from "../styles/note.module.scss";
import clsx from "clsx";
import { CloseIcon } from "@/utils/icons";
import { AnimatePresence, motion } from "framer-motion";
import type { NoteContextType, NotesContextValue } from "@/types/Note";
import type { CustomStyle } from "@/types/Styles";
import { NotesContext } from "./NotesList";
import Backdrop from "./Backdrop";

type NoteProps = {
  title: string;
  content: string;
  fsId: string;
  color: string;
  setSelectedId: (id: string | null) => void;
};

export const NoteContext = createContext<NoteContextType | undefined>(undefined);

const Note: React.FC<NoteProps> = ({
  title: note_title,
  content,
  fsId,
  color: noteColor,
  setSelectedId,
}) => {
  const { updateNote } = useContext(NotesContext) as NotesContextValue;
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(note_title);
  const [color, setColor] = useState<string>(noteColor ?? "var(--note-bg-dark-4)");
  const ref = useRef<HTMLInputElement | null>(null);
  const noteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const titleHandler = setTimeout(() => {
      if (title !== "" && title !== note_title) {
        updateNote(Number(fsId), {
          noteTitle: title,
        });
      }
    }, 3000);
    return () => clearTimeout(titleHandler);
  }, [fsId, title, note_title, updateNote]);

  useEffect(() => {
    if (color !== noteColor) {
      updateNote(Number(fsId), {
        color: color,
      });
    }
  }, [noteColor, color, fsId, updateNote]);

  const closeNote = () => {
    setEditMode(false);
    setSelectedId(null);
  };

  useEffect(() => {
    if (noteRef.current && editMode) noteRef.current.style.zIndex = "3";
  }, [editMode]);

  const handleClick = () => {
    if (!editMode) {
      setEditMode(true);
      setSelectedId(fsId);
    }
  };

  const isNoteDarkThemed = (color: string): boolean => {
    return /dark/i.test(color);
  };

  const handleAnimationComplete = () => {
    if (noteRef.current && editMode === false) {
      noteRef.current.style.zIndex = "0";
    }
  };

  return (
    <NoteContext.Provider
      value={{
        note_title,
        content,
        editMode,
        fsId,
        color,
        setEditMode,
        setColor,
      }}
    >
      <motion.div layout="position" className={styles.note_placeholder}>
        <AnimatePresence initial={false} onExitComplete={() => null}>
          {editMode && <Backdrop key={fsId} onClick={closeNote} />}
          <motion.div
            ref={noteRef}
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
            onLayoutAnimationComplete={handleAnimationComplete}
            layoutDependency={editMode}
          >
            <motion.div
              style={
                {
                  "--note-bg": color,
                  overflowY: editMode ? "auto" : "clip",
                } as CustomStyle
              }
              layout="position"
              className={styles.note_main}
              onClick={handleClick}
            >
              <div style={{ display: "flex" }}>
                {(title != "" || editMode) && (
                  <input
                    ref={ref}
                    disabled={!editMode}
                    defaultValue={title}
                    placeholder="Enter Title"
                    className={styles.title}
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                )}
                {editMode && (
                  <button
                    onClick={closeNote}
                    className={clsx({
                      [styles.note_button]: true,
                      [styles.dark_button]: !isNoteDarkThemed(color),
                      [styles.light_button]: isNoteDarkThemed(color),
                    })}
                  >
                    <CloseIcon size={25} />
                  </button>
                )}
              </div>
              <Tiptap />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </NoteContext.Provider>
  );
};

export default Note;