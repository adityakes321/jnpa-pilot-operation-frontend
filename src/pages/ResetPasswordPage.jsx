import React, { useEffect, useState } from "react";
import { displayMessage } from "../alerts";
import Header from "../components/Header";
import Footer from "../components/Footer";

const particleConfig = {
  particles: {
    number: { value: 380, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle", stroke: { width: 0, color: "#ffffff" }, polygon: { nb_sides: 5 } },
    opacity: { value: 1, random: false, anim: { enable: false, speed: 0.1, opacity_min: 1, sync: false } },
    size: { value: 3, random: true, anim: { enable: false, speed: 10, size_min: 0.1, sync: false } },
    line_linked: { enable: true, distance: 90, color: "#ffffff", opacity: 1, width: 1 },
    move: { enable: true, speed: 3, direction: "none", random: false, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 1200, rotateY: 600 } },
  },
  interactivity: {
    detect_on: "canvas",
    events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 1 } },
      bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
      repulse: { distance: 200, duration: 0.1 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 4 },
    },
  },
  retina_detect: true,
};

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS("particles-js", particleConfig);
    }
  }, []);

  function resetPassword() {
    if (!email.trim()) {
      displayMessage("Please enter email", "warning");
      return;
    }
    displayMessage("password sent via Email successfully", "success");
    setTimeout(() => {
      window.location.href = "/login";
    }, 3000);
  }

  return (
    <div className="overflow-y-hidden login-page">
      <div id="header"><Header /></div>
      <div className="main-content mx-auto">
        <section className="d-flex justify-content-center align-items-center page-header min-vh-85 position-sticky">
          <div id="particles-js"></div>
          <div className="container">
            <div className="justify-content-center">
              <div className="col-xl-4 col-md-6 d-flex flex-column mx-auto card-morphism">
                <div className="card card-plain">
                  <div className="card-body">
                    <div className="form">
                      <h3 className="text-center text-xxl">Reset Password</h3>
                      <hr />
                      <div className="mb-3">
                        <label>Email</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter your Email for Password Reset"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="text-center">
                        <button type="button" className="btn btn-white w-100 mt-4 mb-3" onClick={resetPassword}>
                          <span className="btn-inner--text">Reset Password</span>
                        </button>
                      </div>
                      <div className="login-msg-container text-center">
                        <p className="login-msg"></p>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer text-center pt-0 px-lg-2 px-1">
                    <p className="mb-4 text-xs mx-auto">
                      Back to Login ? &nbsp;
                      <a href="/login" className="text-dark font-weight-bold">Sign in</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <footer className="footer"><div id="footer"><Footer /></div></footer>
    </div>
  );
}
