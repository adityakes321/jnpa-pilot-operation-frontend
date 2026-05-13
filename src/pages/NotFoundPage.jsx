import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="main-content">
      <div className="container-fluid">
        <div className="content-section text-center py-5 d-flex align-items-center justify-content-center" style={{ minHeight: "calc(100vh - 120px)" }}>
          <div>
            <h1 className="display-2 fw-bold mb-3">404</h1>
            <h2 className="fw-bold mb-3">Page Not Found</h2>
            <p className="text-muted mb-4">
              The page you requested does not exist or has been moved to a new React route.
            </p>
            <Link to="/home" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
