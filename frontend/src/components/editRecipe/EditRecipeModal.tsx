import { useReducer, useEffect, useState } from "react";
import type {
  GPErrorMessageTypes,
  GPRecipeDataTypes,
} from "../../utils/types/types";
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
  Textarea,
  AspectRatio,
} from "@mui/joy";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import TitledListView from "../utils/TitledListView";
import {
  MUI_GRID_FULL_SPACE,
  RecipeTagsTitledListStyle,
} from "../../utils/style/UIStyle";
import { useUser } from "../../contexts/UserContext";
import { updateUserRecipes } from "../../utils/databaseHelpers";
import { Recipe } from "../../../../shared/Recipe";
import InfoOutlined from "@mui/icons-material/InfoOutline";
import ImageSearchModal from "./ImageSearchModal";
import { getSubstitutionForIngredient } from "../../utils/geminiApi";
import SubstitutionOptionsDropdown from "./SubstitutionOptionsDropdown";
import { IngredientData } from "../../../../shared/IngredientData";
import type { GPAiSubstitutionReturnType } from "../../utils/types/aiSubReturnType";

const actions = {
  SET_RECIPE: "setRecipe",
  SET_INPUT: "setInput",
  ADD_IMAGE: "addImage",
  DELETE_IMAGE: "deleteImage",
  SET_INPUT_NUM: "setInputNum",
  SET_DIETARY_TAGS: "toggleTag",
  UPDATE_INGREDIENT: "setIngredient",
  ADD_SUBSTITUTES: "addSubstitutes",
  UPDATE_INSTRUCTION: "setInstruction",
  DELETE_ITEM: "deleteItem",
  ADD_ITEM: "addItem",
  ADD_SUBSTITUTE_INSTRUCTIONS: "addSubstituteInstructions",
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
  ING_SUBSTITUTES: "ingredientSubstitutes",
} as const;

const recipeInputEditFields = [
  { label: "Recipe Title", field: EditRecipeFieldsEnum.TITLE, spacing: 12 },
  { label: "Servings", field: EditRecipeFieldsEnum.SERVINGS, spacing: 2 },
  {
    label: "Cook Time (in minutes)",
    field: EditRecipeFieldsEnum.READY_IN,
    spacing: 4,
  },
  { label: "Editor Username", field: EditRecipeFieldsEnum.EDITOR, spacing: 6 },
  { label: "Recipe URL", field: EditRecipeFieldsEnum.URL, spacing: 12 },
] as const;

const ingredientInputEditFields = [
  { label: "Ingredient Name", field: EditRecipeFieldsEnum.ING_NAME, space: 6 },
  { label: "Quantity", field: EditRecipeFieldsEnum.ING_QUANTITY, space: 2 },
  { label: "Unit", field: EditRecipeFieldsEnum.ING_UNIT, space: 2 },
] as const;

const dietaryEditFields = [
  { label: "Dairy Free", field: "dairyFree" },
  { label: "Gluten Free", field: "glutenFree" },
  { label: "Vegetarian", field: "vegetarian" },
  { label: "Vegan", field: "vegan" },
];

const GPImageDisplayContainerStyle = {
  display: "flex",
  gap: 2,
};

const GPImageCardStyle = {
  width: 250,
};

const GPDeleteIconStyle = {
  position: "relative",
  bottom: 45,
  left: 10,
};

type GPEditRecipeModalType = {
  recipe: Recipe | undefined;
  modalOpen: boolean;
  getDietarySubstitutes: boolean;
  toggleModal: () => void;
  onSubmit: () => void;
};

