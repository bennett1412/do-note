import { NodeViewWrapper } from "@tiptap/react";
import React, { useRef, useState } from "react";
import useMousePosition from "../../../../../hooks/useMousePosition";
import "./customimg.scss";
const ImageWrapper = ({ editor, node }) => {
  const imgRef = useRef();
  const buttonStyle = {
    position: "absolute",
    right: "10%",
    top: "50%",
  };
  // const { x, y } = useMousePosition();
  const [mousePos, setMousePos] = useState(null);
  const updateMousePos = (e) => {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top;

    setMousePos({
      x,
      y,
    });
    console.log(mousePos, rect.left, mousePos - rect.left);
  };

  const startTracking = (e) => {
    setMousePos(e.clientX);
    window.addEventListener("mousemove", updateMousePos);
    window.addEventListener("mouseup", stopTracking);
    console.log("traking now");
  };
  const stopTracking = () => {
    window.removeEventListener("mousemove", updateMousePos);
    window.removeEventListener("mouseup", stopTracking);
    console.log("tracking stopped");
  };
  const resizeImage = (e) => {
    console.log(mousePos);
  };
  return (
    <NodeViewWrapper style={{ position: "relative" }}>
      <img ref={imgRef} src={node.attrs.src} alt="node-image" />
      <button
        onMouseDown={startTracking}
        // onMouseUp={stopTracking}
        className={"size-control"}
      ></button>
    </NodeViewWrapper>
  );
};

export default ImageWrapper;
