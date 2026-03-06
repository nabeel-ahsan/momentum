import React, { createContext, useContext, useState } from "react";

const UIContext = createContext();

export function useUI(){
    return useContext(UIContext)
}

const UIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [globalState, setGlobalState] = useState(false);

  return (
    <UIContext.Provider
      value={{
        loading,
        setLoading,
        toast,
        setToast,
        globalState,
        setGlobalState,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export default UIProvider;
