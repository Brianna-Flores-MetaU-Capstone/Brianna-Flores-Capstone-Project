import { useReducer, useEffect } from "react";
import type { GPIngredientDataTypes, GPRecipeDataTypes } from "../utils/types";
import {
  Button,
  Input,
  Grid,
  Modal,
  ModalDialog,
  ModalClose,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  DialogContent,
  Typography,
  IconButton,
} from "@mui/joy";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

type GPEditRecipeModalType = {
  recipe: GPRecipeDataTypes | undefined;
  modalOpen: boolean;
  toggleModal: () => void;
};

const actions = {
  SET_RECIPE: "setRecipe",
  SET_INPUT: "setInput",
  UPDATE_INGREDIENT: "setIngredient",
  UPDATE_INSTRUCTION: "setInstruction",
  DELETE_ITEM: "deleteItem",
  ADD_ITEM: "addItem",
} as const;

const recipeInputEditFields = [
  { label: "Recipe Title", field: "recipeTitle" },
  { label: "Servings", field: "servings" },
  { label: "Cook Time", field: "readyInMinutes" },
  { label: "Recipe URL", field: "sourceUrl" },
] as const;

const ingredientInputEditFields = [
  { label: "Ingredient Name", field: "ingredientName", space: 6 },
  { label: "Quantity", field: "quantity", space: 2 },
  { label: "Unit", field: "unit", space: 3 },
] as const;

const EditRecipeModal = ({
  recipe,
  modalOpen,
  toggleModal,
}: GPEditRecipeModalType) => {
  const initialRecipeState = recipe ?? {
    apiId: 0,
    recipeTitle: "",
    previewImage:
      "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg",
    servings: 0,
    ingredients: [],
    instructions: [],
    sourceUrl: "",
    readyInMinutes: 0,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    ingredientCostInfo: [],
    totalCost: 0,
  };

  type ACTIONTYPE =
    | {
        type: typeof actions.SET_RECIPE;
        value: GPRecipeDataTypes;
      }
    | {
        type: typeof actions.SET_INPUT;
        recipeField: keyof GPRecipeDataTypes;
        value: string;
      }
    | {
        type: typeof actions.UPDATE_INGREDIENT;
        ingredientIndex: number;
        ingredientField: keyof GPIngredientDataTypes;
        value: string;
      }
    | {
        type: typeof actions.UPDATE_INSTRUCTION;
        instructionIndex: number;
        value: string;
      }
    | {
        type: typeof actions.DELETE_ITEM;
        deletedField: keyof GPRecipeDataTypes;
        itemIndex: number;
      }
    | {
        type: typeof actions.ADD_ITEM;
        addedField: keyof GPRecipeDataTypes;
        addedItem: string | GPIngredientDataTypes;
      };

  function reducer(state: GPRecipeDataTypes, action: ACTIONTYPE) {
    switch (action.type) {
      case actions.SET_RECIPE:
        return { ...action.value };
      case actions.SET_INPUT:
        return { ...state, [action.recipeField]: action.value };
      case actions.UPDATE_INGREDIENT:
        return {
          ...state,
          ingredients: state.ingredients.map((elem, index) =>
            index === action.ingredientIndex
              ? { ...elem, [action.ingredientField]: action.value }
              : elem
          ),
        };
      case actions.UPDATE_INSTRUCTION:
        return {
          ...state,
          instructions: state.instructions.map((step, index) =>
            index === action.instructionIndex ? action.value : step
          ),
        };
      case actions.DELETE_ITEM:
        const deletedItemArray = state[action.deletedField];
        if (Array.isArray(deletedItemArray)) {
          return {
            ...state,
            [action.deletedField]: deletedItemArray.filter(
              (item, index) => index !== action.itemIndex
            ),
          };
        } else {
          return state;
        }
      case actions.ADD_ITEM:
        const addedItemArray = state[action.addedField];
        if (Array.isArray(addedItemArray)) {
          return {
            ...state,
            [action.addedField]: [...addedItemArray, action.addedItem],
          };
        } else {
          return state;
        }
      default:
        return state;
    }
  }

  const [editedRecipeData, dispatch] = useReducer(reducer, initialRecipeState);

  useEffect(() => {
    if (recipe) {
      dispatch({ type: actions.SET_RECIPE, value: recipe });
    }
  }, [recipe]);

  return (
    <Modal open={modalOpen} onClose={toggleModal}>
      <ModalDialog layout="fullscreen">
        <ModalClose />
        <DialogContent>
          <form>
            <Box>
              {recipeInputEditFields.map((field, index) => (
                <FormControl key={index}>
                  <FormLabel>{field.label}</FormLabel>
                  <Input
                    required
                    onChange={(event) =>
                      dispatch({
                        type: actions.SET_INPUT,
                        recipeField: field.field as keyof GPRecipeDataTypes,
                        value: event.target.value,
                      })
                    }
                    value={editedRecipeData[field.field]}
                  />
                </FormControl>
              ))}
              {editedRecipeData.ingredients.map(
                (ingredient, ingredientIndex) => (
                  <Grid container key={ingredientIndex} alignItems="center">
                    {ingredientInputEditFields.map((field, fieldIndex) => (
                      <Grid xs={field.space}>
                        <FormControl key={fieldIndex}>
                          <FormHelperText>{field.label}</FormHelperText>
                          <Input
                            onChange={(event) =>
                              dispatch({
                                type: actions.UPDATE_INGREDIENT,
                                ingredientIndex: ingredientIndex,
                                ingredientField:
                                  field.field as keyof GPIngredientDataTypes,
                                value: event.target.value,
                              })
                            }
                            value={ingredient[field.field]}
                          />
                        </FormControl>
                      </Grid>
                    ))}
                    <Grid xs={1}>
                      <IconButton
                        onClick={(event) =>
                          dispatch({
                            type: actions.DELETE_ITEM,
                            deletedField: "ingredients",
                            itemIndex: ingredientIndex,
                          })
                        }
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                )
              )}
              <IconButton
                sx={{ justifySelf: "flex-end" }}
                onClick={(event) =>
                  dispatch({
                    type: actions.ADD_ITEM,
                    addedField: "ingredients",
                    addedItem: {id: 0, ingredientName: "", quantity: 0, unit: "", department: "", isChecked: false}
                  })
                }
              >
                <AddCircleOutlineIcon />
              </IconButton>
              {editedRecipeData.instructions.map((step, index) => (
                <Grid container key={index} sx={{ alignItems: "center" }}>
                  <Grid xs={1}>
                    <Typography>#{index + 1}</Typography>
                  </Grid>
                  <Grid xs={10}>
                    <FormControl>
                      <Input
                        required
                        onChange={(event) =>
                          dispatch({
                            type: actions.UPDATE_INSTRUCTION,
                            instructionIndex: index,
                            value: event.target.value,
                          })
                        }
                        value={step}
                      />
                    </FormControl>
                  </Grid>
                  <Grid xs={1}>
                    <IconButton
                      onClick={(event) =>
                        dispatch({
                          type: actions.DELETE_ITEM,
                          deletedField: "instructions",
                          itemIndex: index,
                        })
                      }
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <IconButton
                sx={{ justifySelf: "flex-end" }}
                onClick={(event) =>
                  dispatch({
                    type: actions.ADD_ITEM,
                    addedField: "instructions",
                    addedItem: "",
                  })
                }
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Box>
            <Button type="submit">Update Recipe!</Button>
          </form>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default EditRecipeModal;
