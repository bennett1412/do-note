import React from "react";
import { ColorRing } from "react-loader-spinner";
import { BsCloudCheck } from "react-icons/bs";
import useStore from "./../hooks/useStore";

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
        <BsCloudCheck color="#545454" size={30} />
      )}
    </>
  );
};

export default SyncIndicator;
