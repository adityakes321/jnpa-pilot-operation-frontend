import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./styles.css";

export default function VesselNamePage() {
  const vessels = [
    { name: "MV Ocean Star", imo: "9812345", flag: "India", status: "Berthed" },
    { name: "MT Blue Horizon", imo: "9722211", flag: "Singapore", status: "Inbound" },
    { name: "MV Eastern Pearl", imo: "9640098", flag: "Panama", status: "Waiting Anchorage" },
  ];

  return (
    <>
      <header className="header">
        <div id="top-navbar">
          <Navbar />
        </div>
      </header>

      <main className="main-content vessel-name-page">
        <div className="container-fluid">
          <div className="content-section">
            <h1 className="fw-bold mb-1">Vessel Directory</h1>
            <p className="text-muted mb-4">Searchable vessel information is now rendered directly via JSX.</p>

            <div className="card">
              <div className="card-header bg-white">
                <h5 className="mb-0">Active Vessels</h5>
              </div>
              <div className="table-responsive">
                <table className="table mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Vessel Name</th>
                      <th>IMO</th>
                      <th>Flag</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vessels.map((vessel) => (
                      <tr key={vessel.imo}>
                        <td>{vessel.name}</td>
                        <td>{vessel.imo}</td>
                        <td>{vessel.flag}</td>
                        <td>{vessel.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div id="footer">
          <Footer />
        </div>
      </footer>
    </>
  );
}
