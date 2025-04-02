
import React, { createContext, useContext, useState } from "react";

const LoaderContext = createContext();

export function LoaderProvider({ children }) {
    const [loading, setLoading] = useState(false);
    return (
        <LoaderContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoaderContext.Provider>
    );
}

export function useLoader() {
    return useContext(LoaderContext);
}
