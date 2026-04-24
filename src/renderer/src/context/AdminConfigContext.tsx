import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { AdminConfig } from 'src/shared/types'

interface AdminConfigContextValue {
  adminConfig: AdminConfig | null
  refreshAdminConfig: () => void
}

const AdminConfigContext = createContext<AdminConfigContextValue>({
  adminConfig: null,
  refreshAdminConfig: () => {}
})

export function AdminConfigProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [adminConfig, setAdminConfig] = useState<AdminConfig | null>(null)

  const refreshAdminConfig = useCallback(() => {
    window.api.getAdminConfig().then((response) => {
      if (response.success && response.data) setAdminConfig(response.data)
    })
  }, [])

  useEffect(() => {
    refreshAdminConfig()
  }, [refreshAdminConfig])

  return (
    <AdminConfigContext.Provider value={{ adminConfig, refreshAdminConfig }}>
      {children}
    </AdminConfigContext.Provider>
  )
}

export const useAdminConfig = (): AdminConfigContextValue => useContext(AdminConfigContext)
