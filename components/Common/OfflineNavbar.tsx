import React from 'react'
import styles from "@/styles/common/navbar.module.scss";
import "react-float-menu/dist/react-float-menu.css";
import Link from "next/link";

const OfflineNavbar = () => {
    return (
        <>
            <nav className={styles.nav}>
                <Link className={styles.logo} href="/">
                    DoNote
                </Link>
                <div className={styles.more_ops}>
                </div>
            </nav>
        </>
    )
}

export default OfflineNavbar;