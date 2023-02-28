import React, { useState } from "react";

const useDebounceCallback = ({ value: d_value, callback, timeout }) => {
  const [value, setValue] = useState(d_value);
  useEffect(() => {
    const changeHandler = setTimeout(() => {
      callback();
    }, timeout);

    return () => {
      second;
    };
  }, [third]);
};
