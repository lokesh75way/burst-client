import { useContext } from "react";

import { AppContext } from "../providers/AppProvider";

/**
 * Custom hook for accessing the context provided by AppProvider.
 * @returns {Object} The values provided by the AppContext.
 */
function useApp() {
    /**
     * Accesses the values provided by the AppContext.
     * @type {Object}
     */
    const values = useContext(AppContext);
    return values;
}

export default useApp;
