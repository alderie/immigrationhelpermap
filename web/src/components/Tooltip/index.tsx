import { useEffect } from "react";
import { CountryData, MapData } from "../../App";
import Circle from "../Circle";
import "./style.css";

const countryData: CountryData = require("../../data/merged_data.json");

interface TooltipProps {
  x: number;
  y: number;
  data: MapData;
}

const Tooltip: React.FC<TooltipProps> = ({ x, y, data }) => {
  return (
    <div
      className="tooltip"
      style={{
        position: "absolute",
        left: x,
        top: y,
      }}
    >
      <h3 className="name">{data.properties.ADMIN}</h3>
      <div className='tooltip-header'>
        <h1>{countryData[data.properties.ISO_A3]?.immigration_2020 ?? "UNK"}</h1>
        <p>migrants in 2020</p>
      </div>
      <div className="stats">
        <Circle
          size={60}
          fillPercent={countryData[data.properties.ISO_A3]?.hdi_2021 ?? 0}
          label="HDI"
          largeBetter={true}
        ></Circle>
        <Circle
          size={60}
          fillPercent={1 - countryData[data.properties.ISO_A3]?.cost_of_living ?? 0}
          label="Cost of Living"
          largeBetter={true}
        ></Circle>
        <Circle
          size={60}
          fillPercent={1 - countryData[data.properties.ISO_A3]?.rent_index ?? 0}
          label="Rent Cost"
          largeBetter={true}
        ></Circle>
      </div>
      <div className="info">
        Additional info about immigration policy can be found at your home country's embassy in the destination country, the destination countries local government, or OECD migration policies.
      </div>
    </div>
  );
};

export default Tooltip;
