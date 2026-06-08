import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      richColors
      position="top-right"
      expand={false}
      closeButton
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "font-medium text-sm shadow-xl rounded-xl border-0",
          title: "font-semibold",
          description: "text-xs opacity-90",
          actionButton: "font-semibold",
          closeButton: "opacity-70 hover:opacity-100",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
