import { Extension } from "@tiptap/react";

const ClipboardExtension = Extension.create({
  name: "Clipboard",
  addKeyboardShortcuts() {
    return {
      "Mod-v": async () => {
        console.log("extension being called");
        const text = await navigator.clipboard.readText();
        const stuff = await navigator.clipboard.read();
        console.log(stuff);

        var item = stuff[0];

        // if (item.types === "image/png") {
        // var blob = new File(item, "node-image");
        var reader = new FileReader();
        reader.onload = function (event) {
          console.log(event.target.result);
        }; // data url!
        console.log(reader.readAsDataURL(item));
        // }
        this.editor.commands.insertContent(text);
      },
    };
  },
});

export default ClipboardExtension;
