import React from "react";
import { FloatingMenu } from "@tiptap/react";
import clsx from "clsx";
import "../../../../styles/home/floatmenu.scss";
import { MdFormatListBulleted } from "react-icons/md";
import { RxHeading } from "react-icons/rx";
import { BsUiChecks } from "react-icons/bs";
const CustomFloatingMenu = ({ editor }) => {
  if (!editor) {
    return null;
  }
  return (
    <FloatingMenu
      className={"float-menu"}
      editor={editor}
      tippyOptions={{ duration: 100 }}
    >
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
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
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={clsx({
          "float-item": true,
          "is-active": editor.isActive("taskList"),
        })}
      >
        <BsUiChecks />
      </button>
    </FloatingMenu>
  );
};

export default CustomFloatingMenu;
