import React from "react";
import "../styles/Homepage.css";
import { v4 as uuidv4 } from "uuid";
import { Box, Grid, Typography } from "@mui/joy";

type GPHeaderListType = {
title: string 
spacing: number
}

type GPTitledListViewProps<T> = {
  list: T[];
  renderItem: (item: T) => React.ReactNode;
  headerList?: GPHeaderListType[];
};

const TitledListView = <T,>({
  list,
  renderItem,
  headerList,
}: GPTitledListViewProps<T>) => {
  return (
    <Box>
      {headerList && (
        <Grid container spacing={2} sx={{ flexGrow: 1, px: 2, py: 1, bgcolor: "primary.300", borderRadius: "md", my: 2}}>
          {headerList.map((header) => (
            <Grid xs={header.spacing}>
            <Typography level="h4" key={uuidv4()}>{header.title}</Typography>
            </Grid>
          ))}
        </Grid>
      )}
      <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>{list && list.map(renderItem)}</Box>
    </Box>
  );
};

export default TitledListView;
