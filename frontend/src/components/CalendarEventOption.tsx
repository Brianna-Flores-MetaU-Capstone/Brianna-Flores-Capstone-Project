import type { GPRecipeEventOptionType } from "../utils/types";
import { Box, Card, IconButton, CardContent, Typography, AspectRatio, Button } from "@mui/joy";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const CalendarEventOption = ({eventOption}: {eventOption: GPRecipeEventOptionType}) => {
    const recipe = eventOption.recipe
    const startDate = new Date(eventOption.start)
    const formattedStart = startDate.toLocaleTimeString([], {hour: 'numeric', minute: 'numeric'}).replace("PM", "").replace("AM", "")
    const endDate = new Date(eventOption.end)
    const formattedEnd = endDate.toLocaleTimeString([], {hour: 'numeric', minute: 'numeric'})
    return (
    <Card sx={{ width: 450 }}>
      <div>
        <Typography level="title-lg">{recipe.recipeTitle}</Typography>
        <Typography level="body-md">Cook Time: {recipe.readyInMinutes}</Typography>
        <IconButton
          aria-label="Accept Event Reccomendation"
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
        >
          <CheckCircleOutlineIcon />
        </IconButton>
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
        <div>
          <Typography level="body-sm">{startDate.toDateString()}</Typography>
          <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>{formattedStart}- {formattedEnd}</Typography>
        </div>
        <Button
          size="md"
          color="primary"
          aria-label="Adjust event recommendation"
          sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
        >
          Adjust Time
        </Button>
      </CardContent>
    </Card>
    )
}

export default CalendarEventOption