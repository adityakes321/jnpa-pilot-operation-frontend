import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./styles.css";

const liveBerthingRows = [
  { vessel: "MV Ocean Star", eta: "16:30", berth: "B-03", pilot: "Capt. A. Rao", status: "Approaching" },
  { vessel: "MT Blue Horizon", eta: "17:15", berth: "B-01", pilot: "Capt. S. Iyer", status: "Pilot Onboard" },
  { vessel: "MV Eastern Pearl", eta: "18:05", berth: "B-05", pilot: "Capt. R. Naik", status: "Awaiting Berth" },
];

export default function LiveBerthingPage() {
  return (
    <>
      <header className="header">
        <div id="top-navbar">
          <Navbar />
        </div>
      </header>

      <main className="main-content live-berthing-page">
        <div className="container-fluid">
          <div className="content-section">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="fw-bold mb-1">Live Berthing</h1>
                <p className="text-muted mb-0">Real-time view of incoming vessels and pilot assignments.</p>
              </div>
              <span className="badge bg-success fs-6">Live</span>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-lg-4 col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="text-muted">Vessels Inbound</h6>
                    <h2 className="fw-bold mb-0">12</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="text-muted">Berths Occupied</h6>
                    <h2 className="fw-bold mb-0">8 / 10</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="text-muted">Pilots On Duty</h6>
                    <h2 className="fw-bold mb-0">14</h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header bg-white">
                <h5 className="mb-0">Incoming Vessels Queue</h5>
              </div>
              <div className="table-responsive">
                <table className="table mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Vessel</th>
                      <th>ETA</th>
                      <th>Allocated Berth</th>
                      <th>Pilot</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveBerthingRows.map((row) => (
                      <tr key={row.vessel}>
                        <td>{row.vessel}</td>
                        <td>{row.eta}</td>
                        <td>{row.berth}</td>
                        <td>{row.pilot}</td>
                        <td>
                          <span className="badge bg-info text-dark">{row.status}</span>
                        </td>
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
