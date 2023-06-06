import { Extension } from "@tiptap/react";

const CopyToClipboardExtension = Extension.create({
  name: "copy-clipboard",
  addCommands() {
    return {
      copyToClipboard: ({ editor }) => {
        console.log("copy being called");
      },
    };
  },
});

export default CopyToClipboardExtension;
