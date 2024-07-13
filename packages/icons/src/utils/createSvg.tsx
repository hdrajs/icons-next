import * as React from "react";
import { Props, SvgIcon } from "./SvgIcon";

export const createSvg = (path: React.ReactNode) => {
  const Component = (props: Props, ref: any) => {
    return (
      <SvgIcon ref={ref} {...props}>
        {path}
      </SvgIcon>
    );
  };

  return React.memo(React.forwardRef(Component));
};
