// 📁 src/components/DonutChart/DonutChart.tsx
// Rueda estadística (donut) reutilizable hecha con SVG puro: no requiere librerías.
// Cada segmento se dibuja como un círculo con stroke-dasharray; al cambiar los
// valores, la rueda se anima sola gracias a la transición CSS.

export interface DonutSegment {
  label: string;
  value: number;
  color: string; // color hexadecimal
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerLabel: string; // texto grande en el centro (ej. "40%")
  centerSubLabel?: string; // texto pequeño bajo el principal
  size?: number; // ancho/alto del SVG en px
  thickness?: number; // grosor del anillo en px
}

export default function DonutChart({
  segments,
  centerLabel,
  centerSubLabel,
  size = 180,
  thickness = 22,
}: DonutChartProps) {
  const center = size / 2;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((acc, s) => acc + s.value, 0);

  // Calcula cuánto mide cada arco y dónde empieza (acumulando los anteriores)
  let acumulado = 0;
  const arcos = segments.map((s) => {
    const largo = total > 0 ? (s.value / total) * circumference : 0;
    const arco = { ...s, largo, offset: -acumulado };
    acumulado += largo;
    return arco;
  });

  const descripcion = segments.map((s) => `${s.label}: ${s.value}`).join(', ');

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`Gráfico de rueda. ${descripcion}`}
        >
          {/* Pista de fondo (se ve cuando no hay datos) */}
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#1e293b" strokeWidth={thickness} />

          {/* Segmentos: giramos -90° para que el primero empiece arriba */}
          <g transform={`rotate(-90 ${center} ${center})`}>
            {arcos.map(
              (a) =>
                a.largo > 0 && (
                  <circle
                    key={a.label}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={a.color}
                    strokeWidth={thickness}
                    strokeDasharray={`${a.largo} ${circumference - a.largo}`}
                    strokeDashoffset={a.offset}
                    style={{ transition: 'stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease' }}
                  >
                    <title>{`${a.label}: ${a.value}`}</title>
                  </circle>
                )
            )}
          </g>
        </svg>

        {/* Texto centrado sobre la rueda */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-white leading-none">{centerLabel}</span>
          {centerSubLabel && (
            <span className="text-[10px] text-slate-400 uppercase font-mono mt-1">{centerSubLabel}</span>
          )}
        </div>
      </div>

      {/* Leyenda */}
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px]">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-1.5 text-slate-300">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
            <strong className="text-white font-mono">{s.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
