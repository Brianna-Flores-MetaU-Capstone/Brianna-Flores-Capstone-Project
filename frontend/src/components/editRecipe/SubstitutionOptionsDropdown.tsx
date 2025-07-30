import {
  Accordion,
  accordionClasses,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
} from "@mui/joy";
import SubstitutionOption from "./SubstitutionOption";
import type { IngredientSubstitutes } from "../../classes/ingredients/IngredientSubstitutes";

type GPSubstitutionOptionsType = {
  substitutionOptions: IngredientSubstitutes[];
};

const SubstitutionOptionsDropdown = ({
  substitutionOptions,
}: GPSubstitutionOptionsType) => {
  return (
    // Accordion styling adapted from: https://mui.com/joy-ui/react-accordion/
    <AccordionGroup sx={(theme) => ({
        [`& .${accordionClasses.root}`]: {
          marginTop: '0.5rem',
          transition: '0.2s ease',
          '& button:not([aria-expanded="true"])': {
            transition: '0.2s ease',
            paddingBottom: '0.625rem',
          },
          '& button:hover': {
            background: 'transparent',
          },
        },
        [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
          borderRadius: 'md',
          border: '2px solid',
          borderColor: 'primary.400',
        },
        '& [aria-expanded="true"]': {
          boxShadow: `inset 0 -1px 0 ${theme.vars.palette.divider}`,
        },
      })}>
      {substitutionOptions.map((option, index) => (
        <Accordion key={index}>
          <AccordionSummary>{option.substitutionTitle}</AccordionSummary>
          <AccordionDetails><SubstitutionOption optionData={option} /></AccordionDetails>
        </Accordion>
      ))}
    </AccordionGroup>
  );
};

export default SubstitutionOptionsDropdown;
