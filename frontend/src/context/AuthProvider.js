import React, { useState, createContext, useEffect, useContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("user"));
    setUser(getUser);
  }, []);

  const login = (loggedInUser) => {
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
