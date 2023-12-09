import Image, { ImageOptions } from "@tiptap/extension-image";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import ImageWrapper from "./ImageWrapper";
interface CustomImageOptions extends ImageOptions {
  src: string;
  width: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      /**
       * Add a custom image node
       */
      addCustomImage: (
        attributes: CustomImageOptions,
      ) => ReturnType;
    };
  }
}
const CustomImageExtension = Image.extend<CustomImageOptions>({
  addOptions() {
    const baseOptions = Image.options as ImageOptions;
    return {
      ...baseOptions,
      width: 30,
      src: ''
    };
  },
  addAttributes(this) {
    const baseAttributes = Image.options.HTMLAttributes;
    return {
      ...baseAttributes,
      src: {
        default: "30%",
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attrs) => {
          return {
            src: attrs.src,
          };
        },
      },
      width: {
        default: "50%",
        parseHTML: (element) => element.getAttribute("data-width"),
        renderHTML: (attrs) => {
          return {
            "data-width": `${attrs.width}px`,
          };
        },
      },
      height: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("data-height"),
        renderHTML: (attrs) => {
          return {
            "data-height": `${attrs.height}px`,
          }
        }
      }
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
