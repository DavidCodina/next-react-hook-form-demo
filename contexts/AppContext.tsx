import React, { createContext, useContext } from 'react'
// import { useRouter } from 'next/router'

export interface AppContextValue {
  [key: string]: any
}

/* =============================================================================

============================================================================= */

export const AppContext = createContext({} as AppContextValue)
export const AppConsumer = AppContext.Consumer

export const AppProvider = (props: { children: React.ReactNode }) => {
  /* ======================
          return
  ====================== */

  return <AppContext.Provider value={{}}>{props.children}</AppContext.Provider>
}

export function useAppContext() {
  const value = useContext(AppContext)
  return value
}
