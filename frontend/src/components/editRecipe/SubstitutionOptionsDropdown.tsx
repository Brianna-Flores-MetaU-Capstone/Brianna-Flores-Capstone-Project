import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
} from "@mui/joy";
import type { GPAiSubstitutionReturnType } from "../../utils/types/aiSubReturnType";
import SubstitutionOption from "./SubstitutionOption";

type GPSubstitutionOptionsType = {
  substitutionOptions: GPAiSubstitutionReturnType[];
};

const SubstitutionOptionsDropdown = ({
  substitutionOptions,
}: GPSubstitutionOptionsType) => {
  return (
    <AccordionGroup>
      {substitutionOptions.map((option, index) => (
        <Accordion>
          <AccordionSummary>{option.substitutionTitle}</AccordionSummary>
          <AccordionDetails><SubstitutionOption optionData={option} /></AccordionDetails>
        </Accordion>
      ))}
    </AccordionGroup>
  );
};

export default SubstitutionOptionsDropdown;
