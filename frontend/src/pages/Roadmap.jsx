import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setRoadmap, toggleTask } from '../redux/roadmapSlice'
import { generateRoadmap } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import ProgressBar from '../components/ProgressBar'

const fallbackPhases = (career, missing) => [
  { title: 'Phase 1: Fundamentals', duration: '2 weeks', topics: ['Core concepts', 'Tools and workflow'], tasks: ['Review fundamentals', 'Set up your development environment'], projects: ['Create a structured learning notebook'], resources: ['MDN Web Docs', 'freeCodeCamp'] },
  { title: 'Phase 2: Core Technical Skills', duration: '4 weeks', topics: missing.slice(0, 4), tasks: missing.slice(0, 4).map((skill) => `Build practical proficiency in ${skill}`), projects: ['Complete a guided mini project'], resources: ['Official documentation', 'freeCodeCamp'] },
  { title: 'Phase 3: Advanced Skills', duration: '3 weeks', topics: career?.recommendedSkills || ['Advanced tools'], tasks: (career?.recommendedSkills || ['Advanced tools']).map((skill) => `Apply ${skill} in a real scenario`), projects: ['Design an advanced feature'], resources: ['Official product guides', 'MDN'] },
  { title: 'Phase 4: Practical Projects', duration: '4 weeks', topics: ['Portfolio', 'Deployment', 'Testing'], tasks: ['Build a complete portfolio project', 'Document decisions and outcomes', 'Deploy and test'], projects: ['Career-focused capstone project'], resources: ['GitHub', 'Official deployment documentation'] },
  { title: 'Phase 5: Interview Preparation', duration: '2 weeks', topics: ['Interview concepts', 'Communication', 'Resume'], tasks: ['Solve role-specific practice questions', 'Prepare project stories', 'Complete mock interviews'], projects: ['Create a polished case study'], resources: ['Interview guides', 'freeCodeCamp'] },
]

export default function Roadmap() {
  const dispatch = useDispatch()
  const profile = useSelector((state) => state.student.profile)
  const career = useSelector((state) => state.career.selectedCareer)
  const roadmap = useSelector((state) => state.roadmap.roadmap)
  const completedTasks = useSelector((state) => state.roadmap.completedTasks)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    if (!career || !profile) return
    setLoading(true)
    setError('')
    const missingSkills = career.requiredSkills.filter((skill) => !profile.skills.some((item) =>
      skill.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(skill.toLowerCase())
    ))
    try {
      const response = await generateRoadmap({ student: profile, selectedCareer: career, missingSkills })
      dispatch(setRoadmap(response.roadmap))
    } catch (apiError) {
      dispatch(setRoadmap({ title: `${career.title} Learning Roadmap`, phases: fallbackPhases(career, missingSkills) }))
      setError(`AI service unavailable: ${apiError.message}. A structured fallback roadmap is shown.`)
    } finally {
      setLoading(false)
    }
  }

  const allTasks = roadmap?.phases?.flatMap((phase, phaseIndex) =>
    (phase.tasks || []).map((task, taskIndex) => `${phaseIndex}-${taskIndex}-${task}`)
  ) || []
  const progress = allTasks.length ? Math.round((completedTasks.length / allTasks.length) * 100) : 0

  if (!career) return <div className="empty-state"><h1>Select a career first</h1><a className="primary-button" href="/recommendations">View careers</a></div>

  return (
    <div className="content-page">
      <header className="page-header"><div><span className="eyebrow">Personalized roadmap</span><h1>{career.title} learning plan</h1></div><button className="primary-button" type="button" onClick={generate} disabled={loading}>{loading ? <LoadingIndicator text="Generating..." /> : roadmap ? 'Regenerate roadmap' : 'Generate with AI'}</button></header>
      {error && <div className="error-box">{error}</div>}
      {roadmap ? (
        <>
          <div className="readiness-card roadmap-progress"><div><span>Roadmap progress</span><b>{progress}%</b></div><ProgressBar value={progress} /></div>
          <div className="roadmap-list">{roadmap.phases.map((phase, phaseIndex) => (
            <section className="roadmap-phase" key={phase.title}>
              <div className="phase-marker"><span>{phaseIndex + 1}</span></div>
              <div className="phase-card"><div className="phase-header"><div><h2>{phase.title}</h2><div className="tag-list">{(phase.topics || []).map((topic) => <span className="tag" key={topic}>{topic}</span>)}</div></div><span className="duration">{phase.duration}</span></div>
                <div className="phase-body"><div><h3>Learning tasks</h3>{(phase.tasks || []).map((task, taskIndex) => { const id = `${phaseIndex}-${taskIndex}-${task}`; return <label className="task-row" key={id}><input type="checkbox" checked={completedTasks.includes(id)} onChange={() => dispatch(toggleTask(id))} /><span>{task}</span></label> })}</div><div><h3>Projects</h3>{(phase.projects || []).map((project) => <p className="resource-item" key={project}>▸ {project}</p>)}</div><div><h3>Resources</h3>{(phase.resources || []).map((resource) => <p className="resource-item" key={resource}>▸ {resource}</p>)}</div></div>
              </div>
            </section>
          ))}</div>
        </>
      ) : <div className="generate-state"><div className="generate-icon">✦</div><h2>Ready to build your path</h2><p>Gemini will personalize five phases using your profile, selected career, and missing skills.</p><button className="primary-button" type="button" onClick={generate} disabled={loading}>{loading ? <LoadingIndicator text="Creating your plan..." /> : 'Create my learning roadmap'}</button></div>}
    </div>
  )
}
