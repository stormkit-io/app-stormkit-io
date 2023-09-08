import Box from "@mui/material/Box";

interface Props {
  children: React.ReactNode;
}

export default function InputDescription({ children }: Props) {
  return (
    <Box sx={{ py: 1, px: 1.75, bgcolor: "rgba(0,0,0,0.1)" }}>
      <Box sx={{ opacity: 0.5 }}>{children}</Box>
    </Box>
  );
}
