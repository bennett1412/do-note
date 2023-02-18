import React from "react";
import "../styles/common/navbar.scss";
import useStore from "./../hooks/useStore";
import { ColorRing } from "react-loader-spinner";
import { BsCloudCheck } from "react-icons/bs";
import "react-float-menu/dist/react-float-menu.css";

const Navbar = () => {
  const syncing = useStore((state) => state.syncing);
  const ringColor = "#939393c7";
  return (
    <nav>
      <a href="/">DoNote</a>
      <div className="more-ops">
        {/* {user.data && (
          <Menu label={<img src={user.data.photoURL} alt="profile-pic" />}>
            <MenuItem
              label={
                <span>
                  <FiLogOut size={25} /> Logout
                </span>
              }
            />
          </Menu>
        )} */}
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
      </div>
    </nav>
  );
};

export default Navbar;
