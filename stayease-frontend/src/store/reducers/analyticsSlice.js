import { createSlice } from "@reduxjs/toolkit";

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    stats: { totalRevenue: 0, totalBookings: 0 },
    statusBreakdown: [],
    recentBookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    setDashboardData: (state, action) => {
      state.stats = action.payload.stats;
      state.statusBreakdown = action.payload.statusBreakdown;
      state.recentBookings = action.payload.recentBookings;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setDashboardData, setLoading, setError } =
  analyticsSlice.actions;
export default analyticsSlice.reducer;
