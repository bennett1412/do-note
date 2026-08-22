import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import FloatingMenu from "./minorComponents/FloatingMenu";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Placeholder } from "@tiptap/extension-placeholder";
import FloatingMenuExtension from "@tiptap/extension-floating-menu";
import CustomImageExtension from "./extensions/resizableImage/ImageExtension";
import CopyToClipboardExtension from "./extensions/CopyToClipboard/CopyToClipboardExtension";
import type { CustomStyle } from "@/types/Styles";
import BottomMenu from "./BottomMenu";
import { useNoteContext } from "./NoteContext";

type TiptapProps = {
  style?: CustomStyle;
  editable?: boolean;
};

const Tiptap: React.FC<TiptapProps> = ({ style, editable }) => {
  const { content, setContent } = useNoteContext();

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "ProseMirror",
      },
    },
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ showOnlyWhenEditable: false }),
      FloatingMenuExtension,
      CustomImageExtension,
      CopyToClipboardExtension,
    ],
    editable: false,
    content: content ? JSON.parse(content) : undefined,
    onUpdate: ({ editor }) => {
      setContent(JSON.stringify(editor.getJSON()));
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(Boolean(editable));
    }
  }, [editor, editable]);

  return (
    <>
      <FloatingMenu editor={editor} />
      <EditorContent style={style} className="tiptap-editor" editor={editor} />
      <BottomMenu editor={editor} />
    </>
  );
};

export default Tiptap;