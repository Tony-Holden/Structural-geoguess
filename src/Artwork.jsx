const artworkStyles = {
  wrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "16 / 9",
    overflow: "hidden",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, #38bdf8 0%, #1d4ed8 55%, #0f172a 100%)",
  },

  svg: {
    display: "block",
    width: "100%",
    height: "100%",
  },

  label: {
    position: "absolute",
    left: "18px",
    bottom: "18px",
    padding: "8px 12px",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "999px",
    background: "rgba(2,6,23,0.62)",
    color: "white",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "0.04em",
    backdropFilter: "blur(8px)",
  },
};

function OperaHouse() {
  return (
    <g>
      <path
        d="M0 520 Q220 475 430 515 T820 505 T1200 500 V675 H0Z"
        fill="url(#artWater)"
      />

      <path
        d="M165 520 H875"
        fill="none"
        stroke="#f8fafc"
        strokeWidth="13"
        strokeLinecap="round"
      />

      <path
        d="M205 505 Q280 260 420 505Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="7"
      />

      <path
        d="M330 505 Q460 175 610 505Z"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="7"
      />

      <path
        d="M500 505 Q625 235 755 505Z"
        fill="#f1f5f9"
        stroke="#cbd5e1"
        strokeWidth="7"
      />

      <path
        d="M650 505 Q735 320 825 505Z"
        fill="#e2e8f0"
        stroke="#cbd5e1"
        strokeWidth="7"
      />

      <g
        fill="none"
        stroke="#94a3b8"
        strokeWidth="3"
        opacity="0.7"
      >
        <path d="M237 466 Q295 323 385 470" />
        <path d="M370 463 Q463 235 572 466" />
        <path d="M535 465 Q630 285 718 469" />
      </g>

      <path
        d="M875 495 Q930 470 985 494"
        fill="none"
        stroke="#bae6fd"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </g>
  );
}

function SuspensionBridge() {
  return (
    <g>
      <path
        d="M0 505 Q220 470 430 510 T820 500 T1200 495 V675 H0Z"
        fill="url(#artWater)"
      />

      <g
        fill="none"
        stroke="#f97316"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M175 505 V145 M1025 505 V145"
          strokeWidth="21"
        />

        <path
          d="M135 505 H1065"
          strokeWidth="17"
        />

        <path
          d="M175 180 Q600 515 1025 180"
          strokeWidth="9"
        />

        <path
          d="M175 180 Q600 25 1025 180"
          strokeWidth="9"
        />

        <path
          d="M255 235 V505
             M345 300 V505
             M435 350 V505
             M525 380 V505
             M675 380 V505
             M765 350 V505
             M855 300 V505
             M945 235 V505"
          strokeWidth="5"
        />

        <path
          d="M150 205 H200 M150 285 H200
             M1000 205 H1050 M1000 285 H1050"
          strokeWidth="10"
        />
      </g>

      <path
        d="M0 185 Q170 125 325 185"
        fill="#e2e8f0"
        opacity="0.45"
      />

      <path
        d="M885 205 Q1040 120 1200 190"
        fill="#e2e8f0"
        opacity="0.35"
      />
    </g>
  );
}

function Viaduct() {
  return (
    <g>
      <path
        d="M0 455 Q140 390 270 450 Q395 515 515 438 Q650 350 800 435 Q980 525 1200 425 V675 H0Z"
        fill="#315c46"
      />

      <path
        d="M0 505 Q190 445 350 505 Q510 565 680 480 Q840 400 1200 490 V675 H0Z"
        fill="#254936"
        opacity="0.8"
      />

      <g
        fill="none"
        stroke="#f8fafc"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M65 356 H1135"
          strokeWidth="14"
        />

        <path
          d="M230 356 V575
             M465 356 V610
             M720 356 V605
             M965 356 V565"
          strokeWidth="17"
        />

        <path
          d="M230 356 V80
             M465 356 V50
             M720 356 V65
             M965 356 V95"
          strokeWidth="10"
        />

        <path
          d="M230 90 L125 356
             M230 90 L335 356
             M465 60 L355 356
             M465 60 L575 356
             M720 75 L610 356
             M720 75 L830 356
             M965 105 L855 356
             M965 105 L1075 356"
          strokeWidth="5"
        />
      </g>

      <g
        fill="#cbd5e1"
        opacity="0.8"
      >
        <circle cx="230" cy="82" r="10" />
        <circle cx="465" cy="52" r="10" />
        <circle cx="720" cy="67" r="10" />
        <circle cx="965" cy="97" r="10" />
      </g>
    </g>
  );
}

