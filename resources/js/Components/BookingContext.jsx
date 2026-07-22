import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
} from "react";

import { router, usePage } from "@inertiajs/react";

const BookingContext = createContext(null);

const STORAGE_KEY = "markaz_booking_settings";

/** Persist settings to localStorage */
const persist = (settings) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (_) {}
};

/** Load settings from localStorage */
const loadPersisted = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (_) {
        return null;
    }
};

export const BookingProvider = ({ children }) => {
    const { osra_info } = usePage().props;

    /*
    |--------------------------------------------------------------------------
    | Defaults (computed once)
    |--------------------------------------------------------------------------
    */
    const defaults = React.useMemo(() => {
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];
        const h = String(now.getHours()).padStart(2, "0");
        const m = String(now.getMinutes()).padStart(2, "0");
        const startT = `${h}:${m}`;

        const endNow = new Date(now.getTime() + 60 * 60 * 1000);
        const endD = endNow.toISOString().split("T")[0];
        const endH = String(endNow.getHours()).padStart(2, "0");
        const endM = String(endNow.getMinutes()).padStart(2, "0");
        const endT = `${endH}:${endM}`;

        return { todayStr, startT, endD, endT };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Resolve initial state: URL params > localStorage > defaults
    |--------------------------------------------------------------------------
    */
    const resolveInitialState = () => {
        // 1. URL params take highest priority
        const params = new URLSearchParams(window.location.search);
        const urlType = params.get("time_type");

        if (urlType === "custom") {
            return {
                timeType: "customTime",
                startDate: params.get("start_date") || defaults.todayStr,
                startTime: params.get("start_time") || defaults.startT,
                endDate: params.get("end_date") || defaults.endD,
                endTime: params.get("end_time") || defaults.endT,
                selectedOsraDate: osra_info?.next_same_day || defaults.todayStr,
            };
        }
        if (urlType === "family") {
            return {
                timeType: "familyTime",
                startDate: defaults.todayStr,
                startTime: defaults.startT,
                endDate: defaults.endD,
                endTime: defaults.endT,
                selectedOsraDate: params.get("osra_date") || osra_info?.next_same_day || defaults.todayStr,
            };
        }

        // 2. localStorage
        const saved = loadPersisted();
        if (saved) {
            return {
                timeType: saved.timeType || "familyTime",
                startDate: saved.startDate || defaults.todayStr,
                startTime: saved.startTime || defaults.startT,
                endDate: saved.endDate || defaults.endD,
                endTime: saved.endTime || defaults.endT,
                selectedOsraDate: saved.selectedOsraDate || osra_info?.next_same_day || defaults.todayStr,
            };
        }

        // 3. Defaults
        return {
            timeType: "familyTime",
            startDate: defaults.todayStr,
            startTime: defaults.startT,
            endDate: defaults.endD,
            endTime: defaults.endT,
            selectedOsraDate: osra_info?.next_same_day || defaults.todayStr,
        };
    };

    const initial = resolveInitialState();

    const [timeType, setTimeType] = useState(initial.timeType);
    const [startDate, setStartDate] = useState(initial.startDate);
    const [startTime, setStartTime] = useState(initial.startTime);
    const [endDate, setEndDate] = useState(initial.endDate);
    const [endTime, setEndTime] = useState(initial.endTime);
    const [selectedOsraDate, setSelectedOsraDate] = useState(initial.selectedOsraDate);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Keep a ref to always have latest values inside the router event callback
    const stateRef = useRef({});
    stateRef.current = { timeType, startDate, startTime, endDate, endTime, selectedOsraDate };

    /*
    |--------------------------------------------------------------------------
    | Persist whenever settings change
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        persist({ timeType, startDate, startTime, endDate, endTime, selectedOsraDate });
    }, [timeType, startDate, startTime, endDate, endTime, selectedOsraDate]);

    /*
    |--------------------------------------------------------------------------
    | Intercept ALL Inertia navigation to append time params automatically
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        const unsubscribe = router.on("before", (event) => {
            const { detail } = event;
            if (!detail?.visit) return;

            const visit = detail.visit;
            const url = new URL(visit.url, window.location.origin);

            // Skip if time_type is already in the URL (user/app set it explicitly)
            if (url.searchParams.has("time_type")) return;

            // Skip non-GET requests (POST, DELETE etc.)
            if (visit.method && visit.method.toLowerCase() !== "get") return;

            const s = stateRef.current;

            if (s.timeType === "customTime") {
                url.searchParams.set("time_type", "custom");
                if (s.startDate) url.searchParams.set("start_date", s.startDate);
                if (s.startTime) url.searchParams.set("start_time", s.startTime);
                if (s.endDate)   url.searchParams.set("end_date",   s.endDate);
                if (s.endTime)   url.searchParams.set("end_time",   s.endTime);
            } else {
                url.searchParams.set("time_type", "family");
                const osraDate = s.selectedOsraDate || osra_info?.next_same_day || "";
                if (osraDate) url.searchParams.set("osra_date", osraDate);
            }

            visit.url = url;
        });

        return () => unsubscribe();
    }, [osra_info]);

    /*
    |--------------------------------------------------------------------------
    | Checkout Modal
    |--------------------------------------------------------------------------
    */
    const openCheckout = useCallback(() => setIsCheckoutOpen(true), []);
    const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

    /*
    |--------------------------------------------------------------------------
    | Build query parameters object
    |--------------------------------------------------------------------------
    */
    const buildTimeParams = useCallback(() => {
        if (timeType === "customTime") {
            return {
                time_type: "custom",
                start_date: startDate || defaults.todayStr,
                start_time: startTime || defaults.startT,
                end_date:   endDate   || defaults.endD,
                end_time:   endTime   || defaults.endT,
            };
        }
        return {
            time_type: "family",
            osra_date: selectedOsraDate || osra_info?.next_same_day || defaults.todayStr,
            osra_time: osra_info?.osra_time ?? "",
            osra_numeric_time: osra_info?.osra_numeric_time ?? "",
        };
    }, [timeType, startDate, startTime, endDate, endTime, selectedOsraDate, osra_info, defaults]);

    /*
    |--------------------------------------------------------------------------
    | Save booking interval (clears cart & reloads current page with params)
    |--------------------------------------------------------------------------
    */
    const saveBookingInterval = useCallback(async () => {
        const params = buildTimeParams();

        try {
            await fetch(route("cart.clear"), {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                    Accept: "application/json",
                },
            });
        } catch (error) {
            console.error("Failed to clear cart on date change:", error);
        }

        router.get(
            window.location.pathname,
            params,
            {
                preserveState: false,
                preserveScroll: true,
                replace: true,
                onFinish: () => {
                    closeCheckout();
                },
            }
        );
    }, [buildTimeParams, closeCheckout]);

    /*
    |--------------------------------------------------------------------------
    | Context value
    |--------------------------------------------------------------------------
    */
    const value = {
        timeType, setTimeType,
        startDate, setStartDate,
        startTime, setStartTime,
        endDate, setEndDate,
        endTime, setEndTime,
        selectedOsraDate, setSelectedOsraDate,
        isCheckoutOpen, openCheckout, closeCheckout,
        buildTimeParams, saveBookingInterval,
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/
export const useBooking = () => {
    const context = useContext(BookingContext);

    if (!context) {
        throw new Error("useBooking must be used inside a BookingProvider");
    }

    return context;
};

export default BookingContext;