import axios from "axios";

function getBaseUrl() {
  const { hostname } = window.location;
  const environments = {
    dev: { host: "localhost", baseUrl: "http://localhost:30000" },
    prod: { host: "ntcpwcit.in", baseUrl: "https://ntcpwcit.in/pilot-card-jnpa/v2" },
  };

  for (const env of Object.values(environments)) {
    if (env.host === hostname) {
      return env.baseUrl;
    }
  }
  return "http://localhost:30000";
}

export const http = axios.create({
  baseURL: getBaseUrl(),
});

http.interceptors.request.use(
  (request) => {
    const token = sessionStorage.getItem("token");
    const publicUrls = ["/login", "/forgot-password", "/webLogin"];
    const isPublic = publicUrls.some((url) => request.url && request.url.includes(url));

    if (token && !isPublic) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (err) => Promise.reject(err)
);

http.interceptors.response.use(
  (response) => response,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || "";
    const isLoginRoute = window.location.pathname.endsWith("/login");
    const isLoginApi = url.includes("/login") || url.includes("/webLogin");

    if (status === 401 && !isLoginRoute && !isLoginApi) {
      sessionStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

const api = {
  login: (payload, config) => http.post("/webLogin", payload, config),
  forgetPassword: (payload, config) => http.post("/forgot-password", payload, config),
  saveBerthPlanStatus: (payload, config) => http.post("/saveBerthPlanStatus", payload, config),
  deleteBerthVessel: (id, config) => http.post("/deleteBerthVessel", { id }, config),
  getBerthStatus: (config) => http.get("/getBerthStatus", config),
  getBerthPlan: (config) => http.get("/getBerthPlan", config),
  getUserData: (config) => http.get("/user-GetUserReportData", config),
};

export default api;
