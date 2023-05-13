import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import React, { useRef } from "react";
import styles from "./styles/customimg.module.scss";
import { MdDeleteForever } from "react-icons/md";

const ImageWrapper = ({ node, deleteNode, updateAttributes }: NodeViewProps) => {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const lastClientX = useRef<number>(0);

  const resizeImage = (e: MouseEvent) => {
    if (lastClientX.current != null && !!imgRef.current) {
      let direction;
      // find the 
      if (e.pageX <= lastClientX.current) {
        direction = "left";
      } else if (e.pageX > lastClientX.current) {
        direction = "right";
      }
      console.log(direction)
      let currWidth = parseInt(imgRef.current.style.width);
      // const currHeight = imgRef.current.style.height;
      console.log(currWidth)
      currWidth = Math.round(currWidth);
      const diff = 0.008 * currWidth;
      let subtract = diff;
      subtract = direction == "left" ? subtract * -1 : subtract;
      lastClientX.current = e.pageX;
      updateAttributes({ width: currWidth + subtract });
    }
  };

  const startTracking = () => {
    if (lastClientX.current != null) lastClientX.current = 0;
    window.addEventListener("mousemove", resizeImage);
    window.addEventListener("mouseup", stopTracking);
  };
  const stopTracking = () => {
    window.removeEventListener("mousemove", resizeImage);
    window.removeEventListener("mouseup", stopTracking);
  };

  const handleDelete = () => {
    deleteNode();
  };
  return (
    <NodeViewWrapper>
      <div className={styles.node_image}>
        <div
          ref={imgRef}
          className={styles.node_image_container}
          style={{ width: `${node.attrs.width}%`, minWidth: "30%" }}
        >
          <div className={styles.content}>
            <div style={{ position: "relative" }}>
              {/* change to nextjs image */}
              <img src={node.attrs.src} alt="node-image" />
              <div className={styles.size_control}>
                <div onMouseDown={startTracking} className={styles.cursor}></div>
              </div>
            </div>

            <div className={styles.img_ops}>
              <button onClick={handleDelete}>
                <MdDeleteForever size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ImageWrapper;
