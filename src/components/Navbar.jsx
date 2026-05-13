import React, { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function logout() {
    sessionStorage.clear();
    window.location.href = "/login";
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top shadow-sm user-select-none">
      <div className="container-fluid">
        <a href="#" className="d-flex align-items-center my-lg-0 me-lg-auto m-xs-2 text-white text-decoration-none">
          <img src="/assets/img/logo_full.png" alt="JNPA Logo" style={{ height: "50px", width: "auto" }} />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuOpen((v) => !v);
            setDropdownOpen(false);
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                <i className="fas fa-tachometer-alt"></i>Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-ship"></i>Operations
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-chart-bar"></i>Reports
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen((v) => !v);
                }}
              >
                <i className="fas fa-user-circle"></i>Profile
              </a>
              <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""}`} style={{ overflow: "auto" }}>
                <li><a className="dropdown-item" href="#"><i className="fas fa-user-edit me-2"></i>Update Profile</a></li>
                <li><a className="dropdown-item" href="#"><i className="fas fa-cog me-2"></i>Settings</a></li>
                <li><a className="dropdown-item" href="#"><i className="fas fa-question-circle me-2"></i>Help</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a className="dropdown-item text-danger" href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
