import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Grid, Typography } from "@mui/joy";

type GPHeaderListType = {
  title: string;
  spacing: number;
};

type GPTitledListViewProps<T> = {
  list: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  headerList?: GPHeaderListType[];
  flexDirectionRow?: boolean;
  listHeight?: number
};

const TitledListView = <T,>({
  list,
  renderItem,
  headerList,
  flexDirectionRow,
  listHeight
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
          {headerList.map((header) => (
            <Grid xs={header.spacing} key={uuidv4()}>
              <Typography level="h4">
                {header.title}
              </Typography>
            </Grid>
          ))}
        </Grid>
      )}
      <Box sx={{display: "flex", gap: 3, ...(flexDirectionRow ? {flexWrap: "wrap", justifyContent: "center"} : {flexDirection: "column",}), ...(listHeight ? {maxHeight: listHeight,  overflowY: "auto"} : {})}}>
        {list && list.map(renderItem)}
      </Box>
    </Box>
  );
};

export default TitledListView;
