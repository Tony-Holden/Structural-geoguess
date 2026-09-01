import { useMemo, useRef, useState } from "react";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-50m.json";

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;

const MIN_ZOOM = 1;
const MAX_ZOOM = 10;
const ZOOM_STEP = 0.5;
const COUNTRY_LABELS = [
  // North America
  { name: "Canada", longitude: -106, latitude: 57 },
  { name: "United States", longitude: -101, latitude: 38 },
  { name: "Mexico", longitude: -102, latitude: 23 },
  { name: "Greenland", longitude: -42, latitude: 72 },
  { name: "Cuba", longitude: -79.5, latitude: 21.5 },

  // Central and South America
  { name: "Guatemala", longitude: -90.4, latitude: 15.6 },
  { name: "Costa Rica", longitude: -84, latitude: 9.8 },
  { name: "Panama", longitude: -80, latitude: 8.5 },
  { name: "Colombia", longitude: -73.5, latitude: 4 },
  { name: "Venezuela", longitude: -66, latitude: 7 },
  { name: "Ecuador", longitude: -78.3, latitude: -1.3 },
  { name: "Peru", longitude: -75, latitude: -9 },
  { name: "Bolivia", longitude: -64.5, latitude: -17 },
  { name: "Brazil", longitude: -52, latitude: -10 },
  { name: "Paraguay", longitude: -58.5, latitude: -23 },
  { name: "Chile", longitude: -71, latitude: -33 },
  { name: "Argentina", longitude: -64, latitude: -35 },
  { name: "Uruguay", longitude: -56, latitude: -33 },

  // Europe
  { name: "Iceland", longitude: -19, latitude: 65 },
  { name: "Ireland", longitude: -8, latitude: 53.2 },
  { name: "United Kingdom", longitude: -3, latitude: 55 },
  { name: "Portugal", longitude: -8, latitude: 39 },
  { name: "Spain", longitude: -4, latitude: 40 },
  { name: "France", longitude: 2, latitude: 46 },
  { name: "Germany", longitude: 10.5, latitude: 51 },
  { name: "Italy", longitude: 12, latitude: 42 },
  { name: "Norway", longitude: 10, latitude: 63.5 },
  { name: "Sweden", longitude: 16, latitude: 62 },
  { name: "Finland", longitude: 26, latitude: 64 },
  { name: "Poland", longitude: 19, latitude: 52 },
  { name: "Ukraine", longitude: 31, latitude: 49 },
  { name: "Romania", longitude: 25, latitude: 46 },
  { name: "Greece", longitude: 22, latitude: 39 },
  { name: "Turkey", longitude: 35, latitude: 39 },

  // Africa
  { name: "Morocco", longitude: -6, latitude: 32 },
  { name: "Algeria", longitude: 2, latitude: 28 },
  { name: "Tunisia", longitude: 9.5, latitude: 34 },
  { name: "Libya", longitude: 18, latitude: 27 },
  { name: "Egypt", longitude: 30, latitude: 27 },
  { name: "Mauritania", longitude: -10.5, latitude: 20 },
  { name: "Mali", longitude: -4, latitude: 17 },
  { name: "Niger", longitude: 9, latitude: 17 },
  { name: "Chad", longitude: 18.5, latitude: 15 },
  { name: "Sudan", longitude: 30, latitude: 15 },
  { name: "Ethiopia", longitude: 40, latitude: 9 },
  { name: "Somalia", longitude: 46, latitude: 6 },
  { name: "Nigeria", longitude: 8, latitude: 9 },
  { name: "Cameroon", longitude: 12, latitude: 6 },
  { name: "Kenya", longitude: 37.5, latitude: 0.5 },
  { name: "DR Congo", longitude: 23, latitude: -3 },
  { name: "Angola", longitude: 17.5, latitude: -12.5 },
  { name: "Zambia", longitude: 27.5, latitude: -13.5 },
  { name: "Zimbabwe", longitude: 29.5, latitude: -19 },
  { name: "Mozambique", longitude: 35, latitude: -18 },
  { name: "Namibia", longitude: 17, latitude: -22 },
  { name: "Botswana", longitude: 24, latitude: -22 },
  { name: "South Africa", longitude: 24, latitude: -29 },
  { name: "Madagascar", longitude: 47, latitude: -19 },

  // Middle East and Central Asia
  { name: "Saudi Arabia", longitude: 45, latitude: 24 },
  { name: "Iraq", longitude: 44, latitude: 33 },
  { name: "Iran", longitude: 54, latitude: 32 },
  { name: "Kazakhstan", longitude: 68, latitude: 48 },
  { name: "Uzbekistan", longitude: 64, latitude: 41 },
  { name: "Afghanistan", longitude: 66, latitude: 34 },

  // Asia
  { name: "Russia", longitude: 92, latitude: 61 },
  { name: "Pakistan", longitude: 69, latitude: 30 },
  { name: "India", longitude: 79, latitude: 22 },
  { name: "Nepal", longitude: 84, latitude: 28.2 },
  { name: "Bangladesh", longitude: 90, latitude: 24 },
  { name: "China", longitude: 104, latitude: 35 },
  { name: "Mongolia", longitude: 103, latitude: 47 },
  { name: "North Korea", longitude: 127, latitude: 40 },
  { name: "South Korea", longitude: 128, latitude: 36 },
  { name: "Japan", longitude: 138, latitude: 37 },
  { name: "Myanmar", longitude: 96, latitude: 21 },
  { name: "Thailand", longitude: 101, latitude: 15 },
  { name: "Vietnam", longitude: 107, latitude: 16 },
  { name: "Philippines", longitude: 122, latitude: 13 },
  { name: "Malaysia", longitude: 102, latitude: 4 },
  { name: "Indonesia", longitude: 118, latitude: -3 },

  // Oceania
  { name: "Papua New Guinea", longitude: 145, latitude: -6.5 },
  { name: "Australia", longitude: 134, latitude: -25 },
  { name: "New Zealand", longitude: 172.5, latitude: -41 },
];
const SMALL_COUNTRY_LABELS = [
  // Europe
  { name: "Netherlands", longitude: 5.4, latitude: 52.2 },
  { name: "Belgium", longitude: 4.7, latitude: 50.8 },
  { name: "Luxembourg", longitude: 6.1, latitude: 49.8 },
  { name: "Switzerland", longitude: 8.2, latitude: 46.8 },
  { name: "Austria", longitude: 14.0, latitude: 47.6 },
  { name: "Denmark", longitude: 9.5, latitude: 56.0 },
  { name: "Estonia", longitude: 25.5, latitude: 58.6 },
  { name: "Latvia", longitude: 24.6, latitude: 57.0 },
  { name: "Lithuania", longitude: 24.0, latitude: 55.3 },
  { name: "Czechia", longitude: 15.5, latitude: 49.8 },
  { name: "Slovakia", longitude: 19.5, latitude: 48.7 },
  { name: "Hungary", longitude: 19.3, latitude: 47.1 },
  { name: "Slovenia", longitude: 14.8, latitude: 46.1 },
  { name: "Croatia", longitude: 16.5, latitude: 45.2 },
  { name: "Bosnia", longitude: 17.8, latitude: 44.2 },
  { name: "Serbia", longitude: 20.8, latitude: 44.0 },
  { name: "Montenegro", longitude: 19.3, latitude: 42.7 },
  { name: "Albania", longitude: 20.0, latitude: 41.1 },
  { name: "North Macedonia", longitude: 21.7, latitude: 41.6 },
  { name: "Bulgaria", longitude: 25.3, latitude: 42.7 },
  { name: "Belarus", longitude: 28.0, latitude: 53.5 },
  { name: "Moldova", longitude: 28.5, latitude: 47.2 },

  // West & Central Africa
  { name: "Senegal", longitude: -14.5, latitude: 14.5 },
  { name: "Guinea", longitude: -10.9, latitude: 10.4 },
  { name: "Sierra Leone", longitude: -11.8, latitude: 8.5 },
  { name: "Liberia", longitude: -9.4, latitude: 6.4 },
  { name: "Ivory Coast", longitude: -5.5, latitude: 7.6 },
  { name: "Ghana", longitude: -1.2, latitude: 7.9 },
  { name: "Togo", longitude: 1.1, latitude: 8.6 },
  { name: "Benin", longitude: 2.3, latitude: 9.5 },
  { name: "Burkina Faso", longitude: -1.7, latitude: 12.3 },
  { name: "Cameroon", longitude: 12.0, latitude: 6.0 },
  { name: "Republic of Congo", longitude: 15.2, latitude: -0.8 },
  { name: "Gabon", longitude: 11.7, latitude: -0.6 },
  { name: "Central African Rep.", longitude: 20.9, latitude: 6.6 },

  // East & Southern Africa
  { name: "South Sudan", longitude: 30.0, latitude: 7.3 },
  { name: "Uganda", longitude: 32.3, latitude: 1.4 },
  { name: "Tanzania", longitude: 35.0, latitude: -6.0 },
  { name: "Zambia", longitude: 27.5, latitude: -13.5 },
  { name: "Zimbabwe", longitude: 29.5, latitude: -19.0 },
  { name: "Mozambique", longitude: 35.0, latitude: -18.0 },
  { name: "Namibia", longitude: 17.0, latitude: -22.0 },
  { name: "Botswana", longitude: 24.0, latitude: -22.0 },
  { name: "Eritrea", longitude: 39.0, latitude: 15.2 },
  { name: "Djibouti", longitude: 42.6, latitude: 11.8 },
  { name: "Somaliland", longitude: 46.0, latitude: 9.7 },

  // Middle East
  { name: "Israel", longitude: 35.0, latitude: 31.5 },
  { name: "Jordan", longitude: 36.0, latitude: 31.0 },
  { name: "Lebanon", longitude: 35.8, latitude: 33.9 },
  { name: "Syria", longitude: 38.0, latitude: 35.0 },
  { name: "Iraq", longitude: 44.0, latitude: 33.0 },
  { name: "Kuwait", longitude: 47.5, latitude: 29.3 },
  { name: "Qatar", longitude: 51.2, latitude: 25.3 },
  { name: "UAE", longitude: 54.3, latitude: 24.2 },
  { name: "Oman", longitude: 57.0, latitude: 21.0 },
  { name: "Yemen", longitude: 47.5, latitude: 15.8 },

  // Central Asia
  { name: "Uzbekistan", longitude: 64.0, latitude: 41.0 },
  { name: "Afghanistan", longitude: 66.0, latitude: 34.0 },

  // South Asia
  { name: "Nepal", longitude: 84.0, latitude: 28.2 },
  { name: "Bangladesh", longitude: 90.0, latitude: 24.0 },
  { name: "Sri Lanka", longitude: 80.7, latitude: 7.5 },

  // Southeast Asia
  { name: "Myanmar", longitude: 96.0, latitude: 21.0 },
  { name: "Cambodia", longitude: 104.9, latitude: 12.7 },
  { name: "Laos", longitude: 103.8, latitude: 18.2 },
  { name: "Philippines", longitude: 122.0, latitude: 13.0 },
  { name: "Malaysia", longitude: 102.0, latitude: 4.0 },
  { name: "Singapore", longitude: 103.82, latitude: 1.35 },
  { name: "Brunei", longitude: 114.7, latitude: 4.5 },
  { name: "Taiwan", longitude: 121.0, latitude: 23.7 },

  // Central America & Caribbean
  { name: "Belize", longitude: -88.7, latitude: 17.2 },
  { name: "El Salvador", longitude: -88.9, latitude: 13.7 },
  { name: "Honduras", longitude: -86.5, latitude: 15.0 },
  { name: "Nicaragua", longitude: -85.0, latitude: 13.0 },
  { name: "Jamaica", longitude: -77.3, latitude: 18.1 },
  { name: "Dominican Rep.", longitude: -70.5, latitude: 18.9 },

  // Pacific
  { name: "Fiji", longitude: 178.0, latitude: -17.8 },
  { name: "Solomon Islands", longitude: 160.0, latitude: -9.0 },
  { name: "Vanuatu", longitude: 167.0, latitude: -16.0 },
  { name: "Samoa", longitude: -172.0, latitude: -13.8 },
  { name: "Tonga", longitude: -175.2, latitude: -21.2 }
];

