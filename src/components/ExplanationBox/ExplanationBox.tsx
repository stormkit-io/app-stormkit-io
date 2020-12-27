import React, { ReactNode, FC, ReactElement, CSSProperties } from "react";
import cn from "classnames";
import "./ExplanationBox.css";

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
  absolute?: boolean;
  arrowStyles?: CSSProperties;
};

const ExplanationBox: FC<Props> = ({
  title,
  children,
  className,
  absolute,
  arrowStyles
}: Props): ReactElement => {
  return (
    <section
      className={cn(
        "bg-blue-20 text-secondary p-8 rounded",
        { "absolute z-10": absolute },
        className
      )}
    >
      {absolute && <div className="exp-arrow-up" style={arrowStyles} />}
      <h3 className="font-bold text-lg mb-4">{title}</h3>
      <div className="leading-6 text-sm">{children}</div>
    </section>
  );
};

ExplanationBox.defaultProps = {
  arrowStyles: {
    left: "50%",
    transform: "translateX(-50%)"
  }
} as Partial<Props>;

export default ExplanationBox;