function BrooklynBridge() {
  return (
    <g>
      <path
        d="M0 515 Q220 480 430 518 T820 508 T1200 502 V675 H0Z"
        fill="url(#artWater)"
      />

      <g
        fill="none"
        stroke="#e7d7ba"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M130 500 H1070"
          strokeWidth="15"
        />

        <path
          d="M275 500 V175 H425 V500
             M775 500 V175 H925 V500"
          strokeWidth="20"
        />

        <path
          d="M275 260 H425
             M775 260 H925"
          strokeWidth="14"
        />

        <path
          d="M350 175 Q600 490 850 175"
          strokeWidth="8"
        />

        <path
          d="M350 175 Q600 30 850 175"
          strokeWidth="8"
        />

        <path
          d="M130 500 Q220 245 350 175
             M1070 500 Q980 245 850 175"
          strokeWidth="8"
        />

        <path
          d="M460 300 V500
             M530 352 V500
             M600 372 V500
             M670 352 V500
             M740 300 V500"
          strokeWidth="5"
        />
      </g>

      <g fill="#172554" opacity="0.72">
        <path d="M305 500 V330 H345 V500Z" />
        <path d="M355 500 V330 H395 V500Z" />
        <path d="M805 500 V330 H845 V500Z" />
        <path d="M855 500 V330 H895 V500Z" />
      </g>

      <g
        fill="#0f172a"
        opacity="0.45"
      >
        <rect
          x="0"
          y="400"
          width="90"
          height="110"
        />

        <rect
          x="93"
          y="430"
          width="55"
          height="80"
        />

        <rect
          x="1085"
          y="390"
          width="115"
          height="120"
        />
      </g>
    </g>
  );
}

function UnknownStructure() {
  return (
    <g>
      <path
        d="M0 515 Q220 475 430 515 T820 505 T1200 500 V675 H0Z"
        fill="url(#artWater)"
      />

      <g
        fill="none"
        stroke="#ffffff"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M210 500 H990" />
        <path d="M330 500 V260 H870 V500" />
        <path d="M430 500 V340 M600 500 V300 M770 500 V340" />
        <path d="M330 260 Q600 85 870 260" />
      </g>
    </g>
  );
}

function StructureDrawing({ type }) {
  if (type === "opera") {
    return <OperaHouse />;
  }

  if (type === "suspension") {
    return <SuspensionBridge />;
  }

  if (type === "viaduct") {
    return <Viaduct />;
  }

  if (type === "brooklyn") {
    return <BrooklynBridge />;
  }

  return <UnknownStructure />;
}

export default function Artwork({
  type,
  name,
  revealName = false,
}) {
  return (
    <div style={artworkStyles.wrapper}>
      <svg
        viewBox="0 0 1200 675"
        preserveAspectRatio="xMidYMid slice"
        style={artworkStyles.svg}
        role="img"
        aria-label={
          revealName
            ? `Stylised illustration of ${name}`
            : "Stylised illustration of a mystery structure"
        }
      >
        <defs>
          <linearGradient
            id="artSky"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#38bdf8"
            />

            <stop
              offset="55%"
              stopColor="#2563eb"
            />

            <stop
              offset="100%"
              stopColor="#111827"
            />
          </linearGradient>

          <linearGradient
            id="artWater"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor="#075985"
            />

            <stop
              offset="100%"
              stopColor="#172554"
            />
          </linearGradient>

          <radialGradient
            id="sunGlow"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop
              offset="0%"
              stopColor="#fef3c7"
              stopOpacity="1"
            />

            <stop
              offset="100%"
              stopColor="#fef3c7"
              stopOpacity="0"
            />
          </radialGradient>

          <filter
            id="structureShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="10"
              stdDeviation="9"
              floodColor="#020617"
              floodOpacity="0.45"
            />
          </filter>
        </defs>

        <rect
          width="1200"
          height="675"
          fill="url(#artSky)"
        />

        <circle
          cx="970"
          cy="115"
          r="115"
          fill="url(#sunGlow)"
        />

        <circle
          cx="970"
          cy="115"
          r="50"
          fill="#fde68a"
          opacity="0.9"
        />

        <g
          opacity="0.12"
          stroke="white"
          strokeWidth="1"
          pointerEvents="none"
        >
          <path
            d="M0 100 H1200
               M0 200 H1200
               M0 300 H1200
               M0 400 H1200
               M0 500 H1200"
          />

          <path
            d="M200 0 V675
               M400 0 V675
               M600 0 V675
               M800 0 V675
               M1000 0 V675"
          />
        </g>

        <g filter="url(#structureShadow)">
          <StructureDrawing type={type} />
        </g>
      </svg>

      <div style={artworkStyles.label}>
        {revealName
          ? name
          : "Where in the world is this structure?"}
      </div>
    </div>
  );
}