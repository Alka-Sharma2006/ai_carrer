import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function CareerDetails() {
  const career = useSelector((state) => state.career.selectedCareer)
  const profile = useSelector((state) => state.student.profile)
  if (!career) return <div className="empty-state"><h1>Select a career</h1><Link className="primary-button" to="/recommendations">View recommendations</Link></div>

  return (
    <div className="content-page detail-layout">
      <article className="detail-main">
        <span className="eyebrow">Career overview</span>
        <h1>{career.title}</h1>
        <p className="lead">{career.description}</p>
        <div className="detail-actions"><Link className="primary-button" to="/skill-gap">Analyze skill gap</Link><Link className="secondary-button" to="/recommendations">Back to matches</Link></div>
        <section className="detail-section"><h2>What you will do</h2><p>This role combines {career.interests.slice(0, 3).join(', ').toLowerCase()} expertise with practical problem-solving and continuous learning.</p></section>
        <section className="detail-section"><h2>Core skills</h2><div className="tag-list">{career.requiredSkills.map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div></section>
        <section className="detail-section"><h2>Learning suggestions</h2><div className="suggestion-grid">{career.suggestions.map((suggestion) => <div key={suggestion}><span>✓</span><p>{suggestion}</p></div>)}</div></section>
      </article>
      <aside className="detail-aside">
        <div className="match-ring" style={{ '--value': `${career.matchPercentage * 3.6}deg` }}><div><b>{career.matchPercentage}%</b><span>match</span></div></div>
        <h3>Based on your profile</h3>
        <p>{profile?.careerGoals || 'Career goals'} · {profile?.experienceLevel || 'Beginner'}</p>
      </aside>
    </div>
  )
}
