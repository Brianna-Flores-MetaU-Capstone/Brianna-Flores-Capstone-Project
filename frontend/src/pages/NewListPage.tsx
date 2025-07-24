import type {
  GPErrorMessageTypes,
  GPRecipeIngredientTypes,
} from "../utils/types/types";
import AppHeader from "../components/utils/AppHeader";
import MealCard from "../components/recipeDisplay/MealCard";
import MealInfoModal from "../components/recipeDisplay/MealInfoModal";
import { useState, useEffect } from "react";
import AddAnotherMealModal from "../components/AddAnotherMealModal";
import TitledListView from "../components/utils/TitledListView";
import ErrorState from "../components/utils/ErrorState";
import { useUser } from "../contexts/UserContext";
import {
  fetchRecipes,
  updateUserRecipes,
  fetchUserIngredientsHelper,
} from "../utils/databaseHelpers";
import { useNavigate } from "react-router";
import LoadingModal from "../components/utils/LoadingModal";
import axios from "axios";
import { axiosConfig } from "../utils/databaseHelpers";
import { Box, Button } from "@mui/joy";
import ConnectCalendar from "../components/calendar/ConnectCalendar";
import CalendarModal from "../components/calendar/CalendarModal";
import {
  MUI_GRID_FULL_SPACE,
  CenteredTitledListStyle,
} from "../utils/style/UIStyle";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;
import { Recipe } from "../../../shared/Recipe";
import { CalendarEvent } from "../classes/calendar/CalendarEvent";
import EventSummaryModal from "../components/calendar/EventSummaryModal";
import { RecipeFetchEnum } from "../utils/constants";
import Masonry from "react-responsive-masonry";

const NewListPage = () => {
  const [addAnotherRecipeModalOpen, setAddAnotherRecipeModalOpen] =
    useState(false);
  const [recipeInfoModalOpen, setRecipeInfoModalOpen] = useState(false);
  const [recipeInfoModalInfo, setRecipeInfoModalInfo] = useState<Recipe>();
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [loadingList, setLoadingList] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [createdEvents, setCreatedEvents] = useState<CalendarEvent[]>([]);
  const [eventSummaryModalOpen, setEventSummaryModalOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleSelectRecipe = async (selectedRecipe: Recipe) => {
    if (!user) {
      setMessage({ error: true, message: "Error user not signed in" });
      return;
    }
    try {
      const userId = user.id;
      await updateUserRecipes({
        editedRecipe: false,
        userId,
        selectedRecipe,
        setMessage,
      });
      await fetchRecipes({
        setMessage,
        setRecipes: setSelectedRecipes,
        recipeGroup: RecipeFetchEnum.PLANNED,
      });
    } catch (error) {
      setMessage({ error: true, message: "Error adding recipe" });
    }
  };

  useEffect(() => {
    fetchRecipes({
      setMessage,
      setRecipes: setSelectedRecipes,
      recipeGroup: RecipeFetchEnum.PLANNED,
    });
  }, []);

  const handleRecipeCardClick = (recipe: Recipe) => {
    setRecipeInfoModalOpen((prev) => !prev);
    setRecipeInfoModalInfo(recipe);
  };

  const handleDeleteRecipe = async (deletedRecipe: Recipe) => {
    try {
      await axios.put(
        `${databaseUrl}/recipes/${RecipeFetchEnum.PLANNED}/remove`,
        { deletedRecipe },
        axiosConfig
      );
      await fetchRecipes({
        setMessage,
        setRecipes: setSelectedRecipes,
        recipeGroup: RecipeFetchEnum.PLANNED,
      });
    } catch (error) {
      setMessage({ error: true, message: "Failed to delete recipe" });
    }
  };

  const getRecipeIngredients = (recipes: Recipe[]) => {
    let recipeIngredients: GPRecipeIngredientTypes[] = [];
    for (const recipe of recipes) {
      recipeIngredients = [...recipeIngredients, ...recipe.ingredients];
    }
    return recipeIngredients;
  };

  const handleGenerateList = async () => {
    setLoadingList(true);
    const ownedIngredients = await fetchUserIngredientsHelper({ setMessage });
    const recipeIngredients = getRecipeIngredients(selectedRecipes);

    try {
      await axios.post(
        `${databaseUrl}/generateList/${user?.id}`,
        { ownedIngredients, recipeIngredients },
        axiosConfig
      );
      navigate("/grocery-list");
    } catch (error) {
      setMessage({ error: true, message: "Failed to generate grocery list" });
    }
  };

  const handleEventsCreated = async (createdEvents: CalendarEvent[]) => {
    setCreatedEvents(createdEvents);
    setEventSummaryModalOpen(true);
    await fetchRecipes({
      setMessage,
      setRecipes: setSelectedRecipes,
      recipeGroup: RecipeFetchEnum.PLANNED,
    });
  };

  return (
    <Box>
      <AppHeader />
      <Box sx={{ m: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              onClick={() => setAddAnotherRecipeModalOpen((prev) => !prev)}
            >
              Add Another Meal!
            </Button>
            <Button onClick={handleGenerateList}>Make My List</Button>
          </Box>
          <ConnectCalendar
            onClick={() => setCalendarModalOpen((prev) => !prev)}
            singleRecipe={false}
            recipeInfo={null}
          />
        </Box>
        <Box>
          <TitledListView
            headerList={[
              { title: "Selected Meals", spacing: MUI_GRID_FULL_SPACE },
            ]}
            itemsList={selectedRecipes}
            renderItem={(meal, index) => (
              <MealCard
                key={meal.apiId}
                index={index}
                favorited={false}
                toggleCalendarTimeModal={() =>
                  setCalendarModalOpen((prev) => !prev)
                }
                onMealCardClick={() => handleRecipeCardClick(meal)}
                setMessage={setMessage}
                parsedMealData={meal}
                onDeleteRecipe={handleDeleteRecipe}
                selectedToCompare={false}
              />
            )}
            listItemsStyle={CenteredTitledListStyle}
          />
        </Box>
        {message && (
          <ErrorState error={message.error} message={message.message} />
        )}
      </Box>
      <AddAnotherMealModal
        toggleModal={() => setAddAnotherRecipeModalOpen((prev) => !prev)}
        onSelectRecipe={handleSelectRecipe}
        modalOpen={addAnotherRecipeModalOpen}
      />
      <MealInfoModal
        toggleModal={() => setRecipeInfoModalOpen((prev) => !prev)}
        modalOpen={recipeInfoModalOpen}
        recipeInfo={recipeInfoModalInfo}
      />
      <LoadingModal
        modalOpen={loadingList}
        message={"Generating Your Grocery List"}
      />
      <CalendarModal
        modalOpen={calendarModalOpen}
        toggleModal={() => setCalendarModalOpen((prev) => !prev)}
        setCreatedEvents={handleEventsCreated}
      />
      <EventSummaryModal
        events={createdEvents}
        modalOpen={eventSummaryModalOpen}
        toggleModal={() => {
          setEventSummaryModalOpen((prev) => !prev);
        }}
      />
    </Box>
  );
};

export default NewListPage;
