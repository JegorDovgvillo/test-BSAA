import { configureStore } from "@reduxjs/toolkit";
import info from "../components/table/TableSlice";
const store = configureStore({
  reducer: { info },
  devTools: process.env.NODE_ENV !== "production",
});
export default store;
