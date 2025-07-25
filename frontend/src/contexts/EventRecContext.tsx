import { createContext, useState, useContext } from "react";
import type { GPRecipeEventOptionType } from "../utils/types";

type GPEventContextType = {
  eventOptions: GPRecipeEventOptionType[][] | null;
  setEventOptions: React.Dispatch<
    React.SetStateAction<GPRecipeEventOptionType[][]>
  >;
};

const EventRecContext = createContext<GPEventContextType>({
  eventOptions: null,
  setEventOptions: () => {},
});

export const EventRecProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [eventOptions, setEventOptions] = useState<GPRecipeEventOptionType[][]>(
    [],
  );
  return (
    <EventRecContext.Provider value={{ eventOptions, setEventOptions }}>
      {children}
    </EventRecContext.Provider>
  );
};

export const useEventRec = () => useContext(EventRecContext);
