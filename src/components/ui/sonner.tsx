
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        duration: 2000,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-black/70 group-[.toaster]:text-white group-[.toaster]:text-xs group-[.toaster]:py-1.5 group-[.toaster]:px-3 group-[.toaster]:shadow-lg group-[.toaster]:rounded-md group-[.toaster]:border-0",
          description: "group-[.toast]:text-white/90 group-[.toast]:text-[11px]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-xs",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast } from "sonner"
