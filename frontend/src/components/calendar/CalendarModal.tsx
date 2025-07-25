import { useState, useEffect } from "react";
import {
  Modal,
  ModalClose,
  ModalDialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/joy";
import CalendarOptionGroup from "./CalendarOptionGroup";
import TitledListView from "../utils/TitledListView";
import LoadingModal from "../utils/LoadingModal";
import ErrorState from "../utils/ErrorState";
import { useEventRec } from "../../contexts/EventRecContext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useSelectedEvents } from "../../contexts/SelectedEventsContext";
import {
  ColumnNoOverflowTitledListStyle,
  MUI_GRID_FULL_SPACE,
} from "../../utils/style/UIStyle";

import { gapi } from "gapi-script";
import type { GPErrorMessageTypes } from "../../utils/types/types";
import { CalendarEvent } from "../../classes/calendar/CalendarEvent";
import { saveCalendarEvent } from "../../utils/databaseHelpers";
import CalendarTourTooltip from "./CalendarTourTooltip";
import { CalendarRecipesModalTour } from "../../utils/calendarTour/CalendarTourSteps";

type GPCalendarModalTypes = {
  modalOpen: boolean;
  toggleModal: () => void;
  setCreatedEvents: (value: CalendarEvent[]) => void;
};

const CalendarModal = ({
  modalOpen,
  toggleModal,
  setCreatedEvents,
}: GPCalendarModalTypes) => {
  const { eventOptions } = useEventRec();
  const { selectedEvents } = useSelectedEvents();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [tourActive, setTourActive] = useState(modalOpen);

  useEffect(() => {
    if (modalOpen) {
      setTourActive(true);
    }
  }, [modalOpen]);

  const verifyDate = (dateToCheck: Date | string) => {
    if (typeof dateToCheck === "object") {
      return dateToCheck;
    } else {
      return new Date(dateToCheck);
    }
  };

  const onEventConfirmation = async () => {
    const token = gapi.client.getToken();
    if (!token) {
      setMessage({
        error: true,
        message: "Not authenticated, refresh and try again",
      });
      return;
    }
    setLoading(true);
    let createdEvents: CalendarEvent[] = [];
    for (const eventInfo of selectedEvents) {
      const newEvent = {
        summary: `Cook ${eventInfo.name}`,
        start: {
          dateTime: verifyDate(eventInfo.timeOptions[0].start).toISOString(),
        },
        end: {
          dateTime: verifyDate(eventInfo.timeOptions[0].end).toISOString(),
        },
        source: {
          title: `${eventInfo.name} recipe link`,
          url: eventInfo.recipe.sourceUrl,
        },
      };
      const request = await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: newEvent,
      });
      const eventData = request.result;
      if (
        eventData.htmlLink &&
        eventData.summary &&
        eventData.start?.dateTime &&
        eventData.end?.dateTime
      ) {
        const newEvent = new CalendarEvent(
          eventData.summary,
          eventData.start.dateTime,
          eventData.end.dateTime,
          eventData.htmlLink,
        );
        createdEvents = [...createdEvents, newEvent];
        const savedCalendarEvent = await saveCalendarEvent({
          setMessage,
          selectedRecipe: eventInfo.recipe,
          calendarEvent: newEvent,
        });
      }
    }
    setCreatedEvents(createdEvents);
    setLoading(false);
    setMessage(undefined);
    toggleModal();
  };

  return (
    <>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={modalOpen}
        onClose={toggleModal}
      >
        <ModalDialog layout="fullscreen">
          <ModalClose variant="plain" sx={{ zIndex: 2, m: 1 }} />
          <DialogContent sx={{ my: 4 }}>
            <TitledListView
              headerList={[
                { title: "Event Option Groups", spacing: MUI_GRID_FULL_SPACE },
              ]}
              itemsList={eventOptions ?? []}
              renderItem={(optionGroup, index) => (
                <CalendarOptionGroup
                  key={index}
                  eventOptions={optionGroup}
                  groupNum={index + 1}
                  adjustedSuggestion={false}
                />
              )}
              listItemsStyle={ColumnNoOverflowTitledListStyle}
            />
          </DialogContent>
          {message && (
            <ErrorState error={message.error} message={message.message} />
          )}
          <IconButton
            id="confirmSelections"
            aria-label="Accept Event Group Recommendation"
            variant="outlined"
            color="success"
            size="lg"
            onClick={onEventConfirmation}
          >
            <CheckCircleOutlineIcon />
            <Typography>Confirm Selections</Typography>
          </IconButton>
        </ModalDialog>
      </Modal>
      <LoadingModal modalOpen={loading} message="Adding events to calendar" />
      <CalendarTourTooltip
        tourSteps={CalendarRecipesModalTour}
        tourActive={tourActive}
        onClose={() => setTourActive(false)}
      />
    </>
  );
};

export default CalendarModal;
