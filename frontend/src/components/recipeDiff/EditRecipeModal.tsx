import { useReducer, useEffect, useState } from "react";
import type {
  GPErrorMessageTypes,
  GPIngredientDataTypes,
  GPRecipeDataTypes,
} from "../../utils/types";
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
import TitledListView from "../utils/TitledListView";
import {
  MUI_GRID_FULL_SPACE,
  RecipeTagsTitledListStyle,
} from "../../utils/UIStyle";
import { useUser } from "../../contexts/UserContext";
import { updateUserRecipes } from "../../utils/databaseHelpers";
import { Recipe } from "../../classes/recipe/Recipe";

type GPEditRecipeModalType = {
  recipe: Recipe | undefined;
  modalOpen: boolean;
  toggleModal: () => void;
};

const actions = {
  SET_RECIPE: "setRecipe",
  SET_INPUT: "setInput",
  SET_INPUT_NUM: "setInputNum",
  SET_DIETARY_TAGS: "toggleTag",
  UPDATE_INGREDIENT: "setIngredient",
  UPDATE_INSTRUCTION: "setInstruction",
  DELETE_ITEM: "deleteItem",
  ADD_ITEM: "addItem",
} as const;

const EditRecipeFieldsEnum = {
  TITLE: "recipeTitle",
  SERVINGS: "servings",
  READY_IN: "readyInMinutes",
  EDITOR: "editingAuthorName",
  URL: "sourceUrl",
  ING_NAME: "ingredientName",
  ING_QUANTITY: "quantity",
  ING_UNIT: "unit",
} as const;

const recipeInputEditFields = [
  { label: "Recipe Title", field: EditRecipeFieldsEnum.TITLE, spacing: 12 },
  { label: "Servings", field: EditRecipeFieldsEnum.SERVINGS, spacing: 2 },
  { label: "Cook Time", field: EditRecipeFieldsEnum.READY_IN, spacing: 4 },
  { label: "Editor Username", field: EditRecipeFieldsEnum.EDITOR, spacing: 6 },
  { label: "Recipe URL", field: EditRecipeFieldsEnum.URL, spacing: 12 },
] as const;

const ingredientInputEditFields = [
  { label: "Ingredient Name", field: EditRecipeFieldsEnum.ING_NAME, space: 6 },
  { label: "Quantity", field: EditRecipeFieldsEnum.ING_QUANTITY, space: 2 },
  { label: "Unit", field: EditRecipeFieldsEnum.ING_UNIT, space: 3 },
] as const;

const dietaryEditFields = [
  { label: "Dairy Free", field: "dairyFree" },
  { label: "Gluten Free", field: "glutenFree" },
  { label: "Vegetarian", field: "vegetarian" },
  { label: "Vegan", field: "vegan" },
];

