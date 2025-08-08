import type { GPErrorMessageTypes } from "../utils/types/types";
import AppHeader from "../components/utils/AppHeader";
import GroceryListDepartment from "../components/GroceryListDepartment";
import { useState, useEffect } from "react";
import IngredientModal from "../components/ingredients/IngredientModal";
import { Button, Box, Typography } from "@mui/joy";
import { GROCERY_MODAL } from "../utils/constants";
import TitledListView from "../components/utils/TitledListView";
import ErrorState from "../components/utils/ErrorState";
import { fetchGroceryList } from "../utils/databaseHelpers";
import { CenteredTitledListStyle } from "../utils/style/UIStyle";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;
import axios from "axios";
import { axiosConfig } from "../utils/databaseHelpers";
import type { IngredientData } from "../../../shared/IngredientData";

const GroceryList = () => {
  const [addGroceryItemModalOpen, setAddGroceryItemModalOpen] = useState(false);
  const [userGroceryList, setUserGroceryList] = useState<IngredientData[]>([]);
  const [groceryDepartments, setGroceryDepartments] = useState<string[]>([]);
  const [groceryListCost, setGroceryListCost] = useState(0.0);
  const [message, setMessage] = useState<GPErrorMessageTypes>();

  const handleAddGrocery = () => {
    setAddGroceryItemModalOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchGroceryList({
      setMessage,
      setUserGroceryList,
      setGroceryDepartments,
      setGroceryListCost,
    });
  }, []);

  const toggleGroceryCheck = async (groceryItem: string) => {
    await axios.put(
      `${databaseUrl}/generateList/check`,
      { ingredientName: groceryItem },
      axiosConfig,
    );
    fetchGroceryList({
      setMessage,
      setUserGroceryList,
      setGroceryDepartments,
      setGroceryListCost,
    });
  };

  const handleClearGroceries = async () => {
    await axios.put(`${databaseUrl}/generateList/clear`, {}, axiosConfig);
    fetchGroceryList({
      setMessage,
      setUserGroceryList,
      setGroceryDepartments,
      setGroceryListCost,
    });
  };

  const handleDeleteGrocery = async (ingredientName: string) => {
    await axios.put(
      `${databaseUrl}/generateList/delete`,
      { ingredientName: ingredientName },
      axiosConfig,
    );
    fetchGroceryList({
      setMessage,
      setUserGroceryList,
      setGroceryDepartments,
      setGroceryListCost,
    });
  };

  return (
    <Box>
      <AppHeader />
      <Box sx={{ m: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={handleClearGroceries}>Clear Purchased Items</Button>
          <Box textAlign="right">
            <Typography level="h3">Estimated Cost</Typography>
            <Typography level="h4">
              ${Number(groceryListCost).toFixed(2)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ my: 3 }}>
          <TitledListView
            itemsList={groceryDepartments}
            renderItem={(department, index) => (
              <GroceryListDepartment
                key={index}
                groceryList={userGroceryList}
                department={department}
                onGroceryCheck={toggleGroceryCheck}
                onGroceryDelete={handleDeleteGrocery}
              />
            )}
            listItemsStyle={CenteredTitledListStyle}
          />
        </Box>
      </Box>
      {addGroceryItemModalOpen && (
        <IngredientModal
          modalFor={GROCERY_MODAL}
          isEditing={false}
          onClose={handleAddGrocery}
          modalOpen={addGroceryItemModalOpen}
          fetchUserIngredients={() =>
            fetchGroceryList({
              setMessage,
              setUserGroceryList,
              setGroceryDepartments,
              setGroceryListCost,
            })
          }
        />
      )}
      {message && (
        <ErrorState error={message.error} message={message.message} />
      )}
    </Box>
  );
};

export default GroceryList;
