import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CareerCard from '../components/CareerCard'

export default function Recommendations() {
  const recommendations = useSelector((state) => state.career.recommendations)

  if (!recommendations.length) {
    return <div className="empty-state"><h1>Build your profile first</h1><p>Generate personalized recommendations from your skills and goals.</p><Link className="primary-button" to="/profile">Create profile</Link></div>
  }

  return (
    <div className="content-page">
      <header className="page-header"><div><span className="eyebrow">Matched for you</span><h1>Your top career matches</h1></div><Link className="secondary-button" to="/profile">Edit profile</Link></header>
      <div className="career-grid">{recommendations.map((career) => <CareerCard key={career.title} career={career} />)}</div>
    </div>
  )
}
