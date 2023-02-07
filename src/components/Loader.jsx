import { MutatingDots, Oval, Rings } from "react-loader-spinner";
import React from "react";

const Loader = ({ magnify }) => {
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

export default Loader;
