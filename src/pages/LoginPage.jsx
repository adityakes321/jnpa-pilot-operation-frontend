import React, { useEffect, useState } from "react";
import api from "../api";
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
    move: { enable: true, speed: 1.5, direction: "none", random: false, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 1200, rotateY: 600 } },
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS("particles-js", particleConfig);
    }
  }, []);

  async function login() {
    const emailValue = email.trim();
    const passwordValue = password.trim();
    if (!emailValue || !passwordValue) {
      displayMessage("Please enter email and password", "warning");
      return;
    }

    try {
      const response = await api.login({ username: emailValue, password: passwordValue });
      const { name, pilotId, roleId, userId, token, tugId } = response.data;

      if (response.data.status === 200) {
        sessionStorage.setItem("token", token || "");
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("pilotId", pilotId);
        sessionStorage.setItem("roleId", roleId);
        sessionStorage.setItem("userId", userId);
        if (tugId) {
          sessionStorage.setItem("tugId", tugId);
        }
        displayMessage("Sign in successful", "success");
        setTimeout(() => {
          window.location.href = "/home";
        }, 1000);
        return;
      }

      displayMessage('Kindly Use "PILOT THAGAVAL"', "warning");
    } catch (err) {
      if (err.response) {
        const msg = err.response.data?.message || "Login failed";
        displayMessage(msg, "error");
        return;
      }
      displayMessage("Server error. Try again later.", "error");
    }
  }

  return (
    <div className="overflow-y-hidden login-page user-select-none">
      <div id="header"><Header /></div>
      <div className="main-content mx-auto">
        <section className="d-flex justify-content-center align-items-center page-header min-vh-100 position-sticky">
          <div id="particles-js"></div>
          <div className="container">
            <div className="justify-content-center">
              <div className="col-xl-4 col-md-6 d-flex flex-column mx-auto card-morphism" style={{ marginTop: "-8em" }}>
                <div className="card card-plain" style={{ transition: "all 10s ease-in-out" }}>
                  <div className="card-body pb-0">
                    <div>
                      <div className="mb-3">
                        <label>Email</label>
                        <input type="email" id="email" className="form-control" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>

                      <div className="mb-3">
                        <label>Password</label>
                        <div className="input-group">
                          <input type={showPassword ? "text" : "password"} id="password" className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                          <span className="input-group-text" id="togglePassword" style={{ cursor: "pointer" }} onClick={() => setShowPassword((v) => !v)}>
                            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} fa-shake`}></i>
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <a href="/reset-password" className="text-xs font-weight-bold ms-auto">Forgot password ?</a>
                      </div>
                      <div className="text-center">
                        <button type="button" className="btn btn-white w-100 mt-4 mb-3" onClick={login}>
                          <span className="btn-inner--text">Sign in</span>
                        </button>
                      </div>
                      <div className="login-msg-container text-center">
                        <p className="login-msg"></p>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer text-center pt-0 p-3 px-lg-2 px-1">
                    <div className="d-flex align-items-center justify-content-center mb-3">
                      <hr className="flex-grow-1" style={{ borderColor: "rgba(0, 0, 0, 0.824)" }} />
                      <div className="px-3">
                        <div className="tooltip-container">
                          <a href="https://ntcpwcit.in/jnpa-pilot-operations/" className="text-secondary analytics-icon" aria-label="Live Berthing Screen">
                            <i className="fa-regular fa-chart-bar fa-lg"></i>
                          </a>
                          <span className="tooltip-text">Live Berthing Screen<br /><small>View real-time vessel docking status</small></span>
                        </div>
                      </div>
                      <hr className="flex-grow-1" style={{ borderColor: "rgba(0, 0, 0, 0.824)" }} />
                    </div>
                    <p className="mb-0 text-xs">
                      <a href="https://share.google/hMT4aX2UXUaQ0X1Fj" className="text-dark font-weight-bold">
                        Designed and Developed by NTCPWC, <br />IIT-Madras.
                      </a>
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
