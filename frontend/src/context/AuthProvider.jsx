import React, { useState, createContext, useEffect, useContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken]= useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
  }
  setLoading(false)
}, []);

if (loading) return <div>loading...</div>
  const login = (loggedInUser, token) => {
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("token", token); 
    setUser(loggedInUser);
    setToken(token)
  };

  const logout = () => {
    setUser(null);
    setToken(null)
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
