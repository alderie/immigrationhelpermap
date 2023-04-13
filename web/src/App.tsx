import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import DeckGL, {
  ContourLayer,
  GeoJsonLayer,
  LayersList,
  MapView,
  PickingInfo,
} from "deck.gl/typed/index";
import { Map, ViewState } from "react-map-gl";
import maplibregl from "maplibre-gl";
import Tooltip from "./components/Tooltip";
import {
  Autocomplete,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";

export type CountryData = Record<
  string,
  {
    country: string;
    hdi_2021: number;
    cost_of_living: number;
    rent_index: number;
    groceries_index: number;
    immigration_2020: number;
  }
>;

const countryData: CountryData = require("./merged_data.json");

type GeoData = {
  type: string;
  coordinates: Array<Array<Array<[number, number]>>>;
};

export type MapData = {
  geometry: GeoData;
  properties: {
    ADMIN: string;
    ISO_A2: string;
    ISO_A3: string;
  };
};

const INITIAL_VIEW_STATE = {
  longitude: -100,
  latitude: 40,
  zoom: 3,
  maxZoom: 10,
};

const COLOR_SCALE = (percent: number): [number, number, number] => {
  return [41 * percent + 20, 49 * percent + 20, 178 * percent + 20];
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#3D45C6",
    },
  },
});

type BoundingBox = [number, number, number, number];

function App() {

  const [viewState, setViewState] = useState<ViewState>({
    ...INITIAL_VIEW_STATE,
    pitch: 0,
    bearing: 0,
    padding: {
      top:0,
      bottom: 0,
      left:0,
      right:0
    }
  });
  const [hoverInfo, setHoverInfo] = useState<PickingInfo>();

  const mapStyle =
    "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

  const onCountrySelect = (evt: PickingInfo) => {
    const coordinates = (evt.object as MapData).geometry.coordinates.flat(2);
    const constraints = coordinates.reduce<BoundingBox>(
      (acc, val) => {
        return [
          Math.min(val[0], acc[0]),
          Math.max(val[0], acc[1]),
          Math.min(val[1], acc[2]),
          Math.max(val[1], acc[3]),
        ];
      },
      [Infinity, -Infinity, Infinity, -Infinity]
    );

    console.log(constraints);

    /*setViewState((view) => ({
      ...view,
      longitude: constraints[1],
      latitude: constraints[3],
    }))*/
  };

  const layers: LayersList = [
    new GeoJsonLayer({
      id: "geojson",
      data: "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson",
      opacity: 0.5,
      stroked: false,
      filled: true,
      wireframe: false,
      getFillColor: (f: any) => {
        const country = countryData[(f as MapData).properties.ISO_A3];
        if (!country) return [0, 0, 0];

        return COLOR_SCALE(Math.pow(country.hdi_2021, 2));
      },
      getLineColor: [255, 255, 255],
      pickable: true,
      onHover: (info) => {
        setHoverInfo(info);
      },
      onClick: onCountrySelect,
    }),
  ];

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
          style={{ mixBlendMode: "lighten" }}
        >
          <Map
            reuseMaps
            mapLib={maplibregl}
            mapStyle={mapStyle}
            styleDiffing={false}
          />

          {hoverInfo?.object && (
            <Tooltip x={hoverInfo.x} y={hoverInfo.y} data={hoverInfo.object} />
          )}
        </DeckGL>
        <div className="banner">
          <div className="logo">domicilium</div>
        </div>
        <div className="footer">
          <p>
            The Human Development Index (HDI) data is sourced from the Open
            Source
            (https://www.kaggle.com/datasets/iamsouravbanerjee/human-development-index-dataset)
            HDI Dataset. Its most recent data cutoff is 2021
          </p>
          <p>
            The Cost of Living and Rent Cost is sourced from Numbeo
            (https://www.numbeo.com/cost-of-living/) and is crowdsourced and
            thus might not be exactly accurate. Its also measured relative to
            the cost of living in New York
          </p>
          <p>
            The scores are normalized to allow for easier comparison between
            different countries.
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
