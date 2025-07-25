import React from "react";
import { Box, Grid, Typography } from "@mui/joy";
import { GPTitledListHeaderStyle } from "../../utils/style/UIStyle";

type GPHeaderListType = {
  title: string;
  spacing: number;
};

type GPTitledListViewProps<T> = {
  itemsList: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  headerList?: GPHeaderListType[];
  listItemsStyle?: {};
  centerTitle?: boolean;
};

const TitledListView = <T,>({
  itemsList,
  renderItem,
  headerList,
  listItemsStyle,
  centerTitle,
}: GPTitledListViewProps<T>) => {
  return (
    <Box>
      {headerList && (
        <Grid
          container
          sx={{
            ...GPTitledListHeaderStyle,
            ...(centerTitle && { textAlign: "center" }),
          }}
        >
          {headerList.map((header, index) => (
            <Grid xs={header.spacing} key={index}>
              <Typography level="h4">{header.title}</Typography>
            </Grid>
          ))}
        </Grid>
      )}
      <Box sx={listItemsStyle}>{itemsList && itemsList.map(renderItem)}</Box>
    </Box>
  );
};

export default TitledListView;
