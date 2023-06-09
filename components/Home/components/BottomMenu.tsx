import React, { FC, useContext } from "react";
import styles from "@/styles/home/note.module.scss";
import button from "@/styles/common/button.module.scss";
import { FiEdit3 } from "react-icons/fi";
import { TbPinned } from "react-icons/tb";
import { BiCopy } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import ColorMenu from "@/components/Common/Menu";
import { clsx } from "clsx";
import { DeleteMutation, EditorContextType, NoteContextType, NotesContextValue } from "@/types/Note";
import Button from "@/components/Common/Button";
import { NoteContext } from "./Note";
import { NotesContext } from "./NotesList";
import { EditorContext } from "./Tiptap";

// type BottomMenuProps = {
//   setEditMode: (flag: boolean) => void;
//   active: boolean;
//   fsId: string;
//   setColor: (colorIndex: number) => void;
//   theme: string;
//   deleteNote: DeleteMutation;
//   isDeleting?: boolean;
// };

const BottomMenu: FC = () => {
  const { deleteNote } = useContext(NotesContext) as NotesContextValue;
  const { editMode, fsId, setEditMode, setColorIndex } = useContext(NoteContext) as NoteContextType;
  const { editor } = useContext(EditorContext) as EditorContextType;
  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this note?");
    if (confirm) {
      deleteNote(fsId);
    }
  };
  return (
    // todo: update theme change to css var change
    <div style={editMode ? { opacity: 1 } : {}} className={clsx(styles.toolbar, styles.dark_toolbar && true)}>
      <ColorMenu setColor={setColorIndex} />
      <Button onClick={() => setEditMode(true)} className={button.toolbar_button}>
        <FiEdit3 />
      </Button>
      <Button onClick={() => console.log("clickedcopy")} className={button.toolbar_button}>
        <BiCopy />
      </Button>
      {editMode && (
        <>
          <Button onClick={handleDelete} className={button.toolbar_button}>
            <MdOutlineDelete />
          </Button>
        </>
      )}
    </div>
  );
};

export default BottomMenu;
