import React, { ReactElement, FC } from "react";

type Props = {
  /**
   * The success message.
   */
  message: string;
  info: boolean;
  success: boolean;
}

const Success: FC<Props> = ({ message, ...props }: Props): ReactElement => {
  if (!message) {
    return <></>
  }

  if (!props.info && !props.success) {
    props.success = true;
  }

  return <div className="infobox-toaster text-left" {...props}>{message}</div>;
};

export default Success;
