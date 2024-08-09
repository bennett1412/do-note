import React, { useCallback } from "react";
import { Editor, FloatingMenu } from "@tiptap/react";
import clsx from "clsx";
import styles from "../../styles/floatmenu.module.scss";
import { MdFormatListBulleted } from "react-icons/md";
import { RxHeading } from "react-icons/rx";
import { BsUiChecks, BsCardImage } from "react-icons/bs";
import Button from "@/components/Common/Button";

type Props = { editor: Editor | null };

const CustomFloatingMenu: React.FC<Props> = ({ editor }) => {
  const addImage = useCallback(() => {
    const url = window.prompt("URL");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  return (
    <>
      {editor ? (
        <FloatingMenu
          className={styles.float_menu}
          editor={editor}
          tippyOptions={{ duration: 100 }}
        >
          <Button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={clsx({
              [styles.float_item]: true,
              [styles.is_active]: editor.isActive("heading", { level: 1 }),
            })}
          >
            <RxHeading />
          </Button>

          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={clsx({
              [styles.float_item]: true,
              [styles.is_active]: editor.isActive("bulletList"),
            })}
          >
            <MdFormatListBulleted />
          </Button>
          <Button
            onClick={addImage}
            className={clsx({
              [styles.float_item]: true,
              [styles.is_active]: editor.isActive("image"),
            })}
          >
            <BsCardImage />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={clsx({
              [styles.float_item]: true,
              [styles.is_active]: editor.isActive("taskList"),
            })}
          >
            <BsUiChecks />
          </Button>
        </FloatingMenu>
      ) : null}
    </>
  );
};

export default CustomFloatingMenu;
