import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'

export default function SkillGap() {
  const career = useSelector((state) => state.career.selectedCareer)
  const profile = useSelector((state) => state.student.profile)
  if (!career || !profile) return <div className="empty-state"><h1>No career selected</h1><Link className="primary-button" to="/recommendations">View recommendations</Link></div>

  const existing = profile.skills
  const matching = career.requiredSkills.filter((skill) => existing.some((item) =>
    skill.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(skill.toLowerCase())
  ))
  const missing = career.requiredSkills.filter((skill) => !matching.includes(skill))
  const readiness = career.requiredSkills.length ? Math.round((matching.length / career.requiredSkills.length) * 100) : 0

  return (
    <div className="content-page">
      <header className="page-header"><div><span className="eyebrow">Skill gap analysis</span><h1>{career.title} readiness</h1></div><Link className="primary-button" to="/roadmap">Generate roadmap</Link></header>
      <div className="readiness-card"><div><span>Overall readiness</span><b>{readiness}%</b></div><ProgressBar value={readiness} /></div>
      <div className="skill-columns">
        <section className="panel"><div className="panel-title"><span className="status-dot green" /><h2>Skills you have</h2></div>{existing.map((skill) => <div className="skill-row" key={skill}><span>{skill}</span><span className={matching.includes(skill) ? 'status ready' : 'status'}>{matching.includes(skill) ? 'Career-ready' : 'Supporting'}</span></div>)}</section>
        <section className="panel"><div className="panel-title"><span className="status-dot amber" /><h2>Skills to learn</h2></div>{missing.map((skill) => <div className="skill-row" key={skill}><span>{skill}</span><span className="status missing-status">Missing</span></div>)}{missing.length === 0 && <p>You cover all core skills.</p>}</section>
      </div>
      <section className="panel recommendations-panel"><h2>Recommended learning</h2><div className="tag-list">{[...missing, ...career.recommendedSkills].map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div></section>
    </div>
  )
}
