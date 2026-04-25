import { motion } from "framer-motion";
import { ReactNode } from "react";
import styles from '../styles/backdrop.module.scss';
type BackdropProps = {
  // children: ReactNode,
  onClick: () => void
}
const Backdrop = ({ onClick }:BackdropProps) => {
 
  return (
    <div
      onClick={onClick}
      className={styles.backdrop}
      />
  );
};

export default Backdrop;