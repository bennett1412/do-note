import { CommandProps, Editor, Extension, RawCommands } from "@tiptap/react";
import copy from 'copy-to-clipboard';
declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    copyToClipboardExtension: {
      /**
       * Call copyToClipboard to copy the editor content to clipboard
       */
      copyToClipboard: () => ReturnType,
    }
  }
}

const CopyToClipboardExtension = Extension.create({
  name: "copyToClipboardExtension",
  addCommands() {
    return {
      copyToClipboard: () => ({ editor }: CommandProps) => {
        // todo: figure out a way to convert editor json/html to string text
        copy(editor.getText());
        return true;
      },
    };
  },
});

export default CopyToClipboardExtension;
