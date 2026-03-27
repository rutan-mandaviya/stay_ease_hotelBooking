import API from "../../api/api.config";

import {
  setUser,
  setLoading,
  setError,
  removeUser,
} from "../reducers/authSlice";

// REGISTER ACTION
export const asyncRegister = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await API.post("/auth/register", formData);

    // Sirf success message ya true return karo
    dispatch(setLoading(false));
    return true; // <--- Yeh important hai
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Registration Failed"));
    return false;
  }
};

// LOGIN ACTION
export const asyncLogin = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await API.post("/auth/login", credentials);
    const actualData = response.data;

    localStorage.setItem("token", actualData.access_token);
    if (actualData.refresh_token)
      localStorage.setItem("refresh_token", actualData.refresh_token);

    dispatch(
      setUser({ user: actualData.user, token: actualData.access_token }),
    );

    return true; // <--- Yeh success signal hai
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Login Failed"));
    return false;
  }
};

export const asyncLoadUser = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    dispatch(setLoading(true));
    const { data } = await API.get("/auth/me");
    dispatch(setUser({ user: data, token }));
  } catch (error) {
    console.log("asyncLoadUser error", error);
    // Interceptor logout handle kar lega, yahan sirf state clean karo
    dispatch(removeUser());
  } finally {
    dispatch(setLoading(false));
  }
};

export const asyncLogout = () => (dispatch) => {
  dispatch(removeUser());
};
