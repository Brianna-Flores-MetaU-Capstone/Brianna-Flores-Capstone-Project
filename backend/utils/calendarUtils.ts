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

const getMealPrepTimeOptions = ({
  userRecipes,
  userFreeTime,
  userPreferences,
}: GPRecipeEventTypes) => {
  let eventOptions: GPRecipeEventOptionType[] = [];
  // if single day prep, estimate time to cook all recipes
  let longestCookTime = 0;
  let totalServings = 0;
  for (const recipe of userRecipes) {
    if (recipe.readyInMinutes > longestCookTime) {
      longestCookTime = recipe.readyInMinutes;
    }
    totalServings += recipe.servings;
  }
  // TODO determine heuristic to estimate cooking all recipes
  const estimatedCookTime = longestCookTime * 2;
  for (const freeBlock of userFreeTime) {
    const timeOptions = fitsUserPreferences({
      freeBlock,
      userPreferences,
      readyInMinutes: estimatedCookTime,
    });
    if (timeOptions) {
      const bestBlock = {
        name: "Prep Block",
        timeOptions: timeOptions,
        recipe: {
          recipeTitle: "Prep Block",
          readyInMinutes: estimatedCookTime,
          servings: totalServings,
          previewImage:
          "https://images.pexels.com/photos/1435910/pexels-photo-1435910.jpeg",
        },
      };
      eventOptions = [...eventOptions, bestBlock]
      break;
    }
  }
  return eventOptions
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
        const timeOptions = fitsUserPreferences({
          freeBlock,
          userPreferences,
          readyInMinutes: recipe.readyInMinutes,
        });
        if (timeOptions) {
          const bestBlock = {
            name: recipe.recipeTitle,
            timeOptions: timeOptions,
            recipe: recipe,
          };
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
  readyInMinutes: number;
};
const fitsUserPreferences = ({
  freeBlock,
  userPreferences,
  readyInMinutes,
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
    if (end - start >= readyInMinutes * 1000 * 60) {
      let optionArray = [
        {
          start: new Date(start),
          end: new Date(start + readyInMinutes * 1000 * 60),
        },
      ];
      start = start + 1000 * 60 * 15;
      if (end - start >= readyInMinutes * 1000 * 60) {
        optionArray = [
          ...optionArray,
          {
            start: new Date(start),
            end: new Date(start + readyInMinutes * 1000 * 60),
          },
        ];
      }
      return optionArray;
    }
  }
  return null;
};

type GPMultipleScheduleTypes = GPRecipeEventTypes & {
  singleDayPrep: boolean;
  numOptions: number;
};

const getMultipleScheduleOptions = ({
  userFreeTime,
  userRecipes,
  userPreferences,
  singleDayPrep,
  numOptions,
}: GPMultipleScheduleTypes) => {
  let scheduleOptions: GPRecipeEventOptionType[][] = [];
  let recipeArray = [...userRecipes];
  let freeTimeArray = [...userFreeTime];
  for (let i = 0; i < numOptions; i++) {
    if (singleDayPrep) {
      const option = getMealPrepTimeOptions({
        userFreeTime: freeTimeArray,
        userRecipes: userRecipes,
        userPreferences: userPreferences,
      });
      scheduleOptions = [...scheduleOptions, option];
      freeTimeArray = shuffleArray(freeTimeArray);
    } else {
      const option = getRecipeTimeOptions({
        userFreeTime: userFreeTime,
        userRecipes: recipeArray,
        userPreferences,
      });
      scheduleOptions = [...scheduleOptions, option];
      recipeArray = shuffleArray(recipeArray);
    }
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
