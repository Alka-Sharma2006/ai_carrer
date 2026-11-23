export default function LoadingIndicator({ text = 'Loading...' }) {
  return <div className="loading"><span className="spinner" /> {text}</div>
}
