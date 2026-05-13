import React from "react";

export default function Footer() {
  return (
    <footer className="footer position-fixed bottom-0 end-0 w-100 bg-white text-end px-2 py-1 user-select-none">
      <div className="d-none d-sm-block small text-xs fw-bold me-2">
        Jawaharlal Nehru Port Authority (JNPA) | Copyright © 2025 | All Rights Reserved.
      </div>
      <div className="d-block d-sm-none fw-bold text-center text-truncate px-2" style={{ fontSize: "10px" }}>
        JNPA © 2025 — All Rights Reserved
      </div>
    </footer>
  );
}
