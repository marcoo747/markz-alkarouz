import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";

import { router, usePage } from "@inertiajs/react";

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
    const { osra_info } = usePage().props;

    /*
    |--------------------------------------------------------------------------
    | Booking State
    |--------------------------------------------------------------------------
    */

    const [timeType, setTimeType] = useState("familyTime");

    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");

    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const [selectedOsraDate, setSelectedOsraDate] = useState("");

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Checkout Modal
    |--------------------------------------------------------------------------
    */

    const openCheckout = useCallback(() => {
        setIsCheckoutOpen(true);
    }, []);

    const closeCheckout = useCallback(() => {
        setIsCheckoutOpen(false);
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Read Booking Interval From URL
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const type = params.get("time_type");

        if (type === "custom") {
            setTimeType("customTime");

            setStartDate(params.get("start_date") || "");
            setStartTime(params.get("start_time") || "");

            setEndDate(params.get("end_date") || "");
            setEndTime(params.get("end_time") || "");
        }

        if (type === "family") {
            setTimeType("familyTime");

            setSelectedOsraDate(
                params.get("osra_date") || ""
            );
        }
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Build query parameters
    |--------------------------------------------------------------------------
    */

    const buildTimeParams = useCallback(() => {
        if (timeType === "customTime") {
            return {
                time_type: "custom",
                start_date: startDate,
                start_time: startTime,
                end_date: endDate,
                end_time: endTime,
            };
        }

        return {
            time_type: "family",
            osra_date: selectedOsraDate,
            osra_time: osra_info?.osra_time ?? "",
            osra_numeric_time: osra_info?.osra_numeric_time ?? "",
        };
    }, [
        timeType,
        startDate,
        startTime,
        endDate,
        endTime,
        selectedOsraDate,
        osra_info,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Save booking interval
    |--------------------------------------------------------------------------
    */

    const saveBookingInterval = useCallback(() => {
        const params = buildTimeParams();

        router.get(
            window.location.pathname,
            params,
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,

                onSuccess: async () => {
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

                    closeCheckout();
                }
            }
        );
    }, [buildTimeParams, closeCheckout]);

    /*
    |--------------------------------------------------------------------------
    | Context value
    |--------------------------------------------------------------------------
    */

    const value = {
        timeType,
        setTimeType,

        startDate,
        setStartDate,

        startTime,
        setStartTime,

        endDate,
        setEndDate,

        endTime,
        setEndTime,

        selectedOsraDate,
        setSelectedOsraDate,

        isCheckoutOpen,
        openCheckout,
        closeCheckout,

        buildTimeParams,
        saveBookingInterval,
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
        throw new Error(
            "useBooking must be used inside a BookingProvider"
        );
    }

    return context;
};

export default BookingContext;