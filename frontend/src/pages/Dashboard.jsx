import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CareerCard from '../components/CareerCard'
import ProgressBar from '../components/ProgressBar'

export default function Dashboard() {
  const profile = useSelector((state) => state.student.profile)
  const recommendations = useSelector((state) => state.career.recommendations)
  const selectedCareer = useSelector((state) => state.career.selectedCareer)
  const completedTasks = useSelector((state) => state.roadmap.completedTasks)
  const roadmap = useSelector((state) => state.roadmap.roadmap)
  const totalTasks = roadmap?.phases?.reduce((sum, phase) => sum + (phase.tasks?.length || 0), 0) || 0
  const progress = totalTasks ? Math.round((completedTasks.length / totalTasks) * 100) : 0

  if (!profile) {
    return <div className="empty-state"><h1>Welcome to CareerCompass</h1><p>Create your profile to unlock recommendations and a learning roadmap.</p><Link className="primary-button" to="/profile">Create my profile</Link></div>
  }

  return (
    <div className="content-page">
      <header className="dashboard-heading"><div><span className="eyebrow">Career dashboard</span><h1>Welcome back, {profile.name}</h1><p>{profile.degree} · {profile.specialization} · {profile.academicYear}</p></div><Link className="primary-button" to="/recommendations">View recommendations</Link></header>
      <div className="dashboard-grid">
        <section className="panel profile-summary"><h2>Profile summary</h2><div className="summary-item"><span>Career goal</span><b>{profile.careerGoals}</b></div><div className="summary-item"><span>Experience</span><b>{profile.experienceLevel}</b></div><div className="summary-item"><span>Skills</span><b>{profile.skills.length} mapped</b></div></section>
        <section className="panel selected-panel"><h2>Selected career</h2>{selectedCareer ? <><h3>{selectedCareer.title}</h3><ProgressBar value={selectedCareer.matchPercentage} label="Career match" /><Link className="text-button" to="/skill-gap">Review skill gap →</Link></> : <><p>No career selected yet.</p><Link className="text-button" to="/recommendations">Choose a career →</Link></>}</section>
        <section className="panel roadmap-summary"><h2>Learning progress</h2><div className="big-progress"><b>{progress}%</b><span>roadmap complete</span></div><ProgressBar value={progress} /><Link className="text-button" to="/roadmap">Open roadmap →</Link></section>
      </div>
      <section className="top-matches"><div className="section-heading"><h2>Top recommended careers</h2><Link to="/recommendations">View all</Link></div><div className="career-grid">{recommendations.slice(0, 3).map((career) => <CareerCard key={career.title} career={career} compact />)}</div></section>
    </div>
  )
}
