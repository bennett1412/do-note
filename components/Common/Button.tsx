import React, { ButtonHTMLAttributes, CSSProperties, EventHandler, FC, ReactNode, SyntheticEvent } from "react";
import styles from "@/styles/common/button.module.scss";
import clsx from "clsx";
export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  specialProp?: string;
}

const Button: FC<ButtonProps> = ({ children, style, className, onClick, disabled }) => {
  return (
    <button disabled={disabled} style={style} className={clsx(styles.button, className ?? "")} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
