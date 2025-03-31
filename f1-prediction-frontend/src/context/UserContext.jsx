import { createContext, useState, useContext, useEffect } from "react";

// Creamos el contexto
const UserContext = createContext();

// Proveedor de contexto
export function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    // Al iniciar busca si ya había un usuario
    useEffect(() => {
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) setCurrentUser(JSON.parse(savedUser)); 
    }, []);

    // Guardar al cambiar
    function selectUser(user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user)); 
    }


    // Logout
    function logout() {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
    }

    return (
        <UserContext.Provider value={{ currentUser, selectUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

// Hook custom para usar el contexto más fácil
export function useUser() {
    return useContext(UserContext);
}
