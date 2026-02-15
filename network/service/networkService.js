import axios from "axios";
import { toast } from "react-toastify";
import ApiPath from "../api/apiPath";
import TokenService from "./tokenService";

class NetworkService {
  constructor() {
    this.baseUrl = ApiPath.baseURL;
    this.tokenService = TokenService.getInstance();
    this.axiosInstance = axios.create();
    this.configureHttpClient();
    this.setupInterceptors();
  }

  configureHttpClient() {
    this.axiosInstance.defaults.baseURL = this.baseUrl;
    this.axiosInstance.defaults.timeout = 10000;
    this.axiosInstance.defaults.headers.common["Content-Type"] =
      "application/json";
    this.axiosInstance.defaults.headers.common["Accept"] = "application/json";
  }

  setupInterceptors() {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = this.tokenService.accessToken;
        // this.log(`🔑 Token: ${accessToken}`);

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => {
        // this.log(`❌ Request Error: ${error.message}`, "❌");
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          // this.log("Unauthorized. Please login again.");
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  handleUnauthorized() {
    this.tokenService.clearToken();
    if (typeof window !== "undefined") {
      // Redirect to login after a delay
      window.location.href = "/auth/login";
    }
  }

  // GET Method with params
  async get(endpoint, params = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    // this.log(`📥 GET Request URL: ${url}`);
    if (params) {
      // this.log(`Params: ${JSON.stringify(params)}`);
    }

    try {
      const response = await this.axiosInstance.get(endpoint, { params });
      return this.handleResponse(response, "GET");
    } catch (error) {
      return this.handleAxiosError(error, "GET");
    }
  }

  // POST Method with params
  async post(endpoint, data = null, params = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    // this.log(`📤 POST Request URL: ${url}`);
    if (params) {
      // this.log(`Params: ${JSON.stringify(params)}`);
    }

    if (data) {
      // this.log(`📦 POST Request Body: ${JSON.stringify(data)}`);
    } else {
      // this.log("📦 POST Request Body: No body data");
    }

    try {
      const response = await this.axiosInstance.post(endpoint, data, {
        params,
      });
      return this.handleResponse(response, "POST");
    } catch (error) {
      return this.handleAxiosError(error, "POST");
    }
  }

  // POST FormData Method (for file uploads and multipart/form-data)
  async postFormData(endpoint, formData, params = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    // this.log(`📤 POST FormData Request URL: ${url}`);
    if (params) {
      // this.log(`Params: ${JSON.stringify(params)}`);
    }
    // this.log("📦 POST FormData Request Body: FormData object");

    try {
      const response = await this.axiosInstance.post(endpoint, formData, {
        params,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return this.handleResponse(response, "POST FormData");
    } catch (error) {
      return this.handleAxiosError(error, "POST FormData");
    }
  }

  // DELETE Method
  async delete(endpoint, data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    // this.log(`🗑️ DELETE Request URL: ${url}`);

    if (data) {
      // this.log(`📦 DELETE Request Body: ${JSON.stringify(data)}`);
    } else {
      // this.log("📦 DELETE Request Body: No body data");
    }

    try {
      const response = await this.axiosInstance.delete(endpoint, { data });
      return this.handleResponse(response, "DELETE");
    } catch (error) {
      return this.handleAxiosError(error, "DELETE");
    }
  }

  // Global GET Method (without auth, with params)
  async globalGet(endpoint, params = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    // this.log(`Global GET Request URL: ${url}`, "✅");
    if (params) {
      // this.log(`Params: ${JSON.stringify(params)}`);
    }

    try {
      const response = await axios.get(url, {
        headers: this.baseHeaders,
        params,
      });
      return this.handleResponse(response, "Global GET");
    } catch (error) {
      return this.handleAxiosError(error, "Global GET");
    }
  }

  // Global POST Method (without auth, with params)
  async globalPost(endpoint, data = null, params = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    // this.log(`Global POST Request URL: ${url}`, "✅");
    if (params) {
      // this.log(`Params: ${JSON.stringify(params)}`);
    }

    if (data) {
      // this.log(`📦 Global POST Request Body: ${JSON.stringify(data)}`);
    } else {
      // this.log("📦 Global POST Request Body: No body data");
    }

    try {
      const response = await axios.post(url, data, {
        headers: this.baseHeaders,
        params,
      });
      return this.handleResponse(response, "Global POST");
    } catch (error) {
      return this.handleAxiosError(error, "Global POST");
    }
  }

  // Handle Successful Response
  handleResponse(response, requestType) {
    // this.log(`Handling Response - Status Code: ${response.status}`, "📥");

    switch (response.status) {
      case 200:
        const jsonData = response.data;
        // this.log(`${requestType} Response: ${JSON.stringify(jsonData)}`, "✅");
        return {
          status: "completed",
          data: jsonData,
        };
      default:
        // this.log(`Unknown Status Code: ${response.status}`, "❓");
        return {
          status: "error",
          message: `Error occurred: ${response.status}`,
        };
    }
  }

  // Handle Axios Errors
  handleAxiosError(error, requestType) {
    if (error.code === "ECONNABORTED") {
      // this.log(`${requestType} TimeoutException: Request timed out`, "⏳");
      this.showToast("Request timed out. Please try again.");
      return {
        status: "error",
        message: "Request timed out",
      };
    } else if (error.code === "ERR_NETWORK") {
      // this.log(`${requestType} NetworkException: No internet connection`, "🚫");
      this.showToast("No internet connection. Please check your network.");
      return {
        status: "error",
        message: "No internet connection",
      };
    } else if (error.response) {
      return this.handleErrorResponse(error.response, requestType);
    } else {
      // this.log(`${requestType} AxiosException: ${error.message}`, "🚫");
      this.showToast("An error occurred. Please try again.");
      return {
        status: "error",
        message: error.message || "An error occurred",
      };
    }
  }

  // Handle Error Response
  handleErrorResponse(response, requestType) {
    // this.log(`Handling Error Response - Status Code: ${response.status}`, "⚠️");

    switch (response.status) {
      case 400:
      case 401:
        const jsonResponse = response.data || {};
        // this.log(
        //   `${requestType} Response: ${JSON.stringify(jsonResponse)}`,
        //   "❌"
        // );
        const errorMessage = jsonResponse.message || "Bad request";

        if (response.status === 401) {
          this.handleUnauthorized();
          // this.tokenService.clearToken();
        }

        this.showToast(errorMessage);

        return {
          status: "error",
          message: errorMessage,
        };

      case 403:
      case 404:
      case 422:
        const errorResponse = response.data || {};
        // this.log(
        //   `${requestType} Response: ${JSON.stringify(errorResponse)}`,
        //   "❌"
        // );
        const errorMsg = errorResponse.message || `Error ${response.status}`;
        this.showToast(errorMsg);
        return {
          status: "error",
          message: errorMsg,
        };

      case 500:
        const serverError = response.data || {};
        // this.log(
        //   `${requestType} Response: ${JSON.stringify(serverError)}`,
        //   "❌"
        // );
        const serverErrorMsg = serverError.message || "Internal server error";
        this.showToast(serverErrorMsg);
        return {
          status: "error",
          message: serverErrorMsg,
        };

      default:
        // this.log(`Unknown Error: ${response.status}`, "❓");
        this.showToast("An error occurred. Please try again.");
        return {
          status: "error",
          message: `Error occurred: ${response.status}`,
        };
    }
  }

  // Utilities
  get baseHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  log(message, icon = "📄") {
    if (process.env.NODE_ENV === "development") {
      // console.log(`${icon} ${message}`);
    }
  }

  showToast(message) {
    toast.error(message, {
      duration: 2000,
      position: "top-right",
    });
  }
}

export default NetworkService;
