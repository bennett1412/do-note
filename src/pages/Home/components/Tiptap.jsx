import { React, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import FloatingMenu from "./minor/FloatingMenu";
import StarterKit from "@tiptap/starter-kit";
import "../../../styles/home/tiptap.scss";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Placeholder } from "@tiptap/extension-placeholder";
import { updateNote } from "./../../../utils/firebase/firestore";
import useStore from "../../../hooks/useStore";
import Image from "@tiptap/extension-image";
import CustomImageExtension from "./extensions/resizableImage/ImageExtension";
import ClipboardExtension from "./extensions/Clipboard/ClipboardExtension";

const Tiptap = ({ editMode, content, fsId }) => {
  const updateSync = useStore((state) => state.updateSync);
  const [noteContent, setNoteContent] = useState(content);
  const editor = useEditor({
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
    onCreate: () => {
      console.log("editor being created");
    },
    onUpdate: ({ editor }) => {
      setNoteContent(JSON.stringify(editor.getJSON()));
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      if (editMode) {
        editor.setEditable(true);
        editor.commands.focus("end");
      } else {
        editor.setEditable(false);
      }
    }
  }, [editMode, editor]);

  useEffect(() => {
    if (noteContent !== content) updateSync(true);
    const handler = setTimeout(() => {
      console.time("updating db");
      if (editor && !editor.isDestroyed && noteContent !== content) {
        console.log("syncing with db");
        const syncNote = async () => {
          await updateNote(fsId, {
            noteContent: JSON.stringify(editor.getJSON()),
          });
        };
        syncNote();
        console.timeEnd("updating db");
        updateSync(false);
      }
    }, 3000);
    return () => {
      console.log("Nope got updated");
      clearTimeout(handler);
    };
  }, [noteContent, content, updateSync, editor, fsId]);

  return (
    <>
      <FloatingMenu editor={editor} />
      <EditorContent className="editor" editor={editor} />
    </>
  );
};

export default Tiptap;
