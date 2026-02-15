import Cookies from "js-cookie";

class TokenService {
  constructor() {
    this._accessToken = null;
  }

  static getInstance() {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  get accessToken() {
    if (this._accessToken) return this._accessToken;

    if (typeof window !== "undefined") {
      return Cookies.get("token") || null;
    }

    return null;
  }

  async saveAccessToken(token) {
    this._accessToken = token;
    if (typeof window !== "undefined") {
      Cookies.set("token", token);
    }
  }

  clearToken() {
    this._accessToken = null;
    if (typeof window !== "undefined") {
      Cookies.remove("token");
    }
  }
}

export default TokenService;
