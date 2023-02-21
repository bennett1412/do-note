import Image from "@tiptap/extension-image";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import ImageWrapper from "./ImageWrapper";

const CustomImageExtension = Image.extend({
  defaultOptions: {
    ...Image.options,
    width: 30,
  },
  addAttributes() {
    return {
      ...Image.config.addAttributes(),
      src: {
        default: "",
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attrs) => {
          return {
            src: attrs.src,
          };
        },
      },
      width: {
        default: 30,
        parseHTML: (element) => element.getAttribute("data-width"),
        renderHTML: (attrs) => {
          // … and return an object with HTML attributes.
          return {
            "data-width": `${attrs.width}`,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "img",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageWrapper);
  },
});

export default CustomImageExtension;
