import { forwardRef } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

export type Props = React.HTMLAttributes<HTMLOrSVGElement> & {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  inheritViewBox?: boolean;
  viewBox?: string;
};

export const SvgIcon = forwardRef(function (props: Props, ref) {
  const {
    children,
    className,
    color = "#171717",
    size = "md",
    inheritViewBox = false,
    viewBox = `0 0 24 24`,
    ...other
  } = props;

  const more: any = {};

  if (!inheritViewBox) {
    more.viewBox = viewBox;
  }

  return (
    <svg
      className={clsx({
        [styles.root]: true,
        [styles[size]]: size,
        [className || ""]: className,
      })}
      focusable={false}
      ref={ref}
      style={{ color }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...more}
      {...other}
    >
      {children}
    </svg>
  );
});
