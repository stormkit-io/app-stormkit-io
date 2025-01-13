import { useState } from "react";
import TextField, { BaseTextFieldProps } from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface Props extends BaseTextFieldProps {
  ariaLabel?: string;
  endAdornment?: React.ReactNode;
  defaultVisible?: boolean;
}

const fontSize = 14;

export default function PasswordField({
  ariaLabel,
  endAdornment,
  defaultVisible = false,
  ...props
}: Props) {
  const [isValueVisible, setIsValueVisible] = useState<boolean>(defaultVisible);

  return (
    <TextField
      fullWidth
      autoComplete="off"
      type={isValueVisible ? "text" : "password"}
      {...props}
      inputProps={{
        "data-1p-ignore": "true",
        "aria-label": ariaLabel,
      }}
      InputProps={{
        endAdornment: (
          <>
            <IconButton
              sx={{ width: 24, height: 24 }}
              type="button"
              aria-label={`Toggle ${props.name} visibility`}
              onClick={() => {
                setIsValueVisible(!isValueVisible);
              }}
            >
              {isValueVisible ? (
                <VisibilityOffIcon sx={{ fontSize }} />
              ) : (
                <VisibilityIcon sx={{ fontSize }} />
              )}
            </IconButton>
            {endAdornment}
          </>
        ),
      }}
    />
  );
}
