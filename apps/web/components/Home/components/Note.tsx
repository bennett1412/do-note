import type React from "react";
import { useRef, useEffect } from "react";
import Tiptap from "./Tiptap";
import styles from "../styles/note.module.scss";
import clsx from "clsx";
import { CloseIcon } from "@/utils/icons";
import { AnimatePresence, motion } from "framer-motion";
import type { CustomStyle } from "@/types/Styles";
import Backdrop from "./Backdrop";
import { NoteProvider, useNoteContext } from "./NoteContext";

type NoteProps = {
  title: string;
  content: string;
  fsId: string;
  color: string;
  setSelectedId: (id: string | null) => void;
};

const NoteInner: React.FC<{
  fsId: string;
  color: string;
  setSelectedId: (id: string | null) => void;
}> = ({ fsId, color: noteColor, setSelectedId }) => {
  const { noteTitle: note_title, color, editMode, setEditMode, setTitle } = useNoteContext();
  const ref = useRef<HTMLInputElement | null>(null);
  const noteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (noteRef.current && editMode) noteRef.current.style.zIndex = "3";
  }, [editMode]);

  const closeNote = () => {
    setEditMode(false);
    setSelectedId(null);
  };

  const handleClick = () => {
    if (!editMode) {
      setEditMode(true);
      setSelectedId(fsId);
    }
  };

  const isNoteDarkThemed = (c: string): boolean => /dark/i.test(c);

  const handleAnimationComplete = () => {
    if (noteRef.current && editMode === false) {
      noteRef.current.style.zIndex = "0";
    }
  };

  return (
    <motion.div layout="position" className={styles.note_placeholder}>
      <AnimatePresence initial={false} onExitComplete={() => null}>
        {editMode && <Backdrop key={fsId} onClick={closeNote} />}
        <motion.div
          ref={noteRef}
          style={{ backgroundColor: color }}
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
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {(note_title != "" || editMode) && (
                <input
                  ref={ref}
                  disabled={!editMode}
                  value={note_title}
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
            <Tiptap editable={editMode} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const Note: React.FC<NoteProps> = ({ title, content, fsId, color, setSelectedId }) => {
  return (
    <NoteProvider note={{ id: Number(fsId), noteTitle: title, noteContent: content, color }}>
      <NoteInner fsId={fsId} color={color} setSelectedId={setSelectedId} />
    </NoteProvider>
  );
};

export default Note;