// src/context/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

// Crea il contesto
export const UserContext = createContext();

// Provider per il contesto utente
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    nome: "Admin",
    ruolo: "gestore",
    email: "admin@eodum.it"
  });

  const [userDataLoaded, setUserDataLoaded] = useState(false);

  useEffect(() => {
    // Simula caricamento dati
    const timer = setTimeout(() => {
      setUserDataLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <UserContext.Provider value={{ user, userDataLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

// 👉 Funzione per accedere al contesto (QUELLA CHE MANCAVA)
export const useUser = () => useContext(UserContext);
