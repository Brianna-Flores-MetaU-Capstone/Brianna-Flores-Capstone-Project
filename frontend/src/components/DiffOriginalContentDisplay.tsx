import { Box } from "@mui/joy";
import { DiffStatus, type GPDiffLineInfoType } from "../utils/diffUtils";

type GPDiffOriginalDisplayType = {
  xDiffResults: GPDiffLineInfoType[];
  parentComponent: React.ElementType;
  parentComponentProps?: {};
  childrenComponent: React.ElementType;
  childComponentProps?: {};
};

const GPDiffStyle = {
  borderRadius: "md",
  padding: 0.5,
};
const GPDiffAddedStyle = {
  ...GPDiffStyle,
  bgcolor: "success.200",
};
const GPDiffDeletedStyle = {
  ...GPDiffStyle,
  bgcolor: "danger.200",
};

const DiffOriginalContentDisplay = ({
  xDiffResults,
  parentComponent,
  parentComponentProps,
  childrenComponent,
  childComponentProps,
}: GPDiffOriginalDisplayType) => {
  return (
    <Box component={parentComponent} {...parentComponentProps}>
      {xDiffResults.map((line, index) => {
        if (line.status === DiffStatus.UNCHANGED) {
          return (
            <Box component={childrenComponent} {...childComponentProps} key={index}>
              {line.line}
            </Box>
          );
        } else if (line.status === DiffStatus.ADDED) {
          return (
            <Box
              component={childrenComponent}
              key={index}
               {...childComponentProps}
              sx={GPDiffAddedStyle}
            >
              {line.line}
            </Box>
          );
        } else if (line.status === DiffStatus.DELETED) {
          return (
            <Box
              component={childrenComponent}
              key={index}
               {...childComponentProps}
              sx={GPDiffDeletedStyle}
            >
              <Box component="s">{line.line}</Box>
            </Box>
          );
        } else {
          return (
            <Box component={childrenComponent}  {...childComponentProps} key={index}>
              {line.lineDiffInfo?.map((word, wordIndex) => {
                if (word.status === DiffStatus.UNCHANGED) {
                  return (
                    <Box component="span" key={wordIndex}>
                      {word.line}{" "}
                    </Box>
                  );
                } else if (word.status === DiffStatus.ADDED) {
                  return (
                    <Box component="span" key={wordIndex} sx={GPDiffAddedStyle}>
                      {word.line}{" "}
                    </Box>
                  );
                } else {
                  return (
                    <Box component="s" key={wordIndex} sx={GPDiffDeletedStyle}>
                      {word.line}{" "}
                    </Box>
                  );
                }
              })}
            </Box>
          );
        }
      })}
    </Box>
  );
};

export default DiffOriginalContentDisplay;