const clamp = (value, minimum, maximum) =>
  Math.max(minimum, Math.min(maximum, value));

export default function WorldMap({
  guess,
  answer,
  locked,
  onGuess,
}) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);

  const [zoom, setZoom] = useState(1);

const [pan, setPan] = useState({
  x: 0,
  y: 0,
});

const [showCountryNames, setShowCountryNames] =
  useState(false);

  const countries = useMemo(() => {
    const convertedMap = feature(
      worldData,
      worldData.objects.countries
    );

    return convertedMap.features;
  }, []);

  const projection = useMemo(() => {
    return geoEquirectangular().fitExtent(
      [
        [8, 8],
        [MAP_WIDTH - 8, MAP_HEIGHT - 8],
      ],
      {
        type: "Sphere",
      }
    );
  }, []);

  const pathGenerator = useMemo(() => {
    return geoPath(projection);
  }, [projection]);

  const guessPoint = guess
    ? projection([
        guess.longitude,
        guess.latitude,
      ])
    : null;

  const answerPoint =
    locked && answer
      ? projection([
          answer.longitude,
          answer.latitude,
        ])
      : null;

  function constrainPan(nextPan, nextZoom = zoom) {
    if (nextZoom <= 1) {
      return {
        x: 0,
        y: 0,
      };
    }

    const maximumX =
      (MAP_WIDTH * (nextZoom - 1)) / 2;

    const maximumY =
      (MAP_HEIGHT * (nextZoom - 1)) / 2;

    return {
      x: clamp(
        nextPan.x,
        -maximumX,
        maximumX
      ),
      y: clamp(
        nextPan.y,
        -maximumY,
        maximumY
      ),
    };
  }

  function changeZoom(nextValue) {
    const nextZoom = clamp(
      nextValue,
      MIN_ZOOM,
      MAX_ZOOM
    );

    setZoom(nextZoom);

    setPan((currentPan) =>
      constrainPan(currentPan, nextZoom)
    );
  }

  function resetMap() {
    setZoom(1);

    setPan({
      x: 0,
      y: 0,
    });
  }

  function handlePointerDown(event) {
    if (locked) {
      return;
    }

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    dragRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startingPanX: pan.x,
      startingPanY: pan.y,
      moved: false,
    };
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;

    if (
      !drag ||
      drag.pointerId !== event.pointerId ||
      zoom <= 1
    ) {
      return;
    }

    const movementX =
      event.clientX - drag.startClientX;

    const movementY =
      event.clientY - drag.startClientY;

    if (
      Math.hypot(
        movementX,
        movementY
      ) > 5
    ) {
      drag.moved = true;
    }

    setPan(
      constrainPan({
        x: drag.startingPanX + movementX,
        y: drag.startingPanY + movementY,
      })
    );
  }

  function handlePointerUp(event) {
    const drag = dragRef.current;

    if (
      !drag ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    dragRef.current = null;

    if (locked || drag.moved) {
      return;
    }

    placePin(event);
  }

  function handlePointerCancel(event) {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    dragRef.current = null;
  }

  function placePin(event) {
    if (
      locked ||
      !svgRef.current ||
      typeof onGuess !== "function"
    ) {
      return;
    }

    const rectangle =
      svgRef.current.getBoundingClientRect();

    const screenX =
      ((event.clientX - rectangle.left) /
        rectangle.width) *
      MAP_WIDTH;

    const screenY =
      ((event.clientY - rectangle.top) /
        rectangle.height) *
      MAP_HEIGHT;

    const mapX =
      (screenX - MAP_WIDTH / 2 - pan.x) /
        zoom +
      MAP_WIDTH / 2;

    const mapY =
      (screenY - MAP_HEIGHT / 2 - pan.y) /
        zoom +
      MAP_HEIGHT / 2;

    const coordinates = projection.invert([
      mapX,
      mapY,
    ]);

    if (!coordinates) {
      return;
    }

    const [longitude, latitude] =
      coordinates;

    if (
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      return;
    }

    onGuess({
      longitude,
      latitude,
    });
  }

  const styles = {
    wrapper: {
      position: "relative",
      width: "100%",
      aspectRatio: "2 / 1",
      overflow: "hidden",
      boxSizing: "border-box",
      border: "4px solid #334155",
      borderRadius: "18px",
      background: "#89c9df",
      cursor: locked
        ? "default"
        : zoom > 1
          ? "grab"
          : "crosshair",
      touchAction: "none",
      userSelect: "none",
    },

    svg: {
      display: "block",
      width: "100%",
      height: "100%",
    },

    controls: {
      position: "absolute",
      zIndex: 10,
      top: "12px",
      right: "12px",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: "12px",
      background: "rgba(15,23,42,0.92)",
      boxShadow: "0 8px 22px rgba(0,0,0,0.3)",
    },

    controlButton: {
      width: "42px",
      height: "42px",
      margin: 0,
      padding: 0,
      border: "none",
      borderBottom:
        "1px solid rgba(255,255,255,0.12)",
      borderRadius: 0,
      background: "transparent",
      color: "white",
      fontSize: "20px",
      fontWeight: "900",
      cursor: "pointer",
    },

    resetButton: {
      width: "42px",
      height: "42px",
      margin: 0,
      padding: 0,
      border: "none",
      borderRadius: 0,
      background: "transparent",
      color: "white",
      fontSize: "11px",
      fontWeight: "900",
      cursor: "pointer",
    },

    help: {
      position: "absolute",
      zIndex: 10,
      left: "12px",
      bottom: "12px",
      padding: "7px 10px",
      borderRadius: "8px",
      background: "rgba(15,23,42,0.78)",
      color: "white",
      fontSize: "11px",
      fontWeight: "700",
      pointerEvents: "none",
    },

    zoomLabel: {
      position: "absolute",
      zIndex: 10,
      top: "12px",
      left: "12px",
      padding: "6px 9px",
      borderRadius: "8px",
      background: "rgba(15,23,42,0.75)",
      color: "white",
      fontSize: "11px",
      fontWeight: "800",
      pointerEvents: "none",
    },
    countryToggle: {
  position: "absolute",
  zIndex: 10,
  left: "12px",
  top: "47px",
  display: "flex",
  alignItems: "center",
  gap: "7px",
  padding: "7px 10px",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "8px",
  background: "rgba(15,23,42,0.78)",
  color: "white",
  fontSize: "11px",
  fontWeight: "700",
  cursor: "pointer",
  userSelect: "none",
},

countryCheckbox: {
  width: "14px",
  height: "14px",
  margin: 0,
  accentColor: "#8cc63f",
  cursor: "pointer",
},
  };

  return (
    <div style={styles.wrapper}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="none"
        style={styles.svg}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        role="img"
        aria-label="Interactive world map"
      >
        <defs>
          <linearGradient
            id="worldMapOcean"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#a6dfed"
            />

            <stop
              offset="100%"
              stopColor="#63afc8"
            />
          </linearGradient>

          <linearGradient
            id="worldMapLand"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#82b97e"
            />

            <stop
              offset="100%"
              stopColor="#46775a"
            />
          </linearGradient>

          <filter
            id="worldMapMarkerShadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="2"
              floodColor="#0f172a"
              floodOpacity="0.6"
            />
          </filter>

          <filter
            id="worldMapLandShadow"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feDropShadow
              dx="0"
              dy="1.5"
              stdDeviation="1.2"
              floodColor="#164e63"
              floodOpacity="0.3"
            />
          </filter>
        </defs>

        <rect
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          fill="url(#worldMapOcean)"
        />

        <g
          transform={`
            translate(
              ${MAP_WIDTH / 2 + pan.x}
              ${MAP_HEIGHT / 2 + pan.y}
            )
            scale(${zoom})
            translate(
              ${-MAP_WIDTH / 2}
              ${-MAP_HEIGHT / 2}
            )
          `}
        >
          <g
            fill="none"
            stroke="#28758d"
            strokeWidth={0.7 / zoom}
            opacity="0.28"
            pointerEvents="none"
          >
            {[100, 200, 300, 400].map(
              (mapY) => (
                <line
                  key={`horizontal-${mapY}`}
                  x1="0"
                  y1={mapY}
                  x2={MAP_WIDTH}
                  y2={mapY}
                />
              )
            )}

            {[
              100,
              200,
              300,
              400,
              500,
              600,
              700,
              800,
              900,
            ].map((mapX) => (
              <line
                key={`vertical-${mapX}`}
                x1={mapX}
                y1="0"
                x2={mapX}
                y2={MAP_HEIGHT}
              />
            ))}
          </g>

          <g
            pointerEvents="none"
            filter="url(#worldMapLandShadow)"
          >
            {countries.map((country) => (
              <path
                key={country.id}
                d={
                  pathGenerator(country) ||
                  ""
                }
                fill="url(#worldMapLand)"
                stroke="#e8f5e9"
                strokeWidth={0.75 / zoom}
              />
            ))}
          </g>
          {showCountryNames && (
  <g pointerEvents="none">
    {COUNTRY_LABELS.map((label) => {
      const labelPoint = projection([
        label.longitude,
        label.latitude,
      ]);

      if (!labelPoint) {
        return null;
      }

      const [labelX, labelY] = labelPoint;

      return (
        <text
          key={label.name}
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#102033"
          stroke="rgba(255,255,255,0.72)"
          strokeWidth={0.7 / zoom}
          paintOrder="stroke"
          fontSize={5.8 / Math.sqrt(zoom)}
          fontWeight="700"
          shapeRendering="geometricPrecision"
          style={{
            userSelect: "none",
          }}
        >
          {label.name}
        </text>
      );
    })}

    {zoom >= 4 &&
      SMALL_COUNTRY_LABELS.map((label) => {
        const labelPoint = projection([
          label.longitude,
          label.latitude,
        ]);

        if (!labelPoint) {
          return null;
        }

        const [labelX, labelY] = labelPoint;

        return (
          <text
            key={`small-${label.name}`}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#102033"
            stroke="rgba(255,255,255,0.76)"
            strokeWidth={0.55 / zoom}
            paintOrder="stroke"
            fontSize={4.5 / Math.sqrt(zoom)}
            fontWeight="700"
            shapeRendering="geometricPrecision"
            style={{
              userSelect: "none",
            }}
          >
            {label.name}
          </text>
        );
      })}
  </g>
)}

          <path
            d={
              pathGenerator({
                type: "Sphere",
              }) || ""
            }
            fill="none"
            stroke="#dff6ff"
            strokeWidth={1.2 / zoom}
            pointerEvents="none"
          />

          {guessPoint && answerPoint && (
            <line
              x1={guessPoint[0]}
              y1={guessPoint[1]}
              x2={answerPoint[0]}
              y2={answerPoint[1]}
              stroke="#ffffff"
              strokeWidth={2 / zoom}
              strokeDasharray={`${7 / zoom} ${6 / zoom}`}
              opacity="0.85"
              pointerEvents="none"
            />
          )}

          {guessPoint && (
            <g
              transform={`translate(
                ${guessPoint[0]}
                ${guessPoint[1]}
              )`}
              pointerEvents="none"
              filter="url(#worldMapMarkerShadow)"
            >
              <circle
  r={8 / zoom}
  fill="#f97316"
  stroke="white"
  strokeWidth={2 / zoom}
  vectorEffect="non-scaling-stroke"
  shapeRendering="geometricPrecision"
/>

<circle
  r={2 / zoom}
  fill="white"
  shapeRendering="geometricPrecision"
/>

              <circle
                r={3 / zoom}
                fill="white"
              />
            </g>
          )}

          {answerPoint && (
            <g
              transform={`translate(
                ${answerPoint[0]}
                ${answerPoint[1]}
              )`}
              pointerEvents="none"
              filter="url(#worldMapMarkerShadow)"
            >
              <circle
  r={9 / zoom}
  fill="#22c55e"
  stroke="white"
  strokeWidth={2 / zoom}
  vectorEffect="non-scaling-stroke"
  shapeRendering="geometricPrecision"
/>

<circle
  r={2 / zoom}
  fill="white"
  shapeRendering="geometricPrecision"
/>
            </g>
          )}
        </g>
      </svg>

      <div style={styles.zoomLabel}>
        {zoom.toFixed(1)}×
      </div>
      <label
  style={styles.countryToggle}
  onPointerDown={(event) =>
    event.stopPropagation()
  }
  onPointerUp={(event) =>
    event.stopPropagation()
  }
>
  <input
    type="checkbox"
    checked={showCountryNames}
    onChange={(event) =>
      setShowCountryNames(
        event.target.checked
      )
    }
    style={styles.countryCheckbox}
  />

  Show country names
</label>

      <div style={styles.controls}>
        <button
          type="button"
          style={styles.controlButton}
          onClick={() =>
            changeZoom(zoom + ZOOM_STEP)
          }
          disabled={zoom >= MAX_ZOOM}
          title="Zoom in"
          aria-label="Zoom in"
        >
          +
        </button>

        <button
          type="button"
          style={styles.controlButton}
          onClick={() =>
            changeZoom(zoom - ZOOM_STEP)
          }
          disabled={zoom <= MIN_ZOOM}
          title="Zoom out"
          aria-label="Zoom out"
        >
          −
        </button>

        <button
          type="button"
          style={styles.resetButton}
          onClick={resetMap}
          title="Reset map"
          aria-label="Reset map"
        >
          1×
        </button>
      </div>

      <div style={styles.help}>
        {locked
          ? "Answer locked"
          : zoom > 1
            ? "Drag to pan · Click to place pin"
            : "Click to place your pin"}
      </div>
    </div>
  );
}