import React from "react";
import { useState, useEffect } from "react";
import type { GPRecipeEventOptionType } from "../utils/types";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  Sheet,
  Typography,
  FormHelperText,
} from "@mui/joy";
import InfoOutlined from "@mui/icons-material/InfoOutline";

import { EventTimeEnum } from "../utils/constants";
import { useEventRec } from "../contexts/EventRecContext";

type GPEventTimeModal = {
  eventInfo: GPRecipeEventOptionType;
  groupNum: number;
};

const AdjustEventTimeModal = ({
  eventInfo,
  groupNum,
}: 
GPEventTimeModal) => {
  // Modal code referenced from https://mui.com/joy-ui/react-modal/
  const eventStartTime = new Date(eventInfo.start);
  const eventEndTime = new Date(eventInfo.end);
  const [open, setOpen] = React.useState<boolean>(false);
  const [start, setStart] = useState(
    eventStartTime.toLocaleTimeString([], {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    })
  );
  const [end, setEnd] = useState(
    eventEndTime.toLocaleTimeString([], {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    })
  );
  const [inputError, setInputError] = useState(false);
  const { eventOptions, setEventOptions } = useEventRec();

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { time } = (event.target as HTMLInputElement).dataset;
    const { value } = event.target;
    if (time === EventTimeEnum.START) {
      setStart(value);
    } else if (time === EventTimeEnum.END) {
      setEnd(value);
    }
  };

  useEffect(() => {
    setInputError(start > end);
  }, [start, end]);

  const onTimeChangeSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    eventStartTime.setHours(parseInt(start.substring(0, 2)));
    eventStartTime.setMinutes(parseInt(start.substring(3)));
    eventEndTime.setHours(parseInt(end.substring(0, 2)));
    eventEndTime.setMinutes(parseInt(end.substring(3)));
    const updatedEvent = {
      ...eventInfo,
      start: eventStartTime,
      end: eventEndTime,
    };
    if (eventOptions) {
      setEventOptions((prev) => {
        const updatedEventOptions = [...prev]
        updatedEventOptions[groupNum] = prev[groupNum].map((eventInfo) => eventInfo.name === updatedEvent.name ? updatedEvent : eventInfo)
        return updatedEventOptions
      })
      setOpen(false)
    }
  };

  return (
    <React.Fragment>
      <Button
        size="md"
        color="primary"
        aria-label="Adjust event recommendation"
        sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
        onClick={() => setOpen(true)}
      >
        Adjust Time
      </Button>
      <Modal
        aria-labelledby="adjust-event-time-modal"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{ width: 400, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: "lg", mb: 1 }}
          >
            Adjust Event Time
          </Typography>
          <form onSubmit={onTimeChangeSubmit}>
            <FormControl error={inputError}>
              <FormLabel>New Start Time</FormLabel>
              <Input
                type="time"
                onChange={handleTimeChange}
                value={start}
                slotProps={{
                  input: {
                    "data-time": EventTimeEnum.START,
                  },
                }}
                required
              />
            </FormControl>
            <FormControl error={inputError}>
              <FormLabel>New End Time</FormLabel>
              <Input
                type="time"
                onChange={handleTimeChange}
                value={end}
                slotProps={{
                  input: {
                    "data-time": EventTimeEnum.END,
                  },
                }}
                required
              />
              {inputError && (
                <FormHelperText>
                  <InfoOutlined />
                  End time must be after start
                </FormHelperText>
              )}
            </FormControl>
            <Button
              type="submit"
              disabled={inputError}
              sx={{ display: "flex", mx: "auto", mt: 2 }}
            >
              Adjust Time
            </Button>
          </form>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
};

export default AdjustEventTimeModal;
