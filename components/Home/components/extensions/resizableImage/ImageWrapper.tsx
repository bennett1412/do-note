import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import React, { MouseEventHandler, useRef } from "react";
import styles from "./styles/customimg.module.scss";
import { MdDeleteForever } from "react-icons/md";

const ImageWrapper = ({ node, deleteNode, updateAttributes, editor }: NodeViewProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const positioningRef = useRef<{
    currentHeight: number;
    currentWidth: number;
    isResizing: boolean;
    ratio: number;
    startHeight: number;
    startWidth: number;
    startX: number;
    startY: number;
  }>({
    currentHeight: 0,
    currentWidth: 0,
    isResizing: false,
    ratio: 0,
    startHeight: 0,
    startWidth: 0,
    startX: 0,
    startY: 0,
  });

  const minWidth = 100;
  const maxWidth = editor ? editor.view.dom.getBoundingClientRect().width * 0.7 : 100;
  function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  const resizeImage = (e: MouseEvent) => {
    const positioning = positioningRef.current;
    const image = imgRef.current;
    if (positioning.isResizing && !!imgRef.current) {
      if (image && positioningRef.current.isResizing) {
        const diff = Math.floor(e.clientX - positioningRef.current.startX);

        let width = positioningRef.current.startWidth + 2 * diff;

        width = clamp(width, minWidth, maxWidth);
        const height = width / positioningRef.current.ratio;

        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        updateAttributes({ width: `${width}px`, height: `${height}px` });
      }
    }
  };

  const startTracking: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const image = imgRef.current;
    if (image !== null) {
      console.group("Resize");
      const { width, height } = image.getBoundingClientRect();
      const positioning = positioningRef.current;
      positioning.startWidth = width;
      positioning.startHeight = height;
      positioning.ratio = width / height;
      positioning.currentWidth = width;
      positioning.currentHeight = height;
      positioning.startX = event.clientX;
      positioning.isResizing = true;

      image.style.width = `${width}px`;
      image.style.height = `${height}px`;
      window.addEventListener("mousemove", resizeImage);
      window.addEventListener("mouseup", stopTracking);
    }
  };
  const stopTracking = () => {
    console.groupEnd();
    window.removeEventListener("mousemove", resizeImage);
    window.removeEventListener("mouseup", stopTracking);
  };

  const handleDelete = () => {
    deleteNode();
  };
  return (
    <NodeViewWrapper>
      <div className={styles.node_image}>
        <div className={styles.controller_wrapper}>
          <img
            ref={imgRef}
            src={node.attrs.src}
            alt="node-image"
            style={{ width: node.attrs.width, height: node.attrs.height }}
          />
          <div className={styles.size_control}>
            <div onMouseDown={startTracking} className={styles.cursor}></div>
          </div>
          <div className={styles.img_ops}>
            <button onClick={handleDelete}>
              <MdDeleteForever size={20} />
            </button>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ImageWrapper;
