import type {
  GPUserEventTypes,
  GPRecipeDataTypes,
  GPRecipeEventOptionType,
  GPPreferredBlockType,
} from "../../frontend/src/utils/types";

type GPBestTimeType = {
  userFreeTime: GPUserEventTypes[];
  shoppingTime: number;
};
const getShoppingTimeOptions = ({
  userFreeTime,
  shoppingTime,
}: GPBestTimeType) => {
  // return 3 options for user to choose from
  // once we hit 3 choices, break out of loop
  let choices = 0;
  let eventOptions: GPUserEventTypes[] = [];
  for (const freeBlock of userFreeTime) {
    let startTime = new Date(freeBlock.start);
    let endTime = new Date(freeBlock.end);
    let blockTime = endTime.getTime() - startTime.getTime();
    while (blockTime >= shoppingTime) {
      // if block time is greater than event time, then create an event
      const option = {
        name: `Option ${choices + 1}`,
        start: startTime,
        end: new Date(startTime.getTime() + 1000 * 60 * shoppingTime),
      };
      eventOptions = [...eventOptions, option];
      blockTime -= shoppingTime;
      startTime = option.end;
      choices++;
      if (choices === 3) {
        return eventOptions;
      }
    }
  }
  return eventOptions;
};

type GPRecipeEventTypes = {
  userFreeTime: GPUserEventTypes[];
  userRecipes: GPRecipeDataTypes[];
  userPreferences: GPPreferredBlockType[];
};
const getRecipeTimeOptions = ({
  userFreeTime,
  userRecipes,
  userPreferences,
}: GPRecipeEventTypes) => {
  // cook one recipe max per day
  let eventOptions: GPRecipeEventOptionType[] = [];
  let currentDay = new Date(userFreeTime[0].start);
  for (const recipe of userRecipes) {
    for (const freeBlock of userFreeTime) {
      let startTime = new Date(freeBlock.start);
      let endTime = new Date(freeBlock.end);
      if (endTime.getTime() >= currentDay.getTime()) {
        // block is after current day
        const bestBlock = fitsUserPreferences({
          freeBlock,
          userPreferences,
          recipe,
        });
        if (bestBlock) {
          eventOptions = [...eventOptions, bestBlock];
          currentDay.setDate(startTime.getDate() + recipe.servings);
          currentDay.setHours(8, 0, 0, 0);
          break;
        }
      }
    }
  }
  return eventOptions;
};

type GPFitsPreferenceTypes = {
  freeBlock: GPUserEventTypes;
  userPreferences: GPPreferredBlockType[];
  recipe: GPRecipeDataTypes;
};
const fitsUserPreferences = ({
  freeBlock,
  userPreferences,
  recipe,
}: GPFitsPreferenceTypes) => {
  // userPreferences formatted as 00:00
  // loop through user preferences
  const startAsDate = new Date(freeBlock.start);
  const endAsDate = new Date(freeBlock.end);
  const freeBlockStart = startAsDate.getTime();
  const freeBlockEnd = endAsDate.getTime();
  let bestChoice = null;
  for (const preference of userPreferences) {
    const tempPrefStart = new Date(freeBlock.start);
    tempPrefStart.setHours(0, 0, 0, 0);
    const preferredStart =
      tempPrefStart.getTime() +
      (parseInt(preference.start.substring(0, 2)) * 60 +
        parseInt(preference.start.substring(3))) *
        60 *
        1000;

    const tempPrefEnd = new Date(freeBlock.end);
    tempPrefEnd.setHours(0, 0, 0, 0);
    const preferredEnd =
      tempPrefEnd.getTime() +
      (parseInt(preference.end.substring(0, 2)) * 60 +
        parseInt(preference.end.substring(3))) *
        60 *
        1000;
    if (freeBlockStart > preferredEnd || freeBlockEnd < preferredStart) {
      continue;
    }
    let start = 0;
    let end = 0;
    if (freeBlockStart <= preferredStart && freeBlockEnd >= preferredEnd) {
      // preferred block completely within free block
      start = preferredStart;
      end = preferredEnd;
    }
    if (preferredStart <= freeBlockStart && preferredEnd >= freeBlockEnd) {
      // free block is completely within prefered block
      start = freeBlockStart;
      end = freeBlockEnd;
    }
    if (
      freeBlockStart < preferredStart &&
      freeBlockEnd > preferredStart &&
      freeBlockEnd < preferredEnd
    ) {
      // free block starts before prefered block and ends within prefered block
      start = preferredStart;
      end = freeBlockEnd;
    }
    if (
      freeBlockStart > preferredStart &&
      freeBlockStart < preferredEnd &&
      freeBlockEnd > preferredEnd
    ) {
      // free block starts within prefered block and ends after it
      start = freeBlockStart;
      end = preferredEnd;
    }
    if (end - start >= recipe.readyInMinutes) {
      let optionArray = [{start: new Date(start),
        end: new Date(start + recipe.readyInMinutes * 1000 * 60),}]
      start = start + 1000 * 60 * 15
      if (end - start >= recipe.readyInMinutes) {
        optionArray = [...optionArray, { start: new Date(start),
        end: new Date(start + recipe.readyInMinutes * 1000 * 60),}]
      }
      bestChoice = {
        name: recipe.recipeTitle,
        timeOptions: optionArray,
        recipe: recipe,
      };
      return bestChoice;
    }
  }
  return null;
};

const NUM_SCHEDULE_OPTIONS = 3;

const getMultipleScheduleOptions = ({
  userFreeTime,
  userRecipes,
  userPreferences,
}: GPRecipeEventTypes) => {
  let scheduleOptions: GPRecipeEventOptionType[][] = [];
  let recipeArray = userRecipes;
  for (let i = 0; i < NUM_SCHEDULE_OPTIONS; i++) {
    const option = getRecipeTimeOptions({
      userFreeTime: userFreeTime,
      userRecipes: recipeArray,
      userPreferences,
    });
    scheduleOptions = [...scheduleOptions, option];
    recipeArray = shuffleArray(recipeArray);
  }
  return scheduleOptions;
};

// shuffle algorithm from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffledArray = [...array];
  let currentIndex = shuffledArray.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[currentIndex],
    ];
  }
  return shuffledArray;
};

export {
  getShoppingTimeOptions,
  getRecipeTimeOptions,
  getMultipleScheduleOptions,
};
