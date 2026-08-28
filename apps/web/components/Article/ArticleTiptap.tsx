import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import FloatingMenu from "@/components/Home/components/minorComponents/FloatingMenu";
import StarterKit from "@tiptap/starter-kit";
import styles from "@/components/Home/styles/note.module.scss";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Placeholder } from "@tiptap/extension-placeholder";
import FloatingMenuExtension from "@tiptap/extension-floating-menu";
import CustomImageExtension from "@/components/Home/components/extensions/resizableImage/ImageExtension";
import CopyToClipboardExtension from "@/components/Home/components/extensions/CopyToClipboard/CopyToClipboardExtension";
import type { CustomStyle } from "@/types/Styles";
import { useNoteContext } from "@/components/Home/components/NoteContext";
import ArticleSidebarMenu from "./ArticleSidebarMenu";
type Props = {
  style?: CustomStyle;
};

const ArticleTiptap: React.FC<Props> = ({ style }) => {
  const { content, setContent } = useNoteContext();
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
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: "Start writing your article...",
        showOnlyWhenEditable: false,
      }),
      FloatingMenuExtension,
      CustomImageExtension,
      CopyToClipboardExtension,
    ],
    editable: true,
    content: content ? JSON.parse(content) : undefined,
    onUpdate: ({ editor }) => {
      setContent(JSON.stringify(editor.getJSON()));
    },
  });

  return (
    <>
      <FloatingMenu editor={editor} />
      <EditorContent style={style} className={styles.editor} editor={editor} />
      <ArticleSidebarMenu editor={editor} />
    </>
  );
};

export default ArticleTiptap;