const EditRecipeModal = ({
  recipe,
  modalOpen,
  getDietarySubstitutes,
  toggleModal,
  onSubmit,
}: GPEditRecipeModalType) => {
  const initialRecipeState = recipe ?? {
    id: 0,
    apiId: 0,
    originalSource: "",
    editingAuthorName: "",
    editingAuthorId: null,
    recipeTitle: "",
    previewImage: [
      "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg",
    ],
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
        type: typeof actions.ADD_IMAGE;
        value: Set<string>;
      }
    | {
        type: typeof actions.DELETE_IMAGE;
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
        ingredientField: keyof IngredientData;
        value: string;
      }
    | {
        type: typeof actions.ADD_SUBSTITUTES;
        ingredientIndex: number;
        value: GPAiSubstitutionReturnType[];
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
        addedItem: string | IngredientData;
      }
    | {
        type: typeof actions.ADD_SUBSTITUTE_INSTRUCTIONS;
        addedInstructions: string[];
        originalIngredient: string;
        substituteIngredient: string;
      };

  const [inputError, setInputError] = useState(false);
  const [editedRecipeData, dispatch] = useReducer(reducer, initialRecipeState);
  const [_, setMessage] = useState<GPErrorMessageTypes>();
  const [imageSearchModalOpen, setImageSearchModalOpen] = useState(false);
  const [loadingSubstitutions, setLoadingSubstitutions] = useState(false);
  const { user } = useUser();

  function reducer(state: GPRecipeDataTypes, action: ACTIONTYPE) {
    switch (action.type) {
      case actions.SET_RECIPE:
        return { ...action.value };
      case actions.SET_INPUT:
        setInputError(action.value === "");
        return { ...state, [action.recipeField]: action.value };
      case actions.SET_INPUT_NUM:
        setInputError(action.value <= 0);
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
      case actions.ADD_IMAGE:
        return {
          ...state,
          previewImage: [...state.previewImage, ...action.value],
        };
      case actions.DELETE_IMAGE:
        return {
          ...state,
          previewImage: state.previewImage.filter(
            (imageUrl) => imageUrl !== action.value
          ),
        };
      case actions.UPDATE_INGREDIENT:
        setInputError(
          action.ingredientField === EditRecipeFieldsEnum.ING_QUANTITY &&
            parseFloat(action.value) <= 0
        );
        return {
          ...state,
          ingredients: state.ingredients.map((elem, index) =>
            index === action.ingredientIndex
              ? { ...elem, [action.ingredientField]: action.value }
              : elem
          ),
        };
      case actions.ADD_SUBSTITUTES:
        return {
          ...state,
          ingredients: state.ingredients.map((elem, index) =>
            index === action.ingredientIndex
              ? { ...elem, ["ingredientSubstitutes"]: action.value }
              : elem
          ),
        };
      case actions.UPDATE_INSTRUCTION:
        setInputError(action.value === "");
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
              (_, index) => index !== action.itemIndex
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
      case actions.ADD_SUBSTITUTE_INSTRUCTIONS:
        // go through instructions and replace all instances of original ingredient with new ingredient
        const replacedInstructions = state.instructions.map((instruction) =>
          instruction
            .toLowerCase()
            .replace(
              `${action.originalIngredient.toLowerCase()} `,
              `${action.substituteIngredient.toLowerCase()} `
            )
        );
        return {
          ...state,
          instructions: [...action.addedInstructions, ...replacedInstructions],
        };
      default:
        return state;
    }
  }

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
    const newRecipe = new Recipe(
      editedRecipeData.apiId,
      editedRecipeData.originalSource,
      editedRecipeData.recipeTitle,
      editedRecipeData.previewImage,
      editedRecipeData.servings,
      editedRecipeData.ingredients,
      editedRecipeData.instructions,
      editedRecipeData.sourceUrl,
      editedRecipeData.readyInMinutes,
      editedRecipeData.vegetarian,
      editedRecipeData.vegan,
      editedRecipeData.glutenFree,
      editedRecipeData.dairyFree,
      editedRecipeData.recipeTags,
      0,
      editedRecipeData.editingAuthorId,
      editedRecipeData.id,
      editedRecipeData.editingAuthorName
    );
    try {
      const userId = user.id;
      await updateUserRecipes({
        editedRecipe: true,
        userId,
        selectedRecipe: newRecipe,
        setMessage,
      });
      toggleModal();
      onSubmit();
    } catch (error) {
      setMessage({ error: true, message: "Error adding recipe" });
    }
  };

  const handleNewImages = (selectedImages: Set<string>) => {
    dispatch({
      type: actions.ADD_IMAGE,
      value: selectedImages,
    });
  };

  const handleSuggestIngredientSubstitution = async (
    ingredient: IngredientData,
    index: number
  ) => {
    setLoadingSubstitutions(true);
    const response: GPAiSubstitutionReturnType[] =
      await getSubstitutionForIngredient({
        ingredient,
        intolerancesAndDiets: [
          ...(user?.intolerances ?? []),
          ...(user?.diets ?? []),
        ],
      });
    dispatch({
      type: actions.ADD_SUBSTITUTES,
      ingredientIndex: index,
      value: response,
    });
    setLoadingSubstitutions(false);
  };

  const handleSubstitutionSelected = (
    substitution: GPAiSubstitutionReturnType,
    index: number,
    originalIngredientName: string
  ) => {
    // delete the original ingredient
    dispatch({
      type: actions.DELETE_ITEM,
      deletedField: "ingredients",
      itemIndex: index,
    });
    // if the substitution has ingredients or instructions, add ingredients and instructions
    if (
      substitution.substitutionIngredients.length > 0 &&
      substitution.substitutionInstructions.length > 0
    ) {
      const subIngredients: IngredientData[] = [];
      substitution.substitutionIngredients.map((ingredient) => {
        const substitutionIngredient = new IngredientData(
          0,
          ingredient.ingredientName,
          ingredient.quantity,
          ingredient.unit,
          ingredient.department,
          false
        );
        subIngredients.push(substitutionIngredient);
      });
      const substituteAsIngredient = new IngredientData(
        0,
        substitution.substitutionTitle,
        substitution.substitutionQuantity,
        substitution.substitutionUnit,
        substitution.substitutionDepartment,
        false,
        null,
        subIngredients
      );
      dispatch({
        type: actions.ADD_ITEM,
        addedField: "ingredients",
        addedItem: substituteAsIngredient,
      });
      // add instructions to the start of the recipe since we must create prior to using ingredient
      dispatch({
        type: actions.ADD_SUBSTITUTE_INSTRUCTIONS,
        addedInstructions: substitution.substitutionInstructions,
        originalIngredient: originalIngredientName,
        substituteIngredient: substitution.substitutionTitle,
      });
    } else {
      // otherwise, just replace with the new ingredient
      dispatch({
        type: actions.ADD_ITEM,
        addedField: "ingredients",
        addedItem: new IngredientData(
          0,
          substitution.substitutionTitle,
          substitution.substitutionQuantity,
          substitution.substitutionUnit,
          substitution.substitutionDepartment,
          false
        ),
      });
      dispatch({
        type: actions.ADD_SUBSTITUTE_INSTRUCTIONS,
        addedInstructions: [],
        originalIngredient: originalIngredientName,
        substituteIngredient: substitution.substitutionTitle,
      });
    }
  };

  return (
    <>
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
                        <Typography level="h4">
                          Create Your Own Variant
                        </Typography>
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
                    <Grid xs={2.9}>
                      <TitledListView
                        itemsList={dietaryEditFields}
                        headerList={[
                          {
                            title: "Recipe Tags",
                            spacing: MUI_GRID_FULL_SPACE,
                          },
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
                <Box
                  sx={{ ...GPImageDisplayContainerStyle, overflowX: "auto" }}
                >
                  <Box sx={GPImageDisplayContainerStyle}>
                    {editedRecipeData.previewImage?.map((imageUrl, index) => (
                      <Box key={index}>
                        <AspectRatio ratio={1} sx={GPImageCardStyle}>
                          <img src={imageUrl} />
                        </AspectRatio>
                        <Button
                          variant="solid"
                          sx={GPDeleteIconStyle}
                          onClick={() =>
                            dispatch({
                              type: actions.DELETE_IMAGE,
                              value: imageUrl,
                            })
                          }
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                    ))}
                  </Box>
                  <AspectRatio ratio={1} sx={GPImageCardStyle}>
                    <Button onClick={() => setImageSearchModalOpen(true)}>
                      Add Images!
                    </Button>
                  </AspectRatio>
                </Box>
                <TitledListView
                  itemsList={editedRecipeData.ingredients}
                  headerList={[
                    { title: "Ingredients", spacing: MUI_GRID_FULL_SPACE },
                  ]}
                  renderItem={(ingredient, ingredientIndex) => (
                    <Grid container key={ingredientIndex} alignItems="flex-end">
                      {ingredientInputEditFields.map((field, fieldIndex) => (
                        <Grid key={fieldIndex} xs={field.space}>
                          <FormControl>
                            <FormHelperText>{field.label}</FormHelperText>
                            <Input
                              type={
                                field.field ===
                                EditRecipeFieldsEnum.ING_QUANTITY
                                  ? "number"
                                  : "text"
                              }
                              onChange={(event) =>
                                dispatch({
                                  type: actions.UPDATE_INGREDIENT,
                                  ingredientIndex: ingredientIndex,
                                  ingredientField:
                                    field.field as keyof IngredientData,
                                  value: event.target.value,
                                })
                              }
                              value={ingredient[field.field]}
                            />
                          </FormControl>
                        </Grid>
                      ))}
                      <Grid xs={0.5}>
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
                      {getDietarySubstitutes && (
                        <Grid xs={1.5}>
                          <Button
                            loading={loadingSubstitutions}
                            onClick={() =>
                              handleSuggestIngredientSubstitution(
                                ingredient,
                                ingredientIndex
                              )
                            }
                          >
                            Suggest dietary substitutions
                          </Button>
                        </Grid>
                      )}
                      {ingredient.ingredientSubstitutes && (
                        <SubstitutionOptionsDropdown
                          originalIngredient={ingredient}
                          ingredientIndex={ingredientIndex}
                          onSubstitutionSelect={handleSubstitutionSelected}
                        />
                      )}
                    </Grid>
                  )}
                />
                <IconButton
                  sx={{ justifySelf: "flex-end" }}
                  onClick={() =>
                    dispatch({
                      type: actions.ADD_ITEM,
                      addedField: "ingredients",
                      addedItem: new IngredientData(0, "", 0, "", "", false),
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
                          <Textarea
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
                  onClick={() =>
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
              <FormControl error={inputError}>
                <Button type="submit" disabled={inputError}>
                  Update Recipe!
                </Button>
                {inputError && (
                  <FormHelperText>
                    <InfoOutlined />
                    Must enter valid input to submit
                  </FormHelperText>
                )}
              </FormControl>
            </form>
          </DialogContent>
        </ModalDialog>
      </Modal>
      <ImageSearchModal
        modalOpen={imageSearchModalOpen}
        toggleModal={() => setImageSearchModalOpen((prev) => !prev)}
        onSubmit={handleNewImages}
      />
    </>
  );
};

export default EditRecipeModal;
