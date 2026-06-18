import { useEffect, useState } from 'react'

const useRunServer = (): {
  serverRunning: boolean | null
  launchDevServer: () => void
  stopDevServer: () => void
} => {
  const [serverRunning, setServerRunning] = useState<boolean | null>(null)
  useEffect(() => {
    window.api
      .getDevServerStatus()
      .then((data) => setServerRunning(data.success ? (data.data ?? false) : false))
      .catch(() => setServerRunning(false))
  }, [])

  const launchDevServer = (): void => {
    window.api
      .runDevServer()
      .then((data) => {
        if (data.success) setServerRunning(true)
        alert(
          data.success
            ? data.message || 'Dev server launched!'
            : data.message || 'Failed to launch dev server.'
        )
      })
      .catch((err: Error) => {
        alert(err.message || 'Failed to launch dev server.')
      })
  }

  const stopDevServer = (): void => {
    window.api
      .stopDevServer()
      .then((data) => {
        if (data.success) setServerRunning(false)
        alert(
          data.success
            ? data.message || 'Dev server stopped.'
            : data.message || 'Failed to stop dev server.'
        )
      })
      .catch((err: Error) => {
        alert(err.message || 'Failed to stop dev server.')
      })
  }

  return { serverRunning, launchDevServer, stopDevServer }
}
export default useRunServer
