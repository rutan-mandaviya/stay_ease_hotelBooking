import API from "../../api/api.config";
import {
  setDashboardData,
  setLoading,
  setError,
} from "../reducers/analyticsSlice";

export const asyncFetchOwnerDashboard = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await API.get("/analytics/owner-dashboard");

    // Backend returns: { data: { stats, statusBreakdown, recentBookings } }
    dispatch(setDashboardData(response.data));
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to load dashboard";
    dispatch(setError(msg));
  } finally {
    dispatch(setLoading(false));
  }
};
