import React from "react";
import TextField from "@mui/material/TextField";

const SharedInput = ({inputLabel, inputType, fieldData, inputValue, handleInputChange}: {inputLabel: string, inputType: string, fieldData: string, inputValue?: string, handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void}) => {
    return (
        <div>
            {inputValue && <TextField required type={inputType} slotProps={{htmlInput: {"data-objectfield": `${fieldData}`}}} onChange={handleInputChange} value={inputValue} label={inputLabel} variant="standard" />}
            {!inputValue && <TextField required type={inputType} slotProps={{htmlInput: {"data-objectfield": `${fieldData}`}}} onChange={handleInputChange} label={inputLabel} variant="standard" />}
        </div>
    )
}

export default SharedInput;