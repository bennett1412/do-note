import React from "react";
import { ColorRing } from "react-loader-spinner";
import { CloudCheckIcon } from "@/utils/icons";
import useStore from "@/hooks/useStore";
import { AppState } from "@/types/AppState";

const SyncIndicator = () => {
  const ringColor = "#939393c7";
  const syncing = useStore((state) => state.syncing);
  return (
    <>
      {syncing ? (
        <ColorRing
          visible={true}
          height="30"
          width="30"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={[ringColor, ringColor, ringColor, ringColor, ringColor]}
        />
      ) : (
        <CloudCheckIcon size={30} style={{ color: "#545454" }} />
      )}
    </>
  );
};

export default SyncIndicator;
