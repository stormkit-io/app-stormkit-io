import Box from "@mui/material/Box";

interface Props {
  children: React.ReactNode;
}

export default function IconBg({ children }: Props) {
  return (
    <Box
      component="span"
      sx={{
        bgcolor: "rgba(255,255,255,0.1)",
        mr: 1,
        borderRadius: "50%",
        width: 26,
        height: 26,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
}
