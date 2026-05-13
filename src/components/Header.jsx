import React from "react";

export default function Header() {
  return (
    <>
      <div className="py-2 ps-3 bg-white d-xs-none" style={{ borderBottom: "5px solid #33b5e5" }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          <a href="#" className="d-flex align-items-center my-lg-0 me-lg-auto mb-xs-5 text-white text-decoration-none">
            <img src="/assets/img/JNPA_LOGO.png" alt="JNPA Logo" style={{ height: "70px", width: "auto" }} />
          </a>
          <div className="d-flex align-items-center mx-3">
            <img src="/assets/img/Vadhavan_logo.png" alt="Vadhavan Logo" style={{ height: "70px", width: "auto" }} className="d-xs-none" />
            <img src="/assets/img/sagarmala.png" alt="sagarmala Logo" style={{ height: "60px", width: "auto" }} />
          </div>
        </div>
      </div>

      <div
        className="py-2 ps-4 bg-white d-xs-block d-sm-none d-md-none d-lg-none d-xl-none d-xxl-none"
        style={{ borderBottom: "5px solid #33b5e5" }}
      >
        <div className="d-flex align-items-center justify-content-between me-3">
          <img src="/assets/img/JNPA_LOGO2.png" alt="JNPA Logo" style={{ height: "60px", width: "auto" }} />
          <img src="/assets/img/Vadhavan_logo.png" alt="Vadhavan Logo" style={{ height: "40px", width: "auto" }} />
          <img src="/assets/img/sagarmala.png" alt="sagarmala Logo" style={{ height: "40px", width: "auto" }} />
        </div>
      </div>
    </>
  );
}
