import type {
  GPUserEventTypes,
  GPRecipeEventOptionType,
} from "../../frontend/src/utils/types/types";
import { TimePreferenceString } from "../../frontend/src/classes/calendar/TimePreferenceString";

const TO_MILLISECONDS = 1000 * 60;
const TIME_BLOCK_INCREMENT = 15;
const ZERO_OUT_DATE_HOURS = "T00:00:00";

import TimeBlock from "../classes/TimeBlock";
import { Recipe } from "../../shared/Recipe";

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
  preferredStartDate: string;
  userFreeTime: GPUserEventTypes[];
  userRecipes: Recipe[];
  userPreferences: TimePreferenceString[];
  servingsPerDay: number;
};

const getMealPrepTimeOptions = ({
  preferredStartDate,
  userRecipes,
  userFreeTime,
  userPreferences,
}: GPRecipeEventTypes) => {
  let eventOptions: GPRecipeEventOptionType[] = [];
  // if single day prep, estimate time to cook all recipes
  let sumAllCookTimes = 0;
  let sumAllServings = 0;
  for (const recipe of userRecipes) {
    sumAllCookTimes += recipe.readyInMinutes;
    sumAllServings += recipe.servings;
  }
  // heuristic: 70% of total cook time
  const estimatedCookTime = sumAllCookTimes * 0.7;
  let preferredOptions: TimeBlock[] = [];
  let fallbackOptions: TimeBlock[] = [];
  for (const freeBlock of userFreeTime) {
    // check that current free block is after users preferred start date
    if (
      new Date(freeBlock.end).getTime() <
      new Date(`${preferredStartDate}${ZERO_OUT_DATE_HOURS}`).getTime()
    ) {
      continue;
    }
    const timeOptions = fitsUserPreferences({
      freeBlock,
      userPreferences,
      readyInMinutes: estimatedCookTime,
    });
    if (timeOptions) {
      preferredOptions = [...preferredOptions, ...timeOptions];
    }
    // if at least 2 time options available, break from loop
    if (
      preferredOptions.length > 0 &&
      preferredOptions.length + fallbackOptions.length >= 2
    ) {
      break;
    }
    const otherFreeTimes = getAnyFreeTime({
      preferredOptions,
      freeBlock,
      readyInMinutes: estimatedCookTime,
    });
    fallbackOptions = [...fallbackOptions, ...otherFreeTimes];
  }
  const combinedTimes = [...preferredOptions, ...fallbackOptions];
  if (combinedTimes.length > 0) {
    const bestBlock = {
      name: "Prep Block",
      timeOptions: combinedTimes.slice(0, 2),
      recipe: new Recipe(
        0,
        "",
        "Prep Block",
        "https://images.pexels.com/photos/1435910/pexels-photo-1435910.jpeg",
        sumAllServings,
        [],
        [],
        "https://www.goodhousekeeping.com/food-recipes/a28377603/how-to-meal-prep/",
        estimatedCookTime,
        false,
        false,
        false,
        false,
        [],
        null,
      ),
    };
    eventOptions = [...eventOptions, bestBlock];
  }
  return eventOptions;
};

const getRecipeTimeOptions = ({
  preferredStartDate,
  userFreeTime,
  userRecipes,
  userPreferences,
  servingsPerDay,
}: GPRecipeEventTypes) => {
  let eventOptions: GPRecipeEventOptionType[] = [];
  let currentDay = new Date(`${preferredStartDate}${ZERO_OUT_DATE_HOURS}`);
  currentDay.setHours(0, 0, 0, 0);
  for (const recipe of userRecipes) {
    let fallbackOptions: TimeBlock[] = [];
    let preferredOptions: TimeBlock[] = [];
    const tempCurrentDay = new Date(currentDay);
    for (const freeBlock of userFreeTime) {
      let endTime = new Date(freeBlock.end);
      // ensure free block is after current day
      if (endTime.getTime() >= tempCurrentDay.getTime()) {
        const timeOptions = fitsUserPreferences({
          freeBlock,
          userPreferences,
          readyInMinutes: recipe.readyInMinutes,
        });
        if (timeOptions) {
          preferredOptions = [...preferredOptions, ...timeOptions];
        }
        if (
          preferredOptions.length > 0 &&
          fallbackOptions.length + preferredOptions.length >= 2
        ) {
          break;
        }
        // look for any fallback options
        const otherFreeTimes = getAnyFreeTime({
          preferredOptions,
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
      const incrementDays = Math.ceil(recipe.servings / servingsPerDay);
      currentDay.setDate(currentDay.getDate() + incrementDays);
    }
  }
  return eventOptions;
};

type GPAnyBlockTypes = {
  preferredOptions: TimeBlock[];
  freeBlock: GPUserEventTypes;
  readyInMinutes: number;
};

const getAnyFreeTime = ({
  preferredOptions,
  freeBlock,
  readyInMinutes,
}: GPAnyBlockTypes) => {
  const readyInMilliseconds = readyInMinutes * TO_MILLISECONDS;
  const startAsDate = new Date(freeBlock.start);
  const endAsDate = new Date(freeBlock.end);
  let freeBlockStart = startAsDate.getTime();
  const freeBlockEnd = endAsDate.getTime();
  let optionArray: TimeBlock[] = [];
  const preferredStarts = new Set(
    preferredOptions.map((option) => option.start.getTime()),
  );

  while (freeBlockStart + readyInMilliseconds <= freeBlockEnd) {
    if (!preferredStarts.has(freeBlockStart)) {
      optionArray = [
        ...optionArray,
        new TimeBlock(
          new Date(freeBlockStart),
          new Date(freeBlockStart + readyInMilliseconds),
        ),
      ];
    }
    freeBlockStart += TIME_BLOCK_INCREMENT * TO_MILLISECONDS;
    if (optionArray.length >= 2) {
      break;
    }
  }
  return optionArray;
};

type GPFitsPreferenceTypes = {
  freeBlock: GPUserEventTypes;
  userPreferences: TimePreferenceString[];
  readyInMinutes: number;
};
const fitsUserPreferences = ({
  freeBlock,
  userPreferences,
  readyInMinutes,
}: GPFitsPreferenceTypes) => {
  // userPreferences formatted as 00:00
  const readyInMilliseconds = readyInMinutes * TO_MILLISECONDS;
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
      new Date(preferredEnd),
    );
    const overlap = userPreferenceTimeBlock.getOverlap(freeTimeBlock);

    if (overlap.end - overlap.start > readyInMilliseconds) {
      let optionArray = [
        new TimeBlock(
          new Date(overlap.start),
          new Date(overlap.start + readyInMilliseconds),
        ),
      ];
      const newStart = overlap.start + TO_MILLISECONDS * TIME_BLOCK_INCREMENT;
      if (overlap.end - newStart >= readyInMilliseconds) {
        optionArray = [
          ...optionArray,
          new TimeBlock(
            new Date(newStart),
            new Date(newStart + readyInMilliseconds),
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
  preferredStartDate,
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
        preferredStartDate,
        userFreeTime: freeTimeArray,
        userRecipes: userRecipes,
        userPreferences: userPreferences,
        servingsPerDay: servingsPerDay,
      });
      scheduleOptions = [...scheduleOptions, option];
      freeTimeArray = shuffleArray(freeTimeArray);
    } else {
      const option = getRecipeTimeOptions({
        preferredStartDate,
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
