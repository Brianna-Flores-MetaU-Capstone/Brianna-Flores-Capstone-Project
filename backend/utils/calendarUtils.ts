import {
  GPUserEventTypes,
  GPRecipeDataTypes,
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

type GPRecipeOptionType = GPUserEventTypes & {
  recipe: GPRecipeDataTypes;
};
type GPRecipeEventTypes = {
  userFreeTime: GPUserEventTypes[];
  userRecipes: GPRecipeDataTypes[];
};
const getRecipeTimeOptions = ({
  userFreeTime,
  userRecipes,
}: GPRecipeEventTypes) => {
  // cook one recipe max per day
  let eventOptions: GPRecipeOptionType[] = [];
  let currentDay = new Date(userFreeTime[0].start);
  for (const recipe of userRecipes) {
    for (const freeBlock of userFreeTime) {
      let startTime = new Date(freeBlock.start);
      let endTime = new Date(freeBlock.end);
      // check if the blocks end time is before the current day
      if (endTime.getTime() >= currentDay.getTime()) {
        let blockTime = (endTime.getTime() - startTime.getTime()) / 60000;
        if (
          blockTime >= recipe.readyInMinutes &&
          (startTime.getHours() >= 17 ||
            (endTime.getHours() <= 20 && endTime.getHours() >= 16))
        ) {
          // block is large enough to fit the required cook time
          // start time for block is after 5 pm and before 8 (automatic constraint from "alert hours")
          if (startTime.getHours() <= 17) {
            startTime.setHours(17, 0, 0, 0);
          }
          const cookTimeOption = {
            name: recipe.recipeTitle,
            start: startTime,
            end: new Date(
              startTime.getTime() + recipe.readyInMinutes * 1000 * 60
            ),
            recipe: recipe,
          };
          eventOptions = [...eventOptions, cookTimeOption];
          // eat leftover servings if > 1, dont have to cook till another day
          currentDay.setDate(startTime.getDate() + recipe.servings);
          currentDay.setHours(8, 0, 0, 0);
          // added option to array, go to next recipe
          break;
        }
      }
    }
  }
  return eventOptions;
};

const NUM_SCHEDULE_OPTIONS = 3;

const getMultipleScheduleOptions = ({
  userFreeTime,
  userRecipes,
}: GPRecipeEventTypes) => {
  let scheduleOptions: GPRecipeOptionType[][] = [];
  let freeTimeArray = userFreeTime;
  let recipeArray = userRecipes;
  for (let i = 0; i < NUM_SCHEDULE_OPTIONS; i++) {
    const option = getRecipeTimeOptions({
      userFreeTime: freeTimeArray,
      userRecipes: recipeArray,
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

export { getShoppingTimeOptions, getRecipeTimeOptions, getMultipleScheduleOptions };
