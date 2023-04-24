import { useEffect, MutableRefObject } from "react";

const useOnClickOutside = (
  ref: MutableRefObject<HTMLDivElement | null>,
  handler: Function
) => {
  useEffect(() => {
    if(ref.current === null){
      return;
    }
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;
