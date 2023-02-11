import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import FloatingMenu from "./minor/FloatingMenu";
import StarterKit from "@tiptap/starter-kit";
import "../../../styles/home/tiptap.scss";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Placeholder } from "@tiptap/extension-placeholder";
import FloatingMenuExt from "@tiptap/extension-floating-menu";
// import { useDebounce } from "./../../../hooks/useDebounceHook";
import { useDebounce } from "use-debounce";
import { updateNote } from "./../../../utils/firebase/firestore";
import useStore from "../../../hooks/useStore";

const Tiptap = ({ editMode, content, fsId }) => {
  const updateSync = useStore((state) => state.updateSync);
  const [noteContent, setNoteContent] = useState(content);
  const [debouncedValue, setDebouncedValue] = useState(content);
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
    ],
    editable: false,
    content: noteContent,
    onCreate: () => {
      console.log("editor being created");
    },
    onUpdate: ({ editor }) => {
      setNoteContent(editor.getJSON());
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      if (editMode) {
        editor.setEditable(true);
        editor.chain().focus();
      } else {
        editor.setEditable(false);
      }
    }
  }, [editMode, editor]);

  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("editor is focused:", editor.isFocused);
      updateSync(true);
      console.time("updating db");
      if (editor && !editor.isDestroyed) {
        console.log(editor.getJSON());
        console.log(content);
        console.log("syncing with db");
        const syncNote = async () => {
          await updateNote(fsId, {
            noteContent: editor?.getJSON(),
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
  }, [editor?.getJSON()]);

  return (
    <>
      <FloatingMenu editor={editor} />
      <EditorContent className="editor" editor={editor} />
    </>
  );
};

export default Tiptap;
