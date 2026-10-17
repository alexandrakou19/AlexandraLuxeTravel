import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center gap-3 overflow-hidden rounded-[2px] border border-transparent",
    "font-sans text-[0.78rem] font-medium tracking-[0.18em] whitespace-nowrap uppercase select-none",
    "transition-[background-color,color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[color-mix(in_oklab,var(--primary),var(--background)_14%)]",
        outline:
          "border-foreground/80 bg-transparent text-foreground hover:bg-foreground hover:text-background",
        inverse:
          "bg-ivory text-charcoal hover:bg-sand",
        "outline-light":
          "border-ivory/70 bg-transparent text-ivory hover:bg-ivory hover:text-charcoal",
        ghost: "text-foreground hover:bg-surface",
        link: "h-auto px-0 tracking-[0.18em] text-foreground underline decoration-accent-line decoration-1 underline-offset-[0.6em] hover:decoration-foreground",
      },
      size: {
        default: "h-12 px-7",
        sm: "h-11 px-5 text-[0.72rem]",
        lg: "h-14 px-9",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
