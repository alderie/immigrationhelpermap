import "./style.css";

interface CircleProps {
  size: number;
  fillPercent: number;
  label: string;
  largeBetter: boolean;
}

const COLOR_TIERS = ["#f44336", "#f4c736", "#36f460"];

const Circle: React.FC<CircleProps> = ({
  size,
  fillPercent,
  label,
  largeBetter = true,
}) => {
  const radius = size / 2 - 5;

  const colorTier = largeBetter
    ? COLOR_TIERS[Math.floor(fillPercent * (COLOR_TIERS.length))]
    : COLOR_TIERS[
        COLOR_TIERS.length - Math.floor(fillPercent * (COLOR_TIERS.length))
      ];

  return (
    <div
      className="stat"
      style={{
        width: size,
      }}
    >
      <div
        className="label"
        style={{
          top: size / 2,
        }}
      >
        {fillPercent ? Math.floor(fillPercent * 100) : "UNK"}
      </div>
      <svg
        className="progress"
        style={{
          width: size,
          height: size,
        }}
      >
        <circle className="bg" cx={size / 2} cy={size / 2} r={radius} />
        <circle
          className="meter-1"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          style={{
            stroke: colorTier,
            strokeDasharray: radius * 2 * Math.PI,
            strokeDashoffset: radius * 2 * Math.PI * (1 + (fillPercent ?? 0)),
          }}
        />
      </svg>
      <div className="name">{label}</div>
    </div>
  );
};

export default Circle;
