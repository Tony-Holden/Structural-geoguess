import { useMemo, useRef, useState } from "react";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.5;

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
                r={11 / zoom}
                fill="#f97316"
                stroke="white"
                strokeWidth={3 / zoom}
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
                r={12 / zoom}
                fill="#22c55e"
                stroke="white"
                strokeWidth={3 / zoom}
              />

              <circle
                r={3 / zoom}
                fill="white"
              />
            </g>
          )}
        </g>
      </svg>

      <div style={styles.zoomLabel}>
        {zoom.toFixed(1)}×
      </div>

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