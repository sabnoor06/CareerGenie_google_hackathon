import React from "react";
import UseLogout from "../Logout/logout";
import { FaRegBell, FaArrowRightFromBracket } from "react-icons/fa6"; // Import icons
// import "./TopNav.css"; // Assuming you have a CSS file for styling

function TopNav() {
  const { handleLogout } = UseLogout();

  return (
    <div>
      <nav className="custom-navbar">
        <ul className="icon-list">
          <li>
            {/* Replaced <i> tag with React component */}
            <FaRegBell className="nav-icon" title="Notifications" />
          </li>
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>
            {/* Replaced <i> tag with React component */}
            <FaArrowRightFromBracket className="nav-icon" title="Sign Out" />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default TopNav;