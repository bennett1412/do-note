import { useEffect, useState } from "react";

const useMousePosition = () => {
  const [mousePos, setMousePos] = useState({ x: null, y: null });
  useEffect(() => {
    const updateMousePos = (e) => {
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top;
      setMousePos({
        x,
        y,
      });
    };

    window.addEventListener("mousemove", updateMousePos);

    return () => {
      window.removeEventListener("mousemove", updateMousePos);
    };
  }, []);
  return mousePos;
};

export default useMousePosition;
