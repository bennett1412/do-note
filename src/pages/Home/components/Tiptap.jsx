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

const Tiptap = ({ editMode, content = [], fsId }) => {
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
    content: content,
    onCreate: () => {
      console.log("editor being created");
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
      if (editor && !editor.isDestroyed) {
        console.log("syncing with db");
        const syncNote = async () => {
          await updateNote(fsId, {
            noteContent: editor?.getJSON(),
          });
        };
        syncNote();
        console.log(editor.getJSON());
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
