import React, { useState, useEffect, CSSProperties, useContext } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import FloatingMenu from "./minorComponents/FloatingMenu";
import StarterKit from "@tiptap/starter-kit";
import styles from "@/styles/home/note.module.scss";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Placeholder } from "@tiptap/extension-placeholder";
import useStore from "../../../hooks/useStore";
import CustomImageExtension from "./extensions/resizableImage/ImageExtension";
import CopyToClipboardExtension from "./extensions/CopyToClipboard/CopyToClipboardExtension";
import { UpdateNoteFn } from "@/types/Note";
import { CustomStyle } from "@/types/Styles";
import BottomMenu from "./BottomMenu";
import { NotesContext, NotesContextValue } from "./NotesList";

type TiptapProps = {
  editMode: boolean;
  content: string;
  fsId: string;
  // updateNote: UpdateNoteFn;
  style?: CustomStyle;
};

const Tiptap: React.FC<TiptapProps> = ({ editMode, content, fsId, style }) => {
  const { updateNote, deleteNote } = useContext(NotesContext) as NotesContextValue;
  const updateSync = useStore((state) => state.updateSync);
  const [noteContent, setNoteContent] = useState(content);
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: styles.ProseMirror,
      },
    },
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        showOnlyWhenEditable: false,
      }),
      CustomImageExtension,
      CopyToClipboardExtension,
    ],
    editable: false,
    content: JSON.parse(noteContent),
    onUpdate: ({ editor }) => {
      setNoteContent(JSON.stringify(editor.getJSON()));
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      if (editMode) {
        editor.setEditable(true);
        // editor.commands.focus();
      } else {
        editor.setEditable(false);
      }
    }
  }, [editMode, editor]);

  // debounce logic to save notes
  useEffect(() => {
    if (noteContent !== content) updateSync(true);
    const handler = setTimeout(() => {
      if (editor && !editor.isDestroyed && noteContent !== content) {
        const syncNote = async () => {
          await updateNote(fsId, {
            noteContent: JSON.stringify(editor.getJSON()),
          });
        };
        syncNote();
        updateSync(false);
      }
    }, 3000);
    return () => {
      clearTimeout(handler);
    };
  }, [noteContent, content, updateSync, editor, fsId, updateNote]);

  return (
    <>
      <FloatingMenu editor={editor} />
      <EditorContent style={style} className={styles.editor} editor={editor} />
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
    </>
  );
};

export default Tiptap;
