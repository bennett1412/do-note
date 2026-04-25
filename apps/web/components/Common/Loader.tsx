import { MutatingDots, Oval } from "react-loader-spinner";
import React from "react";
import styles from "./styles/loader.module.scss";
import useDarkModeDetection from "@/hooks/useDarkMode";
export const OvalLoader = ({ magnify }: { magnify: string }) => {
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: `translate(-50%,-50%) scale(${magnify})`,
  };
  return (
    <Oval
      height={80}
      width={80}
      color="black"
      wrapperStyle={style}
      wrapperClass=""
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="gray"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  );
};

export const DotsLoader = () => {

  return (
    <MutatingDots
      height="100"
      width="100"
      color={ "var(--color-primary-100)"}
      secondaryColor={ "var(--color-primary-100)"}
      radius="12.5"
      ariaLabel="mutating-dots-loading"
      wrapperStyle={{
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%) scale(1.5)",
        msTransform: "translate(-50%,-50%) scale(1.5)",
      }}
      wrapperClass={styles.dots_loader}
      visible={true}
    />
  );
};
