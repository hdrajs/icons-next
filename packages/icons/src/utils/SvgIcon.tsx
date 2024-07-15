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
    color,
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
      focusable="false"
      color={color}
      ref={ref}
      {...more}
      {...other}
      fill={color}
    >
      {children}
    </svg>
  );
});
