import type {
  GPErrorMessageTypes,
  GPIngredientDataTypes,
} from "../utils/types";
import AppHeader from "../components/utils/AppHeader";
import GroceryListDepartment from "../components/GroceryListDepartment";
import { useState, useEffect } from "react";
import IngredientModal from "../components/ingredients/IngredientModal";
import { Button, Box, Typography } from "@mui/joy";
import { GROCERY_MODAL } from "../utils/constants";
import TitledListView from "../components/utils/TitledListView";
import ErrorState from "../components/utils/ErrorState";
import { fetchGroceryList } from "../utils/databaseHelpers";
import { CenteredTitledListStyle } from "../utils/UIStyle";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;
import axios from "axios";
import { axiosConfig } from "../utils/databaseHelpers";

const GroceryList = () => {
  const [addGroceryItemModalOpen, setAddGroceryItemModalOpen] = useState(false);
  const [userGroceryList, setUserGroceryList] = useState<
    GPIngredientDataTypes[]
  >([]);
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
      axiosConfig
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

  return (
    <Box>
      <AppHeader />
      <Box sx={{ m: 3 }}>
        <Button onClick={handleClearGroceries}>Clear Purchased Items</Button>
        <Box sx={{ my: 3 }}>
          <TitledListView
            itemsList={groceryDepartments}
            renderItem={(department) => (
              <GroceryListDepartment
                key={department}
                groceryList={userGroceryList}
                department={department}
                onGroceryCheck={toggleGroceryCheck}
              />
            )}
            listItemsStyle={CenteredTitledListStyle}
          />
        </Box>
        <Typography level="h3">Estimated Cost</Typography>
        <Typography level="h4">
          ${Number(groceryListCost).toFixed(2)}
        </Typography>
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
