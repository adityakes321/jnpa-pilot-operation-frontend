import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./styles.css";

export default function ChartsPage() {
  const chartCards = [
    {
      title: "Daily Vessel Movement",
      desc: "Track arrivals and departures over the last 7 days.",
      accent: "text-primary",
      icon: "fas fa-chart-line",
    },
    {
      title: "Cargo Throughput",
      desc: "Compare handled tonnage by terminal and shift.",
      accent: "text-success",
      icon: "fas fa-chart-bar",
    },
    {
      title: "Pilot Utilization",
      desc: "Monitor pilot duty load and standby distribution.",
      accent: "text-info",
      icon: "fas fa-chart-pie",
    },
  ];

  return (
    <>
      <header className="header">
        <div id="top-navbar">
          <Navbar />
        </div>
      </header>

      <main className="main-content charts-page">
        <div className="container-fluid">
          <div className="content-section">
            <h1 className="fw-bold mb-1">Charts & Analytics</h1>
            <p className="text-muted mb-4">Interactive analytics have been migrated to React components.</p>

            <div className="row g-4">
              {chartCards.map((card) => (
                <div className="col-lg-4 col-md-6" key={card.title}>
                  <div className="card h-100">
                    <div className="card-body">
                      <div className={`${card.accent} mb-3`}>
                        <i className={`${card.icon} fa-2x`}></i>
                      </div>
                      <h5 className="card-title">{card.title}</h5>
                      <p className="card-text">{card.desc}</p>
                      <button className="btn btn-outline-primary btn-sm" type="button">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
