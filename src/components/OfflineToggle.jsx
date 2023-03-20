import React, { useState } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";

const OfflineToggle = () => {
  const [offline, setOffline] = useState(false);
  return (
    <>
      <Toggle
        defaultChecked={offline}
        icons={false}
        onChange={() => setOffline(!offline)}
        disabled
      />
      <span>Offline</span>
    </>
  );
};

export default OfflineToggle;
