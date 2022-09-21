import React, { ReactElement } from "react";
import cn from "classnames";
import Spinner from "~/components/Spinner";
import Link from "~/components/Link";
import "./Button.css";

type Category = "action" | "cancel" | "link";
type Size = "sm" | "m" | "lg" | "xl";

interface Props extends Omit<React.HTMLProps<HTMLButtonElement>, "size"> {
  category?: Category;
  loading?: boolean;
  href?: string;
  size?: Size;
  styled?: boolean;
  align?: "left" | "center";
}

const prepareStyles = (
  classes: Array<string>,
  category: Category,
  size: Size
) => {
  classes.push("sk-button");

  if (category === "action") {
    classes.push(...["bg-pink-10"]);
  }

  if (size === "sm") {
    classes.push("px-2", "py-2");
  } else if (size === "m") {
    classes.push("px-6", "py-2");
  }
};

const Button: React.FC<Props> = ({
  children,
  loading,
  className,
  disabled,
  href,
  align = "center",
  category = "action",
  size = "m",
  styled = true,
  ...rest
}: Props): ReactElement => {
  const classes: Array<string> = ["relative"];

  if (styled) {
    prepareStyles(classes, category, size);
  }

  const props = {
    className: cn(classes, className, {
      "disabled:opacity-50 cursor-not-allowed": disabled,
    }),
    disabled: disabled || loading ? "disabled" : undefined,
    ...rest,
  };

  if (!href) {
    const type = category === "action" ? "submit" : "button";

    return (
      <button {...props} disabled={Boolean(disabled)} type={type}>
        <span
          className={cn("inline-flex", "w-full", "items-center", {
            invisible: loading,
            "justify-center": align === "center",
          })}
        >
          {children}
        </span>
        {loading && (
          <Spinner width={6} height={6} className="sk-button-spinner" />
        )}
      </button>
    );
  }

  return (
    <Link className={cn(classes, className, "hover:text-white")} to={href}>
      {children}
    </Link>
  );
};

export default Button;
