import Image from "@tiptap/extension-image";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import ImageWrapper from "./ImageWrapper";

const CustomImageExtension = Image.extend({
  parseHTML() {
    return [
      {
        tag: "custom-img",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["custom-img", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageWrapper);
  },
});

export default CustomImageExtension;
