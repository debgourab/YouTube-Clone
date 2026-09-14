import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { desktopExpanded: true, drawerOpen: false },
  reducers: {
    toggleDesktop(state) { state.desktopExpanded = !state.desktopExpanded; },
    toggleDrawer(state) { state.drawerOpen = !state.drawerOpen; },
    closeDrawer(state) { state.drawerOpen = false; }
  }
});
export const { toggleDesktop, toggleDrawer, closeDrawer } = uiSlice.actions;
export default uiSlice.reducer;
