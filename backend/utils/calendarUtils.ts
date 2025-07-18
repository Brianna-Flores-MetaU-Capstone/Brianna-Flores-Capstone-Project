import type {
  GPUserEventTypes,
  GPRecipeDataTypes,
  GPRecipeEventOptionType,
  GPPreferredBlockType,
} from "../../frontend/src/utils/types";

const TO_MILLISECONDS = 1000 * 60;
const TIME_BLOCK_INCREMENT = 15;

import TimeBlock from "./TimeBlockClass";

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
        end: new Date(startTime.getTime() + TO_MILLISECONDS * shoppingTime),
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
  servingsPerDay: number;
};

const getMealPrepTimeOptions = ({
  userRecipes,
  userFreeTime,
  userPreferences,
}: GPRecipeEventTypes) => {
  let eventOptions: GPRecipeEventOptionType[] = [];
  // if single day prep, estimate time to cook all recipes
  let sumAllCookTimes = 0;
  let totalServings = 0;
  for (const recipe of userRecipes) {
    sumAllCookTimes += recipe.readyInMinutes;
    totalServings += recipe.servings;
  }
  // heuristic: 70% of total cook time
  const estimatedCookTime = sumAllCookTimes * 0.7;
  let preferedOptions: TimeBlock[] = [];
  let fallbackOptions: TimeBlock[] = [];
  for (const freeBlock of userFreeTime) {
    const timeOptions = fitsUserPreferences({
      freeBlock,
      userPreferences,
      readyInMinutes: estimatedCookTime,
    });
    if (timeOptions) {
      preferedOptions = timeOptions;
    }
    if (
      preferedOptions.length > 0 &&
      preferedOptions.length + fallbackOptions.length >= 2
    ) {
      break;
    }
    const otherFreeTimes = getAnyFreeTime({
      freeBlock,
      readyInMinutes: estimatedCookTime,
    });
    fallbackOptions = [...fallbackOptions, ...otherFreeTimes];
  }
  const combinedTimes = [...preferedOptions, ...fallbackOptions];
  if (combinedTimes.length > 0) {
    const bestBlock = {
      name: "Prep Block",
      timeOptions: combinedTimes.slice(0, 2),
      recipe: {
        recipeTitle: "Prep Block",
        readyInMinutes: estimatedCookTime,
        servings: totalServings,
        previewImage:
          "https://images.pexels.com/photos/1435910/pexels-photo-1435910.jpeg",
        sourceUrl:
          "https://www.goodhousekeeping.com/food-recipes/a28377603/how-to-meal-prep/",
      },
    };
    eventOptions = [...eventOptions, bestBlock];
  }
  return eventOptions;
};

const getRecipeTimeOptions = ({
  userFreeTime,
  userRecipes,
  userPreferences,
  servingsPerDay,
}: GPRecipeEventTypes) => {
  // cook one recipe max per day
  let eventOptions: GPRecipeEventOptionType[] = [];
  let currentDay = new Date(userFreeTime[0].start);
  currentDay.setDate(currentDay.getDate() + 1);
  currentDay.setHours(0, 0, 0, 0);
  for (const recipe of userRecipes) {
    let fallbackOptions: TimeBlock[] = [];
    let preferredOptions: TimeBlock[] = [];
    for (const freeBlock of userFreeTime) {
      let endTime = new Date(freeBlock.end);
      if (endTime.getTime() >= currentDay.getTime()) {
        // block is after current day
        const timeOptions = fitsUserPreferences({
          freeBlock,
          userPreferences,
          readyInMinutes: recipe.readyInMinutes,
        });
        if (timeOptions && preferredOptions.length <= 0) {
          preferredOptions = timeOptions;
        }
        if (
          preferredOptions.length > 0 &&
          fallbackOptions.length + preferredOptions.length >= 2
        ) {
          break;
        }
        // look for any fallback options
        const otherFreeTimes = getAnyFreeTime({
          freeBlock,
          readyInMinutes: recipe.readyInMinutes,
        });
        fallbackOptions = [...fallbackOptions, ...otherFreeTimes];
      }
    }
    const combinedTimes = [...preferredOptions, ...fallbackOptions];
    if (combinedTimes.length > 0) {
      const bestOption = {
        name: recipe.recipeTitle,
        timeOptions: combinedTimes.splice(0, 2),
        recipe: recipe,
      };
      eventOptions = [...eventOptions, bestOption];
      currentDay.setDate(
        bestOption.timeOptions[0].start.getDate() +
          Math.ceil(recipe.servings / servingsPerDay)
      );
      currentDay.setHours(8, 0, 0, 0);
    }
  }
  return eventOptions;
};

