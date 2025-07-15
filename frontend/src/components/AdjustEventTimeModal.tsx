import React from "react";
import { useState } from "react";
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
} from "@mui/joy";
import { EventTimeEnum } from "../utils/constants";

type GPEventTimeModal = {
  eventInfo: GPRecipeEventOptionType;
  setEventOptions: (data: GPRecipeEventOptionType) => void;
};

const AdjustEventTimeModal = ({
  eventInfo,
  setEventOptions,
}: GPEventTimeModal) => {
  // Modal code referenced from https://mui.com/joy-ui/react-modal/
  const [open, setOpen] = React.useState<boolean>(false);
  const eventStartTime = new Date(eventInfo.start);
  const eventEndTime = new Date(eventInfo.end);
  const [start, setStart] = useState(eventStartTime.toLocaleTimeString([], { hour12: false, hour: "numeric", minute: "numeric" }))
  const [end, setEnd] = useState(eventEndTime.toLocaleTimeString([], { hour12: false, hour: "numeric", minute: "numeric" }))

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { time } = (event.target as HTMLInputElement).dataset;
    const { value } = event.target;
    if (time === EventTimeEnum.START) {
      eventStartTime.setHours(parseInt(value.substring(0, 2)));
      eventStartTime.setMinutes(parseInt(value.substring(3)));
      setStart(eventStartTime.toLocaleTimeString([], { hour12: false, hour: "numeric", minute: "numeric" }))
    } else if (time === EventTimeEnum.END) {
      eventEndTime.setHours(parseInt(value.substring(0, 2)));
      eventEndTime.setMinutes(parseInt(value.substring(3)));
      setEnd(eventEndTime.toLocaleTimeString([], { hour12: false, hour: "numeric", minute: "numeric" }))
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
          <form>
            <FormControl>
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
            <FormControl>
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
            </FormControl>
          </form>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
};

export default AdjustEventTimeModal;
