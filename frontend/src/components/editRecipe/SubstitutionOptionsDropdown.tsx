import {
  Accordion,
  accordionClasses,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Typography,
} from "@mui/joy";
import SubstitutionOption from "./SubstitutionOption";
import type { IngredientSubstitutes } from "../../classes/ingredients/IngredientSubstitutes";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import type { IngredientData } from "../../../../shared/IngredientData";

type GPSubstitutionOptionsType = {
  ingredientIndex: number;
  originalIngredient: IngredientData;
  onSubstitutionSelect: (
    option: IngredientSubstitutes,
    index: number,
    originalIngredientName: string
  ) => void;
};

const SubstitutionOptionsDropdown = ({
  ingredientIndex,
  originalIngredient,
  onSubstitutionSelect,
}: GPSubstitutionOptionsType) => {
  const handleSelectSubstitution = (
    option: IngredientSubstitutes,
    ingredientIndex: number
  ) => {
    onSubstitutionSelect(
      option,
      ingredientIndex,
      originalIngredient.ingredientName
    );
  };

  return (
    // Accordion styling adapted from: https://mui.com/joy-ui/react-accordion/
    <AccordionGroup
      sx={(theme) => ({
        [`& .${accordionClasses.root}`]: {
          marginTop: "0.5rem",
          transition: "0.2s ease",
          '& button:not([aria-expanded="true"])': {
            transition: "0.2s ease",
            paddingBottom: "0.625rem",
          },
          "& button:hover": {
            background: "transparent",
          },
        },
        [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
          borderRadius: "md",
          border: "2px solid",
          borderColor: "primary.400",
        },
        '& [aria-expanded="true"]': {
          boxShadow: `inset 0 -1px 0 ${theme.vars.palette.divider}`,
        },
      })}
    >
      {originalIngredient.ingredientSubstitutes.map((option, index) => (
        <Accordion key={index}>
          <AccordionSummary
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ display: "flex", gap: 5, alignItems: "center" }}>
              <CheckCircleOutlineIcon
                onClick={(event) => {
                  event.stopPropagation();
                  handleSelectSubstitution(option, ingredientIndex);
                }}
                sx={{
                  color: "primary.500",
                  "&:hover": { color: "success.200" },
                }}
              />
              {option.substitutionTitle}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SubstitutionOption optionData={option} />
          </AccordionDetails>
        </Accordion>
      ))}
    </AccordionGroup>
  );
};

export default SubstitutionOptionsDropdown;
