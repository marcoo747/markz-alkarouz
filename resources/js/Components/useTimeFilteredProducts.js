import { useMemo } from "react";
import { useBooking } from "@/Components/BookingContext";

/**
 * Products are already filtered by Laravel.
 * This hook only exposes them in a consistent API.
 */
const useTimeFilteredProducts = ({
    initialProducts = [],
} = {}) => {

    const { buildTimeParams } = useBooking();

    const products = useMemo(() => {
        return initialProducts;
    }, [initialProducts]);

    return {
        products,
        loading: false,
        refetch: () => {},
        bookingParams: buildTimeParams(),
    };
};

export default useTimeFilteredProducts;