export default function Reticle({ size=64 }){
  const s = size; const r3 = s*0.46, r2 = s*0.34, r1 = s*0.24; const mid = s/2;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx={mid} cy={mid} r={r3} stroke="#3C5AA0" strokeWidth={Math.max(1, s*0.03)} />
        <circle cx={mid} cy={mid} r={r2} stroke="#4461AA" strokeWidth={Math.max(1, s*0.022)} />
        <circle cx={mid} cy={mid} r={r1} stroke="#6366F1" strokeWidth={Math.max(1, s*0.04)} />
        <line x1={mid-r3} y1={mid} x2={mid+r3} y2={mid} stroke="#3C5AA0" strokeWidth={Math.max(1, s*0.03)} />
        <line x1={mid} y1={mid-r3} x2={mid} y2={mid+r3} stroke="#3C5AA0" strokeWidth={Math.max(1, s*0.03)} />
        <circle cx={mid} cy={mid} r={s*0.04} fill="#22D3EE" />
      </g>
    </svg>
  );
}