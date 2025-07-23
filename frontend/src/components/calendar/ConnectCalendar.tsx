import { useEffect, useState, useRef } from "react";
import { gapi } from "gapi-script";
import { Box, Button } from "@mui/joy";
import { parseUserEvents } from "../../utils/calendarUtils";

const databaseUrl = import.meta.env.VITE_DATABASE_URL;
const calendarUrl = import.meta.env.VITE_CALENDAR_URL;
import axios from "axios";
import { axiosConfig } from "../../utils/databaseHelpers";

import type { GPUserEventTypes } from "../../utils/types";
import { findFreeTime, parseFreeTime } from "../../utils/calendarUtils";
import { useEventRec } from "../../contexts/EventRecContext";
import CalendarTimeModal from "./CalendarTimeModal";
import LoadingModal from "../utils/LoadingModal";
import { TimePreferenceString } from "../../classes/calendar/TimePreferenceString";
import type { Recipe } from "../../../../shared/Recipe";
import { useSelectedEvents } from "../../contexts/SelectedEventsContext";

const REQUESTED_DAYS = 7;

// Code adapted from https://developers.google.com/workspace/calendar/api/quickstart/js

type GPConnectCalendarTypes = {
  onClick: () => void;
  singleRecipe: boolean;
  recipeInfo: Recipe | null;
};

const ConnectCalendar = ({
  onClick,
  singleRecipe,
  recipeInfo,
}: GPConnectCalendarTypes) => {
  const { setEventOptions } = useEventRec();
  const { setSelectedEvents } = useSelectedEvents();
  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC = `${calendarUrl}/discovery/v1/apis/calendar/v3/rest`;

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES = `${calendarUrl}/auth/calendar.events`;

  const CLIENT_ID = import.meta.env.VITE_GCAL_CLIENT_ID;
  const API_KEY = import.meta.env.VITE_GCAL_API_KEY;

  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const tokenClientVar = useRef<google.accounts.oauth2.TokenClient | null>(
    null
  );

  // load on mount
  useEffect(() => {
    const gapiScript = document.createElement("script");
    gapiScript.src = "https://apis.google.com/js/api.js";
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = () => {
      gapi.load("client", async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        setGapiInited(true);
      });
    };
    document.body.appendChild(gapiScript);
    const gsiScript = document.createElement("script");
    gsiScript.src = "https://accounts.google.com/gsi/client";
    gsiScript.async = true;
    gsiScript.defer = true;
    gsiScript.onload = () => {
      setGisInited(true);
    };
    document.body.appendChild(gsiScript);
  }, []);

  useEffect(() => {
    if (gapiInited && gisInited && !tokenClientVar.current) {
      tokenClientVar.current = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (resp) => {
          if (resp.error !== undefined) {
            throw resp;
          }
          setTimeModalOpen(true);
        },
      });
    }
  }, [gapiInited, gisInited]);

  function handleAddToCalendarClick() {
    // reset selected events to ensure clean slate each time
    setSelectedEvents([]);
    if (!tokenClientVar.current) {
      return;
    }

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClientVar.current.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      setTimeModalOpen(true);
    }
  }

  async function getUserFreeTime(
    userPreferences: TimePreferenceString[],
    singleDayPrep: boolean,
    servingsPerDay: number
  ) {
    setLoading(true);
    try {
      const accessToken = gapi.client.getToken().access_token;
      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() + 1000 * 60 * 60 * 24 * REQUESTED_DAYS
      );
      const response = await axios.get(
        `${calendarUrl}/calendar/v3/calendars/primary/events`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            singleEvents: true,
            orderBy: "startTime",
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
          },
        }
      );
      const userEvents = response.data.items;
      // parse events to extract out only needed information
      const parsedUserEvents: GPUserEventTypes[] = parseUserEvents(userEvents);
      // find free spaces in calendar
      const freeTimeBlocks = findFreeTime({
        userEvents: parsedUserEvents,
        startDate,
        endDate,
        REQUESTED_DAYS,
      });
      const parsedFreeTime = parseFreeTime(freeTimeBlocks);
      if (singleRecipe && recipeInfo) {
        // suggest events for a single recipe
        const recommendedEvents = await axios.post(
          `${databaseUrl}/calendar/single/reccomendEvents`,
          { parsedFreeTime, userPreferences, recipeInfo },
          axiosConfig
        );
        const eventOptions = recommendedEvents.data;
        setEventOptions(eventOptions);
      } else {
        // suggest events for all saved recipes
        const recommendedEvents = await axios.post(
          `${databaseUrl}/calendar/reccomendEvents`,
          { parsedFreeTime, userPreferences, singleDayPrep, servingsPerDay },
          axiosConfig
        );
        // get back a list of possible options for each event (shopping + each recipe)
        const eventOptions = recommendedEvents.data;
        setEventOptions(eventOptions);
      }
      onClick();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      return;
    }
  }

  const getUserTimePreferences = async (
    preferences: TimePreferenceString[],
    singleDayPrep: boolean,
    servingsPerDay: number
  ) => {
    await getUserFreeTime(preferences, singleDayPrep, servingsPerDay);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button onClick={handleAddToCalendarClick}>
          {singleRecipe
            ? "Add Recipe To Calendar"
            : "Add All Recipes to Calendar!"}
        </Button>
      </Box>
      <CalendarTimeModal
        editMode={false}
        modalOpen={timeModalOpen}
        toggleModal={() => setTimeModalOpen((prev) => !prev)}
        onSubmit={getUserTimePreferences}
        singleRecipe={singleRecipe}
      />
      <LoadingModal modalOpen={loading} message={"Generating Schedule"} />
    </Box>
  );
};

export default ConnectCalendar;
