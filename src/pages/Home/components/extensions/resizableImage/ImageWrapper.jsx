import { NodeViewWrapper } from "@tiptap/react";
import React, { useRef, useState } from "react";
import useMousePosition from "../../../../../hooks/useMousePosition";
import "./customimg.scss";
import { MdDeleteForever } from "react-icons/md";
const ImageWrapper = ({ editor, node, deleteNode, updateAttributes }) => {
  const imgRef = useRef();
  const lastClientX = useRef(null);

  const updateMousePos = (e) => {
    let direction;
    if (e.pageX <= lastClientX.current) {
      direction = "left";
    } else if (e.pageX > lastClientX.current) {
      direction = "right";
    }
    let currWidth = imgRef.current.style.width;
    currWidth = Number(currWidth.substring(0, currWidth.length - 1));
    // console.log(currWidth);
    // console.log(currWidth, Math.round(0.1 * currWidth));
    let diff = 0.008 * currWidth;
    let subtract = diff;
    console.log(direction, subtract);
    subtract = direction == "left" ? subtract * -1 : subtract;
    lastClientX.current = e.pageX;
    updateAttributes({ width: currWidth + subtract });
  };

  const startTracking = (e) => {
    lastClientX.current = 0;
    window.addEventListener("mousemove", updateMousePos);
    window.addEventListener("mouseup", stopTracking);
  };
  const stopTracking = (e) => {
    window.removeEventListener("mousemove", updateMousePos);
    window.removeEventListener("mouseup", stopTracking);
  };

  const handleDelete = () => {
    deleteNode();
  };
  return (
    <NodeViewWrapper
      ref={imgRef}
      style={{ width: `${node.attrs.width}%`, minWidth: "30%" }}
    >
      <div className={"node-image-container"}>
        <div className="content">
          <div style={{ position: "relative" }}>
            <img src={node.attrs.src} alt="node-image" />
            <div className={`size-control`}>
              <div onMouseDown={startTracking} className="cursor"></div>
            </div>
          </div>

          <div className="img-ops">
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
