import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

function Navbar() {
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  return (
    <div className="nav-bar">
      <div className="left_nav">
        Apple House
      </div>

      <div className="profile">
        <div className="profile-circle" onClick={() => logOut()}>
          <p className="circle-inner">Log Out</p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

