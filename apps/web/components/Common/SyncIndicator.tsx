import React from "react";
import { Loader } from "@mantine/core";
import { CloudCheckIcon } from "@/utils/icons";
import useStore from "@/hooks/useStore";
import { AppState } from "@/types/AppState";

const SyncIndicator = () => {
  const syncing = useStore((state) => state.syncing);
  return (
    <>
      {syncing ? (
        <Loader size={30} color="#939393c7" />
      ) : (
        <CloudCheckIcon size={30} style={{ color: "#545454" }} />
      )}
    </>
  );
};

export default SyncIndicator;
