
import React, { useState, useEffect, useContext } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import FloatingMenu from "@/components/Home/components/minorComponents/FloatingMenu";
import StarterKit from "@tiptap/starter-kit";
import styles from "@/components/Home/styles/note.module.scss";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Placeholder } from "@tiptap/extension-placeholder";
import FloatingMenuExtension from "@tiptap/extension-floating-menu";
import useStore from "@/hooks/useStore";
import CustomImageExtension from "@/components/Home/components/extensions/resizableImage/ImageExtension";
import CopyToClipboardExtension from "@/components/Home/components/extensions/CopyToClipboard/CopyToClipboardExtension";
import { NoteContextType, NotesContextValue } from "@/types/Note";
import { CustomStyle } from "@/types/Styles";
import { NotesContext } from "@/components/Home/components/NotesList";
import { NoteContext } from "@/components/Home/components/Note";
import ArticleSidebarMenu from "./ArticleSidebarMenu";

type Props = {
  style?: CustomStyle;
};

const ArticleTiptap: React.FC<Props> = ({ style }) => {
  const { updateNote } = useContext(NotesContext) as NotesContextValue;
  const { editMode, content, fsId } = useContext(NoteContext) as NoteContextType;
  const updateSync = useStore((state) => state.updateSync);
  const [noteContent, setNoteContent] = useState(content);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: styles.ProseMirror,
      },
    },
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: "Start writing your article...",
        showOnlyWhenEditable: false,
      }),
      FloatingMenuExtension,
      CustomImageExtension,
      CopyToClipboardExtension,
    ],
    editable: editMode,
    content: JSON.parse(noteContent),
    onUpdate: ({ editor }) => {
      setNoteContent(JSON.stringify(editor.getJSON()));
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(editMode);
    }
  }, [editMode, editor]);

  // debounce logic to save notes
  useEffect(() => {
    if (noteContent !== content) updateSync(true);
    const handler = setTimeout(() => {
      if (editor && !editor.isDestroyed && noteContent !== content) {
        const syncNote = async () => {
          await updateNote(fsId, {
            note_content: JSON.stringify(editor.getJSON()),
          });
        };
        syncNote();
        updateSync(false);
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [noteContent, content, updateSync, editor, fsId, updateNote]);

  return (
    <>
      <FloatingMenu editor={editor} />
      <EditorContent 
        style={{ ...style, minHeight: '80vh', paddingBottom: '20vh' }} 
        className={styles.editor} 
        editor={editor} 
      />
      <ArticleSidebarMenu editor={editor} />
    </>
  );
};

export default ArticleTiptap;
