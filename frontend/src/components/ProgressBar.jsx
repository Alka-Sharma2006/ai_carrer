export default function ProgressBar({ value, label }) {
  return (
    <div className="progress-row">
      {label && <div className="progress-label"><span>{label}</span><b>{value}%</b></div>}
      <div className="progress-track"><span style={{ width: `${value}%` }} /></div>
    </div>
  )
}
