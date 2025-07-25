import { createContext, useState, useContext } from "react";
import type { GPRecipeEventOptionType } from "../utils/types/types";

type GPSelectedEventContextType = {
  selectedEvents: GPRecipeEventOptionType[];
  setSelectedEvents: React.Dispatch<
    React.SetStateAction<GPRecipeEventOptionType[]>
  >;
};

const SelectedEventsContext = createContext<GPSelectedEventContextType>({
  selectedEvents: [],
  setSelectedEvents: () => {},
});

export const SelectedEventsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedEvents, setSelectedEvents] = useState<
    GPRecipeEventOptionType[]
  >([]);

  return (
    <SelectedEventsContext.Provider
      value={{ selectedEvents, setSelectedEvents }}
    >
      {children}
    </SelectedEventsContext.Provider>
  );
};

export const useSelectedEvents = () => useContext(SelectedEventsContext);