const EditRecipeModal = ({
  recipe,
  modalOpen,
  toggleModal,
}: GPEditRecipeModalType) => {
  const initialRecipeState = recipe ?? {
    id: 0,
    apiId: 0,
    originalSource: "",
    editingAuthorName: "",
    editingAuthorId: null,
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
    recipeTags: [],
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
        type: typeof actions.SET_INPUT_NUM;
        recipeField: keyof GPRecipeDataTypes;
        value: number;
      }
    | {
        type: typeof actions.SET_DIETARY_TAGS;
        dietTag: keyof GPRecipeDataTypes;
        dietLabel: string;
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
      case actions.SET_INPUT_NUM:
        return { ...state, [action.recipeField]: action.value };
      case actions.SET_DIETARY_TAGS:
        let updatedRecipeTags = [...state.recipeTags];
        if (state[action.dietTag]) {
          // previously selected, remove from recipe tags
          const index = updatedRecipeTags.indexOf(action.dietLabel);
          updatedRecipeTags.splice(index, 1);
        } else {
          updatedRecipeTags = [...state.recipeTags, action.dietLabel];
        }
        return {
          ...state,
          [action.dietTag]: !state[action.dietTag],
          recipeTags: updatedRecipeTags,
        };
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
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const { user } = useUser();

  useEffect(() => {
    if (recipe) {
      dispatch({ type: actions.SET_RECIPE, value: recipe });
    }
  }, [recipe]);

  const handleRecipeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      setMessage({ error: true, message: "Error user not signed in" });
      return;
    }
    const newRecipe = new Recipe(editedRecipeData.apiId, editedRecipeData.originalSource, editedRecipeData.recipeTitle, editedRecipeData.previewImage, editedRecipeData.servings, editedRecipeData.ingredients, editedRecipeData.instructions, editedRecipeData.sourceUrl, editedRecipeData.readyInMinutes, editedRecipeData.vegetarian, editedRecipeData.vegan, editedRecipeData.glutenFree, editedRecipeData.dairyFree, editedRecipeData.recipeTags, editedRecipeData.editingAuthorId, editedRecipeData.id, editedRecipeData.editingAuthorName)
    try {
      const userId = user.id;
      await updateUserRecipes({
        editedRecipe: true,
        userId,
        selectedRecipe: newRecipe,
        setMessage,
      });
    } catch (error) {
      setMessage({ error: true, message: "Error adding recipe" });
    }
  };

  return (
    <Modal open={modalOpen} onClose={toggleModal}>
      <ModalDialog layout="fullscreen">
        <ModalClose sx={{ zIndex: 2 }} />
        <DialogContent>
          <form onSubmit={handleRecipeSubmit}>
            <Box>
              <Box sx={{ m: 1 }}>
                <Grid container spacing={2} sx={{ alignItems: "flex-end" }}>
                  <Grid container xs={9}>
                    <Grid
                      sx={{
                        flexGrow: 1,
                        p: 2,
                        bgcolor: "primary.300",
                        borderRadius: "md",
                      }}
                    >
                      <Typography level="h4">Edit Recipe</Typography>
                    </Grid>
                    {recipeInputEditFields.map((field, index) => (
                      <Grid key={index} xs={field.spacing}>
                        <FormControl>
                          <FormLabel>{field.label}</FormLabel>
                          <Input
                            required
                            type={
                              field.field === EditRecipeFieldsEnum.SERVINGS ||
                              field.field === EditRecipeFieldsEnum.READY_IN
                                ? "number"
                                : "text"
                            }
                            onChange={(event) => {
                              field.field === EditRecipeFieldsEnum.SERVINGS ||
                              field.field === EditRecipeFieldsEnum.READY_IN
                                ? dispatch({
                                    type: actions.SET_INPUT_NUM,
                                    recipeField: field.field,
                                    value: parseInt(event.target.value),
                                  })
                                : dispatch({
                                    type: actions.SET_INPUT,
                                    recipeField: field.field,
                                    value: event.target.value,
                                  });
                            }}
                            value={editedRecipeData[field.field] ?? ""}
                          />
                        </FormControl>
                      </Grid>
                    ))}
                  </Grid>
                  <Grid xs={3}>
                    <TitledListView
                      itemsList={dietaryEditFields}
                      headerList={[
                        { title: "Recipe Tags", spacing: MUI_GRID_FULL_SPACE },
                      ]}
                      renderItem={(tag, index) => (
                        <Button
                          key={index}
                          sx={{ p: 1 }}
                          value={tag.field}
                          variant={
                            editedRecipeData[
                              tag.field as keyof GPRecipeDataTypes
                            ]
                              ? "solid"
                              : "plain"
                          }
                          onClick={() =>
                            dispatch({
                              type: actions.SET_DIETARY_TAGS,
                              dietTag: tag.field as keyof GPRecipeDataTypes,
                              dietLabel: tag.label,
                            })
                          }
                        >
                          {tag.label}
                        </Button>
                      )}
                      listItemsStyle={RecipeTagsTitledListStyle}
                    />
                  </Grid>
                </Grid>
              </Box>
              <TitledListView
                itemsList={editedRecipeData.ingredients}
                headerList={[
                  { title: "Ingredients", spacing: MUI_GRID_FULL_SPACE },
                ]}
                renderItem={(ingredient, ingredientIndex) => (
                  <Grid container key={ingredientIndex} alignItems="center">
                    {ingredientInputEditFields.map((field, fieldIndex) => (
                      <Grid key={fieldIndex} xs={field.space}>
                        <FormControl>
                          <FormHelperText>{field.label}</FormHelperText>
                          <Input
                            type={
                              field.field === EditRecipeFieldsEnum.ING_QUANTITY
                                ? "number"
                                : "text"
                            }
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
                        onClick={() =>
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
                )}
              />
              <IconButton
                sx={{ justifySelf: "flex-end" }}
                onClick={() =>
                  dispatch({
                    type: actions.ADD_ITEM,
                    addedField: "ingredients",
                    addedItem: {
                      id: 0,
                      ingredientName: "",
                      quantity: 0,
                      unit: "",
                      department: "",
                      isChecked: false,
                    },
                  })
                }
              >
                <AddCircleOutlineIcon />
              </IconButton>
              <TitledListView
                headerList={[
                  { title: "Instructions", spacing: MUI_GRID_FULL_SPACE },
                ]}
                itemsList={editedRecipeData.instructions}
                renderItem={(step, index) => (
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
                        onClick={() =>
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
                )}
              />
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
