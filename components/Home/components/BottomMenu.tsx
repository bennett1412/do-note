import React, { EventHandler, FC, SyntheticEvent, memo, useContext, useState } from "react";
import styles from "../styles/note.module.scss";
import button from "@/styles/common/button.module.scss";
import { FiEdit3 } from "react-icons/fi";
// import { TbPinned } from "react-icons/tb";
import { BiCheck, BiCopy } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import ColorMenu from "@/components/Common/ColorMenu";
import { clsx } from "clsx";
import { NoteContextType, NotesContextValue } from "@/types/Note";
import Button from "@/components/Common/Button";
import { NoteContext } from "./Note";
import { NotesContext } from "./NotesList";
import { Editor } from "@tiptap/react";

type BottomMenuProps = {
  // setEditMode: (flag: boolean) => void;
  // active: boolean;
  // fsId: string;
  // setColor: (colorIndex: number) => void;
  // theme: string;
  // deleteNote: DeleteMutation;
  // isDeleting?: boolean;
  editor: Editor | null;
};

const BottomMenu = memo(function BottomMenu({ editor }: BottomMenuProps): JSX.Element {
  const { deleteNote } = useContext(NotesContext) as NotesContextValue;
  const { editMode, fsId, setEditMode, setColor } = useContext(NoteContext) as NoteContextType;
  const [copying, setCopying] = useState<boolean>(false);
  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this note?");
    if (confirm) {
      deleteNote(fsId);
    }
  };

  const handleCopy: EventHandler<SyntheticEvent> = (e) => {
    setCopying(true);
    editor?.chain().copyToClipboard();
    setTimeout(() => {
      setCopying(false);
    }, 500);
    e.stopPropagation();
  };

  return (
    // todo: update theme change to css var change

    <div
      style={editMode ? { opacity: 1 } : {}}
      className={clsx(styles.toolbar, styles.dark_toolbar && true)}
    >
      <ColorMenu setColor={setColor} />
      <Button onClick={() => setEditMode(true)} className={button.toolbar_button}>
        <FiEdit3 />
      </Button>
      <Button
        onClick={handleCopy}
        style={copying ? { background: "green" } : {}}
        className={button.toolbar_button}
      >
        {copying ? <BiCheck style={{ backgroundColor: "green" }} /> : <BiCopy />}
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
});

export default BottomMenu;
