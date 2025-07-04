
import { Toaster as Sonner } from "sonner"

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {},
        className: "",
        duration: 4000,
        closeButton: true,
      }}
      theme="system"
    />
  )
}
