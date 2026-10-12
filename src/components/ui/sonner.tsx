import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      duration={2500}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#161616] group-[.toaster]:text-[#f4f4f4] group-[.toaster]:border-[#333333] group-[.toaster]:border-l-4 group-[.toaster]:border-l-[#7c9c84] group-[.toaster]:rounded-none group-[.toaster]:shadow-xl",
          description: "group-[.toast]:text-[#a8a8a8]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-none",
          cancelButton:
            "group-[.toast]:bg-[#262626] group-[.toast]:text-[#f4f4f4] group-[.toast]:rounded-none",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