type GPAnyBlockTypes = {
  freeBlock: GPUserEventTypes;
  readyInMinutes: number;
};

const getAnyFreeTime = ({ freeBlock, readyInMinutes }: GPAnyBlockTypes) => {
  const readyInMilliseconds = readyInMinutes * TO_MILLISECONDS
  const startAsDate = new Date(freeBlock.start);
  const endAsDate = new Date(freeBlock.end);
  let freeBlockStart = startAsDate.getTime();
  const freeBlockEnd = endAsDate.getTime();
  let optionArray: TimeBlock[] = [];

  while (freeBlockStart + readyInMilliseconds <= freeBlockEnd) {
    optionArray = [
      ...optionArray,
      new TimeBlock(
        new Date(freeBlockStart),
        new Date(freeBlockStart + readyInMilliseconds)
      ),
    ];
    freeBlockStart += TIME_BLOCK_INCREMENT * TO_MILLISECONDS;
    if (optionArray.length >= 2) {
      break;
    }
  }
  return optionArray;
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
  const readyInMilliseconds = readyInMinutes * TO_MILLISECONDS
  const startAsDate = new Date(freeBlock.start);
  const endAsDate = new Date(freeBlock.end);
  const freeTimeBlock = new TimeBlock(startAsDate, endAsDate);
  for (const preference of userPreferences) {
    const tempPrefStart = new Date(freeBlock.start);
    tempPrefStart.setHours(0, 0, 0, 0);
    const preferredStart =
      tempPrefStart.getTime() +
      (parseInt(preference.start.substring(0, 2)) * 60 +
        parseInt(preference.start.substring(3))) *
        TO_MILLISECONDS;
    const tempPrefEnd = new Date(freeBlock.end);
    tempPrefEnd.setHours(0, 0, 0, 0);
    const preferredEnd =
      tempPrefEnd.getTime() +
      (parseInt(preference.end.substring(0, 2)) * 60 +
        parseInt(preference.end.substring(3))) *
        TO_MILLISECONDS;

    const userPreferenceTimeBlock = new TimeBlock(
      new Date(preferredStart),
      new Date(preferredEnd)
    );
    const overlap = userPreferenceTimeBlock.getOverlap(freeTimeBlock);

    if (overlap.end - overlap.start > readyInMilliseconds) {
      let optionArray = [
        new TimeBlock(
          new Date(overlap.start),
          new Date(overlap.start + readyInMilliseconds)
        ),
      ];
      const newStart = overlap.start + TO_MILLISECONDS * TIME_BLOCK_INCREMENT;
      if (overlap.end - newStart >= readyInMilliseconds) {
        optionArray = [
          ...optionArray,
          new TimeBlock(
            new Date(newStart),
            new Date(newStart + readyInMilliseconds)
          ),
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
  servingsPerDay,
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
        servingsPerDay: servingsPerDay,
      });
      scheduleOptions = [...scheduleOptions, option];
      freeTimeArray = shuffleArray(freeTimeArray);
    } else {
      const option = getRecipeTimeOptions({
        userFreeTime: userFreeTime,
        userRecipes: recipeArray,
        userPreferences,
        servingsPerDay: servingsPerDay,
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
