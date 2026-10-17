"use client";
import {
  useCallback,
  type ButtonHTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import type { TablerIcon } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "className" | "onClick" | "type"
> {
  routeUrl?: string;
  className?: string;
  children?: ReactNode;
  icon?: TablerIcon;
  iconClassName?: string;
  label?: string;
  labelClassName?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button({
  routeUrl,
  className = "inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-3 font-bold text-white",
  children,
  icon: Icon,
  iconClassName,
  label,
  labelClassName,
  type = "button",
  onClick,
  ...buttonProps
}: ButtonProps) {
  const router = useRouter();

  const onButtonClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      onClick?.(event);
      if (routeUrl) router.push(routeUrl);
    },
    [onClick, routeUrl, router],
  );

  return (
    <button {...buttonProps} type={type} onClick={onButtonClick} className={className}>
      {Icon && (
        <Icon
          className={`h-5 w-5 ${iconClassName ? ` ${iconClassName}` : ""}`}
          aria-hidden="true"
        />
      )}
      {label && <span className={labelClassName}>{label}</span>}
      {children}
    </button>
  );
}
