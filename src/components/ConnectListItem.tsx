import React from "react";
import { connectData } from "./ConnectData";

export const ConnectListItem = () => {
  return (
    <div>
      <ul className="list-container">
        
        {connectData.map((data, key) => {
          return (
            <li key={key}>
              <a href={data.url}>
                <span className="screen-reader-text">
                  {data.name}
                </span>
                <img src={`@assets/icons/` + data.icon} alt={data.name} />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
