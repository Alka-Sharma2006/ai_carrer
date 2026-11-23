import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="landing">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="pill">AI-powered career guidance</span>
          <h1>Discover your skills.<br /><span>Design your future.</span></h1>
          <p>Personalized career recommendations, skill-gap insights, and practical learning roadmaps built around you.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/profile">Get started <span>→</span></Link>
            <a className="secondary-button" href="#how-it-works">See how it works</a>
          </div>
          <div className="trust-row"><b>10+</b> career paths <i /> <b>AI</b> powered guidance</div>
        </div>
        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="career-orb"><span>Career</span><strong>Compass</strong><small>AI</small></div>
          <div className="float-card float-one"><b>92%</b><span>Career match</span></div>
          <div className="float-card float-two"><b>18</b><span>Skills mapped</span></div>
        </div>
      </section>

      <section className="feature-strip" id="how-it-works">
        <div><span>01</span><h3>Build your profile</h3><p>Share your education, goals, interests, and skills.</p></div>
        <div><span>02</span><h3>Discover careers</h3><p>Get explainable matches ranked with a weighted engine.</p></div>
        <div><span>03</span><h3>Grow with a roadmap</h3><p>Close skill gaps with a personalized learning plan.</p></div>
      </section>

      <section className="career-categories">
        <span className="eyebrow">Explore possibilities</span>
        <h2>Popular career categories</h2>
        <div className="category-grid">
          {['Data & AI', 'Software Development', 'Cybersecurity', 'Cloud & DevOps'].map((category, index) =>
            <div className="category-card" key={category}><span>0{index + 1}</span><h3>{category}</h3><p>{['Analytics, ML and AI', 'Frontend, backend and full stack', 'Security and risk', 'Infrastructure and automation'][index]}</p></div>
          )}
        </div>
      </section>
    </div>
  )
}
