import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { Box, Button } from "@mui/joy";

// Code adapted from https://developers.google.com/workspace/calendar/api/quickstart/js

const ConnectCalendar = () => {
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
          await listUpcomingEvents();
        },
      });
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
      tokenClient.requestAccessToken({ prompt: "" });
    }
  }

  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token, () => {});
      gapi.client.setToken(null);
    }
  }

  async function listUpcomingEvents() {
    try {
      const accessToken = gapi.client.getToken().access_token;
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
    } catch (err) {
      return;
    }
  }

  return (
    <Box>
      <Button onClick={handleAuthClick}>Connect to Google Calendar</Button>
      <Button onClick={handleSignoutClick}>Sign out</Button>
    </Box>
  );
};

export default ConnectCalendar;
