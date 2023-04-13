import "./style.css";

interface CircleProps {
    size: number,
    fillPercent: number | null,
    label: string
}

const Circle: React.FC<CircleProps> = ({ size, fillPercent, label }) => {

  const radius = size / 2 - 5
  return (
    <div className='stat' style={{
        width: size
    }}>
      <div className="label" style={{
        top: size / 2
      }}>{fillPercent ? Math.floor(fillPercent * 100) : "UNK"}</div>
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
            strokeDasharray: radius * 2 * Math.PI,
            strokeDashoffset: radius * 2 * Math.PI * (1 + (fillPercent ?? 0)),
          }}
        />
      </svg>
      <div className='name'>{label}</div>
    </div>
  );
};

export default Circle;
