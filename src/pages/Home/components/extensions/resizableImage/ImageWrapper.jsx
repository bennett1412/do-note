import { NodeViewWrapper } from "@tiptap/react";
import React, { useRef, useState } from "react";
import useMousePosition from "../../../../../hooks/useMousePosition";
import "./customimg.scss";
const ImageWrapper = ({ editor, node }) => {
  const imgRef = useRef();
  const lastClientX = useRef(null);

  // const { x, y } = useMousePosition();
  const [mousePos, setMousePos] = useState(null);
  const [show, setShow] = useState(false);
  const updateMousePos = (e) => {
    var rect = e.target.getBoundingClientRect();
    console.log(
      lastClientX.current,
      e.clientX,
      lastClientX.current - e.clientX
    );
    let percent = lastClientX.current - e.clientX;
    percent = percent < 0 ? percent * -1 : percent;
    if (percent > 80) {
      percent = 80;
    }
    if (percent < 30) {
      percent = 30;
    }
    imgRef.current.clientWidth;
    imgRef.current.style.width = `${percent}%`;
  };

  const startTracking = (e) => {
    lastClientX.current = e.clientX;
    setShow(true);
    window.addEventListener("mousemove", updateMousePos);
    window.addEventListener("mouseup", stopTracking);
    console.log("traking now");
  };
  const stopTracking = (e) => {
    window.removeEventListener("mousemove", updateMousePos);
    window.removeEventListener("mouseup", stopTracking);
    console.log("tracking stopped");
    setShow(false);
  };
  const resizeImage = (e) => {
    console.log(mousePos);
  };
  return (
    <NodeViewWrapper ref={imgRef} style={{ maxWidth: "400px" }}>
      <div className={"node-image-container"}>
        <div className="content">
          <div>
            <img src={node.attrs.src} alt="node-image" />
          </div>
          <div className={`size-control`}>
            <div onMouseDown={startTracking} className="cursor"></div>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ImageWrapper;
