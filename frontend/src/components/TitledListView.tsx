import React from "react";
import { Box, Grid, Typography } from "@mui/joy";

type GPHeaderListType = {
  title: string;
  spacing: number;
};

type GPTitledListViewProps<T> = {
  itemsList: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  headerList?: GPHeaderListType[];
  flexDirectionRow?: boolean;
  listOverflow?: boolean;
  listHeight?: number;
  listItemsStyle: {};
};

const TitledListView = <T,>({
  itemsList,
  renderItem,
  headerList,
  flexDirectionRow,
  listOverflow,
  listHeight,
  listItemsStyle,
}: GPTitledListViewProps<T>) => {
  return (
    <Box>
      {headerList && (
        <Grid
          container
          sx={{
            flexGrow: 1,
            p: 2,
            bgcolor: "primary.300",
            borderRadius: "md",
            mb: 2,
          }}
        >
          {headerList.map((header, index) => (
            <Grid xs={header.spacing} key={index}>
              <Typography level="h4">{header.title}</Typography>
            </Grid>
          ))}
        </Grid>
      )}
      <Box
        sx={listItemsStyle}
      >
        {itemsList && itemsList.map(renderItem)}
      </Box>
    </Box>
  );
};

export default TitledListView;
