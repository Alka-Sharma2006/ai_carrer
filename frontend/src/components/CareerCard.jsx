import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { selectCareer } from '../redux/careerSlice'

export default function CareerCard({ career, compact = false }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const explore = () => {
    dispatch(selectCareer(career))
    navigate('/career-details')
  }

  return (
    <article className={`career-card ${compact ? 'compact' : ''}`}>
      <div className="career-card-head">
        <div>
          <span className="eyebrow">Career match</span>
          <h3>{career.title}</h3>
        </div>
        <div className="match-score">{career.matchPercentage}%</div>
      </div>
      <p>{career.description}</p>
      <div className="progress-track"><span style={{ width: `${career.matchPercentage}%` }} /></div>
      {!compact && (
        <>
          <p className="match-reason"><b>Why it fits:</b> {career.reason}</p>
          <div className="tag-list">
            {career.matchingSkills.slice(0, 4).map((skill) => <span className="tag match" key={skill}>{skill}</span>)}
            {career.missingSkills.slice(0, 3).map((skill) => <span className="tag missing" key={skill}>{skill}</span>)}
          </div>
        </>
      )}
      <button className="text-button" type="button" onClick={explore}>Explore career <span>→</span></button>
    </article>
  )
}
