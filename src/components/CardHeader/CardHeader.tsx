import { useContext } from "react";
import { BoxProps } from "@mui/material/Box";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardContext from "../Card/Card.context";

interface Props extends BoxProps {
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function CardHeader({
  sx,
  subtitle,
  actions,
  title,
  children,
  ...rest
}: Props) {
  const { size } = useContext(CardContext);
  const space = size === "medium" ? 4 : 2;

  return (
    <Box
      sx={{
        p: space,
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
      {...rest}
    >
      <Box sx={{ flex: 1 }}>
        {title && (
          <Typography
            variant="h2"
            sx={{ fontSize: 20, mb: subtitle ? 0.5 : 0 }}
          >
            {title}
          </Typography>
        )}
        {title && subtitle && (
          <Typography sx={{ color: "text.secondary" }}>{subtitle}</Typography>
        )}
        {children}
      </Box>
      {actions}
    </Box>
  );
}
