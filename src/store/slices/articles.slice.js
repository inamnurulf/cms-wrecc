import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem, removeItem } from "../../utils/storage";


const FILTERS_KEY = "articleFilters";

const initialFilters = (() => {
  const raw = getItem(FILTERS_KEY);
  if (!raw) return { status: "", tag_id: "", category_id: "", q: "", page: 1, limit: 10 };
  try {
    const parsed = JSON.parse(raw);
    return { page: 1, limit: 10, ...parsed };
  } catch {
    return { status: "", tag_id: "", category_id: "", q: "", page: 1, limit: 10 };
  }
})();

const initialState = {
  filters: initialFilters,
  currentId: null,
};

const slice = createSlice({
  name: "article",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      setItem(FILTERS_KEY, JSON.stringify(state.filters));
    },
    resetFilters(state) {
      state.filters = { status: "", tag_id: "", category_id: "", q: "", page: 1, limit: 10 };
      setItem(FILTERS_KEY, JSON.stringify(state.filters));
    },
    setCurrentId(state, action) {
      state.currentId = action.payload;
    },
    clearArticlePrefs() {
      removeItem(FILTERS_KEY);
      return initialState;
    },
  },
});

export const { setFilters, resetFilters, setCurrentId, clearArticlePrefs } = slice.actions;
export default slice.reducer;
