import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-card hover:bg-muted",
        ghost: "hover:bg-muted",
        zap: "bg-[#25d366] text-[#0b3d2b] hover:bg-[#1fbe5b]",
        social: "bg-social text-white hover:bg-social/90",
        pro: "bg-pro text-white hover:bg-pro/90",
      },
      size: {
        default: "h-12 px-5 text-base",
        sm: "h-10 px-3 text-sm",
        lg: "h-14 px-6 text-lg",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
