import { useCallback, useEffect, useReducer } from "react";
import apiClient from "../../lib/apiClient";
import AuthContext from "./authContext";
import authReducer from "./authReducer";
import {
  AUTH_FAILURE,
  AUTH_LOGOUT,
  AUTH_START,
  AUTH_SUCCESS,
} from "../types";

function getGitHubRedirectUri() {
  return `${window.location.origin}/auth/github/callback`;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthState = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadCurrentUser = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      dispatch({ type: AUTH_START });
    }

    try {
      const response = await apiClient.get("/auth/me");
      dispatch({
        type: AUTH_SUCCESS,
        payload: response.data.data.user,
      });
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch({ type: AUTH_LOGOUT });
        return null;
      }

      dispatch({
        type: AUTH_FAILURE,
        payload: error.response?.data?.message || "Failed to load session",
      });
      return null;
    }
  }, []);

  const loginWithGitHubCode = useCallback(async (code) => {
    dispatch({ type: AUTH_START });

    try {
      const response = await apiClient.post("/auth/github", { code });
      dispatch({
        type: AUTH_SUCCESS,
        payload: response.data.data.user,
      });

      return response.data.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message || "GitHub authentication failed";
      dispatch({
        type: AUTH_FAILURE,
        payload: message,
      });
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      dispatch({ type: AUTH_LOGOUT });
    }
  }, []);

  const getGitHubLoginUrl = useCallback(() => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

    if (!clientId) {
      throw new Error("Missing VITE_GITHUB_CLIENT_ID configuration");
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: getGitHubRedirectUri(),
      scope: "read:user user:email",
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }, []);

  useEffect(() => {
    loadCurrentUser({ silent: true });
  }, [loadCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        loadCurrentUser,
        loginWithGitHubCode,
        logout,
        getGitHubLoginUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
