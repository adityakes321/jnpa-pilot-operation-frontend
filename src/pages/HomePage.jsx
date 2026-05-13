import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <header className="header">
        <div id="top-navbar">
          <Navbar />
        </div>
      </header>

      <main className="main-content">
        <div className="container-fluid">
          <div className="content-section">
            <div className="row">
              <div className="col-12 text-center mb-5">
                <h1 className="display-4 fw-bold">Welcome to JNPA Port Operations</h1>
                <p className="lead text-muted">Advanced port management system for seamless maritime operations</p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="text-primary mb-3">
                      <i className="fas fa-ship fa-3x"></i>
                    </div>
                    <h3 className="card-title">Vessel Management</h3>
                    <p className="card-text">
                      Track and manage all vessel movements in real-time with our advanced monitoring system. Get instant notifications about arrivals, departures, and berthing schedules.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="text-success mb-3">
                      <i className="fas fa-user-tie fa-3x"></i>
                    </div>
                    <h3 className="card-title">Pilot Coordination</h3>
                    <p className="card-text">
                      Efficiently coordinate pilot assignments and schedules. Monitor active pilots, their locations, and availability status for optimal resource allocation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="text-info mb-3">
                      <i className="fas fa-chart-line fa-3x"></i>
                    </div>
                    <h3 className="card-title">Analytics & Reports</h3>
                    <p className="card-text">
                      Generate comprehensive reports and analytics on port operations. Track performance metrics, operational efficiency, and identify areas for improvement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-section">
            <div className="row mb-4">
              <div className="col-12">
                <h2 className="fw-bold">Dashboard Overview</h2>
                <p className="text-muted">Monitor your port operations in real-time with comprehensive dashboards and key performance indicators.</p>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-lg-8 col-md-10 col-sm-12">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="text-success mb-3">
                      <i className="fas fa-anchor fa-2x"></i>
                    </div>
                    <h3 className="card-title">Active Vessels</h3>
                    <p className="card-text">Currently tracking 12 active vessels in the port area. 8 are berthed and 4 are in transit approaching the harbor.</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="text-warning mb-3">
                      <i className="fas fa-tasks fa-2x"></i>
                    </div>
                    <h3 className="card-title">Operations Status</h3>
                    <p className="card-text">24 operations scheduled for today. 14 completed successfully, 8 in progress, and 2 pending approval.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-section">
            <div className="row mb-4">
              <div className="col-12">
                <h2 className="fw-bold">Port Operations</h2>
                <p className="text-muted">Manage all aspects of port operations including berthing, unberthing, cargo handling, and vessel services.</p>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-lg-10 col-md-12 col-sm-12">
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>
                <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="text-primary mb-3">
                      <i className="fas fa-calendar-check fa-2x"></i>
                    </div>
                    <h3 className="card-title">Scheduling</h3>
                    <p className="card-text">Advanced scheduling system for all port operations ensuring optimal utilization of resources and minimizing vessel turnaround time.</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="text-info mb-3">
                      <i className="fas fa-clipboard-list fa-2x"></i>
                    </div>
                    <h3 className="card-title">Documentation</h3>
                    <p className="card-text">Digital documentation management for all operational records, clearances, and compliance certificates.</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="text-warning mb-3">
                      <i className="fas fa-exclamation-triangle fa-2x"></i>
                    </div>
                    <h3 className="card-title">Safety Protocols</h3>
                    <p className="card-text">Comprehensive safety management system ensuring adherence to international maritime safety standards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-section">
            <div className="row mb-4">
              <div className="col-12">
                <h2 className="fw-bold">Reports & Analytics</h2>
                <p className="text-muted">Generate detailed reports and access comprehensive analytics to drive data-informed decision making.</p>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-lg-9 col-md-11 col-sm-12">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>
                <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words.</p>
                <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="text-success mb-3">
                      <i className="fas fa-file-alt fa-2x"></i>
                    </div>
                    <h3 className="card-title">Daily Reports</h3>
                    <p className="card-text">Automated daily operational reports with key metrics and performance indicators.</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="text-primary mb-3">
                      <i className="fas fa-chart-pie fa-2x"></i>
                    </div>
                    <h3 className="card-title">Analytics Dashboard</h3>
                    <p className="card-text">Interactive dashboards with real-time data visualization and trend analysis.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-section">
            <div className="row mb-4">
              <div className="col-12">
                <h2 className="fw-bold">System Settings</h2>
                <p className="text-muted">Configure and customize your port operations management system according to your requirements.</p>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-10 col-md-12 col-sm-12">
                <p>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures.</p>
                <p>The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. This makes it a perfect tool for developers and designers who need realistic placeholder text.</p>
                <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.</p>
                <p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p>
              </div>
            </div>
          </div>

          <div className="content-section">
            <div className="row">
              <div className="col-12">
                <h2 className="fw-bold">Additional Information</h2>
              </div>
            </div>

            <div className="row g-4 mt-3">
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-primary mb-3">
                      <i className="fas fa-users fa-3x"></i>
                    </div>
                    <h4 className="card-title">500+</h4>
                    <p className="text-muted">Active Users</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-success mb-3">
                      <i className="fas fa-ship fa-3x"></i>
                    </div>
                    <h4 className="card-title">1200+</h4>
                    <p className="text-muted">Vessels Managed</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-info mb-3">
                      <i className="fas fa-clock fa-3x"></i>
                    </div>
                    <h4 className="card-title">24/7</h4>
                    <p className="text-muted">Operations</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-warning mb-3">
                      <i className="fas fa-award fa-3x"></i>
                    </div>
                    <h4 className="card-title">98%</h4>
                    <p className="text-muted">Satisfaction Rate</p>
                  </div>
                </div>
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
