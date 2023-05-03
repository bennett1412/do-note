import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import FloatingMenu from "./minorComponents/FloatingMenu";
import StarterKit from "@tiptap/starter-kit";
import styles from "@/styles/home/note.module.scss";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Placeholder } from "@tiptap/extension-placeholder";
// import { updateNote } from "./../../../utils/firebase/firestore";
import useStore from "../../../hooks/useStore";
import CustomImageExtension from "./extensions/resizableImage/ImageExtension";

type TiptapProps = {
  editMode: boolean;
  content: string;
  fsId: string;
  updateNote: Function;
};

const Tiptap: React.FC<TiptapProps> = ({
  editMode,
  content,
  fsId,
  updateNote,
}) => {
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
      // ClipboardExtension,
    ],
    editable: false,
    content: JSON.parse(noteContent),
    onCreate: () => {},
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
      <EditorContent className={styles.editor} editor={editor} />
    </>
  );
};

export default Tiptap;
