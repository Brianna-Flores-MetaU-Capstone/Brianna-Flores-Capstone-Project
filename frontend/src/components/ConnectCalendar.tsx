import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { Box, Button } from "@mui/joy";
import { parseUserEvents } from "../utils/calendarUtils";

const databaseUrl = import.meta.env.VITE_DATABASE_URL;
import axios from "axios";
import { axiosConfig } from "../utils/databaseHelpers";

import type { GPUserEventTypes, GPRecipeEventOptionType, GPRecipeDataTypes } from "../utils/types";
import { findFreeTime, parseFreeTime } from "../utils/calendarUtils";

// TODO change requested days to have user input
const REQUESTED_DAYS = 7;

// Code adapted from https://developers.google.com/workspace/calendar/api/quickstart/js

type GPConnectCalendarTypes = {
    onClick: () => void
    setEvents: (data: GPRecipeEventOptionType[][]) => void;
    userSelectedRecipes: GPRecipeDataTypes[]
}

const ConnectCalendar = ({onClick, setEvents, userSelectedRecipes}: GPConnectCalendarTypes) => {
  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

  const CLIENT_ID = import.meta.env.VITE_GCAL_CLIENT_ID;
  const API_KEY = import.meta.env.VITE_GCAL_API_KEY;

  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  let tokenClient: google.accounts.oauth2.TokenClient;

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
    if (gapiInited && gisInited && !tokenClient) {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (resp) => {
          if (resp.error !== undefined) {
            throw resp;
          }
          await getUserFreeTime();
        },
      });
    }
    if (gapiInited && gisInited) {
      const token = gapi.client.getToken();
      if (token) {
        getUserFreeTime();
      }
    }
  }, [gapiInited, gisInited]);

  useEffect(() => {
    if (gapiInited && gisInited) {
      const token = gapi.client.getToken();
      if (token) {
        getUserFreeTime();
      }
    }
  }, [gapiInited, gisInited]);

  function handleAuthClick() {
    if (!tokenClient) {
      return;
    }

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      getUserFreeTime();
    }
  }

  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token, () => {});
      gapi.client.setToken(null);
    }
  }

  async function getUserFreeTime() {
    try {
      const accessToken = gapi.client.getToken().access_token;
      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() + 1000 * 60 * 60 * 24 * REQUESTED_DAYS
      );
      const response = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
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
      const reccomendedEvents = await axios.post(
        `${databaseUrl}/calendar/reccomendEvents`,
        { parsedFreeTime, userSelectedRecipes },
        axiosConfig
      );
      // get back a list of possible options for each event (shopping + each recipe)
      const eventOptions = reccomendedEvents.data;
      setEvents(eventOptions)
      onClick();
      // TODO set state variable held within new-list-page to hold the list of generated event options
      
      // within new list convert to local time zone and present options to user
    } catch (err) {
      return;
    }
  }

  return (
    <Box>
      <Button onClick={handleAuthClick}>Add to Calendar!</Button>
      <Button onClick={handleSignoutClick}>Signout</Button>
    </Box>
  );
};

export default ConnectCalendar;
