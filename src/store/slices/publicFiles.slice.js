import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem, removeItem } from "@/utils/storage";

const FILTERS_KEY = "publicFilesFilters";

const defaultFilters = {
  q: "",
  published: "all", // "true" | "false" | "all"
  page: 1,
  limit: 10,
  sort: "created_desc",
};

const initialFilters = (() => {
  const raw = getItem(FILTERS_KEY);
  if (!raw) return { ...defaultFilters };
  try {
    const parsed = JSON.parse(raw);
    return { ...defaultFilters, ...parsed, page: 1 }; // reset to page 1
  } catch {
    return { ...defaultFilters };
  }
})();

const initialState = {
  filters: initialFilters,
  currentId: null,
};

const slice = createSlice({
  name: "publicFiles",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      setItem(FILTERS_KEY, JSON.stringify(state.filters));
    },
    resetFilters(state) {
      state.filters = { ...defaultFilters };
      setItem(FILTERS_KEY, JSON.stringify(state.filters));
    },
    setCurrentId(state, action) {
      state.currentId = action.payload ?? null;
    },
    clearPublicFilesPrefs() {
      removeItem(FILTERS_KEY);
      return initialState;
    },
  },
});

export const {
  setFilters: setPublicFilesFilters,
  resetFilters: resetPublicFilesFilters,
  setCurrentId: setPublicFileCurrentId,
  clearPublicFilesPrefs,
} = slice.actions;

export default slice.reducer;
