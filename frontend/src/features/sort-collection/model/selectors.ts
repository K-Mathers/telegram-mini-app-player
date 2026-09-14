import type { RootState } from "@/app/store";

export const selectSortBy = (state: RootState) => state.sort.sortBy;
