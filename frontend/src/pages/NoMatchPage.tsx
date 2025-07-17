import AppHeader from "../components/AppHeader";
import { Box, Alert, Typography } from "@mui/joy";

const NoMatchPage = () => {
  return (
    <Box>
      <AppHeader />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 30 }}>
        <Alert
          sx={{ alignItems: "flex-start" }}
          variant="soft"
          color={"danger"}
        >
          <Box textAlign="center" sx={{ width: 500 }}>
            <Typography level="h2">Error 404</Typography>
            <Typography level="body-sm" color={"danger"}>
              Page not found
            </Typography>
          </Box>
        </Alert>
      </Box>
    </Box>
  );
};

export default NoMatchPage;
