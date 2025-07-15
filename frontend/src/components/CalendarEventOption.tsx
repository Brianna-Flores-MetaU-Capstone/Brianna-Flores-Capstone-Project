import type { GPRecipeEventOptionType } from "../utils/types";
import {
  Box,
  Card,
  IconButton,
  CardContent,
  Typography,
  AspectRatio,
  Button,
} from "@mui/joy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const CalendarEventOption = ({
  eventOption,
}: {
  eventOption: GPRecipeEventOptionType;
}) => {
  const recipe = eventOption.recipe;
  const startDate = new Date(eventOption.start);
  const formattedStart = startDate
    .toLocaleTimeString([], { hour: "numeric", minute: "numeric" })
    .replace("PM", "")
    .replace("AM", "");
  const endDate = new Date(eventOption.end);
  const formattedEnd = endDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "numeric",
  });
  return (
    <Card sx={{ width: 350 }}>
      <div>
        <Typography
          level="title-lg"
          sx={{
            textWrap: "nowrap",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {recipe.recipeTitle}
        </Typography>
        <Typography level="body-md">
          Cook Time: {recipe.readyInMinutes}
        </Typography>
      </div>
      <AspectRatio minHeight="120px" maxHeight="200px">
        <img
          src={recipe.previewImage}
          srcSet={recipe.previewImage}
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <CardContent orientation="horizontal">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box>
            <Typography level="body-sm">{startDate.toDateString()}</Typography>
            <Typography sx={{ fontSize: "lg", fontWeight: "lg" }}>
              {formattedStart}- {formattedEnd}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              size="md"
              color="primary"
              aria-label="Adjust event recommendation"
              sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
            >
              Adjust Time
            </Button>
            <IconButton
              aria-label="Accept Event Reccomendation"
              variant="plain"
              color="success"
              size="md"
            >
              <CheckCircleOutlineIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CalendarEventOption;
