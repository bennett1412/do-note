import React, { useCallback } from "react";
import { FloatingMenu } from "@tiptap/react";
import clsx from "clsx";
import "../../../../styles/home/floatmenu.scss";
import { MdFormatListBulleted } from "react-icons/md";
import { RxHeading } from "react-icons/rx";
import { BsUiChecks, BsCardImage } from "react-icons/bs";

const CustomFloatingMenu = ({ editor }) => {
  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  return (
    <>
      {editor ? (
        <FloatingMenu
          className={"float-menu"}
          editor={editor}
          tippyOptions={{ duration: 100 }}
        >
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={clsx({
              "float-item": true,
              "is-active": editor.isActive("heading", { level: 1 }),
            })}
          >
            <RxHeading />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={clsx({
              "float-item": true,
              "is-active": editor.isActive("bulletList"),
            })}
          >
            <MdFormatListBulleted />
          </button>
          <button
            onClick={addImage}
            className={clsx({
              "float-item": true,
              "is-active": editor.isActive("image"),
            })}
          >
            <BsCardImage />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={clsx({
              "float-item": true,
              "is-active": editor.isActive("taskList"),
            })}
          >
            <BsUiChecks />
          </button>
        </FloatingMenu>
      ) : null}
    </>
  );
};

export default CustomFloatingMenu;
