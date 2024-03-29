import React, { useState } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import styles from "@/styles/common/toggle.module.scss";

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
      Offline
    </>
  );
};

export default OfflineToggle;
