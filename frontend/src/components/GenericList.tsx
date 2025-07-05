import React from "react";
import "../styles/Homepage.css";
import { v4 as uuidv4 } from "uuid";

type GPGenericListProps<T> = {
  className: string;
  list: T[];
  renderItem: (item: T) => React.ReactNode;
  headerList?: string[];
};

const GenericList = <T,>({
  className,
  list,
  renderItem,
  headerList,
}: GPGenericListProps<T>) => {
  return (
    <>
      {headerList && (
        <div className="ingredient-columns">
          {headerList.map((header) => (
            <h3 key={uuidv4()}>{header}</h3>
          ))}
        </div>
      )}
      <div className={className}>{list.map(renderItem)}</div>
    </>
  );
};

export default GenericList;
