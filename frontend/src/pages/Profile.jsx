import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateProfile, setStudentId } from '../redux/studentSlice'
import { updateRecommendations } from '../redux/careerSlice'
import { createStudent } from '../services/api'
import { recommendCareers } from '../utils/matching'
import LoadingIndicator from '../components/LoadingIndicator'

const skillOptions = ['Python', 'JavaScript', 'Java', 'React', 'Node.js', 'HTML', 'CSS', 'SQL', 'MongoDB', 'Machine Learning', 'Statistics', 'Git', 'Docker', 'Cloud', 'Communication', 'Leadership']
const interestOptions = ['AI', 'Data', 'Programming', 'Web Development', 'Design', 'Cybersecurity', 'Cloud', 'Research', 'Business', 'Problem Solving']

export default function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', education: 'Undergraduate', degree: 'B.Tech', specialization: 'Computer Science',
    academicYear: '2nd Year', careerGoals: 'Software Development', preferredDomains: [],
    experienceLevel: 'Beginner', skills: [], interests: [],
  })

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const toggleArray = (field, value) => setForm((current) => ({
    ...current,
    [field]: current[field].includes(value)
      ? current[field].filter((item) => item !== value)
      : [...current[field], value],
  }))

  const submit = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) return setError('Please enter your name.')
    if (!form.skills.length) return setError('Select at least one technical or soft skill.')
    if (!form.interests.length) return setError('Select at least one interest.')
    setError('')
    setLoading(true)
    try {
      const response = await createStudent(form)
      dispatch(setStudentId(response.student?._id))
    } catch (apiError) {
      // The recommendation flow remains available if MongoDB is not running.
      setError(apiError.message)
    }
    dispatch(updateProfile(form))
    dispatch(updateRecommendations(recommendCareers(form)))
    setLoading(false)
    navigate('/recommendations')
  }

  return (
    <div className="form-layout">
      <aside className="form-intro">
        <span className="eyebrow">Student profile</span>
        <h1>Tell us about <span>your goals.</span></h1>
        <p>Your answers help us match you with careers and build an achievable learning plan.</p>
        <div className="profile-steps"><div className="active">1 <span>Academic</span></div><div>2 <span>Skills</span></div><div>3 <span>Goals</span></div></div>
      </aside>
      <form className="profile-form" onSubmit={submit}>
        {error && <div className="error-box">{error}</div>}
        <section>
          <h2>Academic background</h2>
          <div className="form-grid">
            <label>Name<input name="name" value={form.name} onChange={change} placeholder="Your full name" /></label>
            <label>Education<select name="education" value={form.education} onChange={change}><option>Undergraduate</option><option>Postgraduate</option><option>Diploma</option><option>High School</option></select></label>
            <label>Degree<select name="degree" value={form.degree} onChange={change}><option>B.Tech</option><option>B.Sc</option><option>BCA</option><option>B.Com</option><option>M.Tech</option><option>M.Sc</option><option>Other</option></select></label>
            <label>Branch / Specialization<input name="specialization" value={form.specialization} onChange={change} /></label>
            <label>Current academic year<select name="academicYear" value={form.academicYear} onChange={change}><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Graduated</option></select></label>
          </div>
        </section>
        <section>
          <h2>Skills</h2>
          <div className="choice-grid">{skillOptions.map((skill) => <button type="button" className={form.skills.includes(skill) ? 'choice selected' : 'choice'} key={skill} onClick={() => toggleArray('skills', skill)}>{skill}</button>)}</div>
        </section>
        <section>
          <h2>Interests & goals</h2>
          <div className="choice-grid">{interestOptions.map((interest) => <button type="button" className={form.interests.includes(interest) ? 'choice selected' : 'choice'} key={interest} onClick={() => toggleArray('interests', interest)}>{interest}</button>)}</div>
          <div className="form-grid goals-grid">
            <label>Career goal<input name="careerGoals" value={form.careerGoals} onChange={change} placeholder="e.g. AI, Web Development" /></label>
            <label>Experience level<select name="experienceLevel" value={form.experienceLevel} onChange={change}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
          </div>
        </section>
        <button className="primary-button form-submit" disabled={loading} type="submit">{loading ? <LoadingIndicator text="Building recommendations..." /> : 'Generate career matches →'}</button>
      </form>
    </div>
  )
}
