// store/useDashboardStore.ts
import { create } from "zustand";
import dayjs from "dayjs";

interface DashboardState {
    start_date: string;
    end_date: string;
    company: string;
    temp_start_date: string;
    temp_end_date: string;
    temp_company: string;
    searchTrigger: number;
    firstLoad: boolean;

    setTempFilters: (start: string, end: string, filter: string) => void;
    applyFilters: () => void;
    resetFilters: () => void;
}

const useDashboardStore = create<DashboardState>((set) => ({
    // ✅ Default: Last 7 days
    start_date: dayjs().subtract(7, "days").format("YYYY-MM-DD"),
    end_date: dayjs().format("YYYY-MM-DD"),
    company: "all",

    // ✅ Temporary filter values (for user selections)
    temp_start_date: dayjs().subtract(7, "days").format("YYYY-MM-DD"),
    temp_end_date: dayjs().format("YYYY-MM-DD"),
    temp_company: "all",

    // ✅ Search trigger (controls API call)
    searchTrigger: 1, // ✅ Set to 1 to trigger initial API call
    firstLoad: true, // ✅ Track if it's the first load

    // ✅ Update temporary selections
    setTempFilters: (start, end, filter) => set({ temp_start_date: start, temp_end_date: end, temp_company: filter }),

    // ✅ Apply filters (Updates main state & triggers API)
    applyFilters: () =>
        set((state) => ({
            start_date: state.temp_start_date,
            end_date: state.temp_end_date,
            company: state.temp_company,
            searchTrigger: state.searchTrigger + 1,
            firstLoad: false, // ✅ No longer first load after search
        })),

    // ✅ Reset filters to default & trigger API
    resetFilters: () =>
        set({
            start_date: dayjs().subtract(7, "days").format("YYYY-MM-DD"),
            end_date: dayjs().format("YYYY-MM-DD"),
            company: "all",
            temp_start_date: dayjs().subtract(7, "days").format("YYYY-MM-DD"),
            temp_end_date: dayjs().format("YYYY-MM-DD"),
            temp_company: "all",
            searchTrigger: 1, // ✅ Reset to trigger API call
            firstLoad: false,
        }),
}));

export default useDashboardStore;
