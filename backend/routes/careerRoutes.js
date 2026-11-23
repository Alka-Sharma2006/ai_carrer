const express = require('express')
const router = express.Router()

const careers = [
  { title:'Data Analyst', description:'Turn data into clear decisions.', requiredSkills:['SQL','Excel','Python','Statistics','Tableau','Power BI'], interests:['Data','Analytics','Business','Problem Solving'], academic:['Science','Engineering','Commerce','Computer Science','Statistics'], goals:['Analytics','Business Intelligence','Data'], recommendedSkills:['Data Visualization','Business Intelligence'], learningSuggestions:['Learn SQL','Build dashboards','Practice statistics'] },
  { title:'Data Scientist', description:'Discover patterns in complex data.', requiredSkills:['Python','Statistics','Machine Learning','SQL','Pandas','Data Visualization'], interests:['Data','AI','Research','Problem Solving'], academic:['Science','Engineering','Computer Science','Statistics'], goals:['Data Science','AI','Research'], recommendedSkills:['Deep Learning','Model Deployment'], learningSuggestions:['Strengthen statistics','Complete Kaggle projects','Learn model evaluation'] },
  { title:'Machine Learning Engineer', description:'Productionize machine learning systems.', requiredSkills:['Python','Machine Learning','Deep Learning','SQL','Docker','Git'], interests:['AI','Programming','Research','Automation'], academic:['Computer Science','Engineering','Science'], goals:['AI','Machine Learning','Software'], recommendedSkills:['MLOps','Cloud','TensorFlow'], learningSuggestions:['Practice ML pipelines','Deploy models','Learn MLOps'] },
  { title:'AI Engineer', description:'Create generative AI applications.', requiredSkills:['Python','Machine Learning','APIs','LLMs','Prompt Engineering','Git'], interests:['AI','Programming','Innovation','Research'], academic:['Computer Science','Engineering','Science'], goals:['AI','Generative AI','Software'], recommendedSkills:['RAG','Vector Databases','Cloud'], learningSuggestions:['Build LLM apps','Study RAG','Practice API integration'] },
  { title:'Full Stack Developer', description:'Build complete web products.', requiredSkills:['JavaScript','React','Node.js','Express','MongoDB','Git','HTML','CSS'], interests:['Programming','Web Development','Design','Problem Solving'], academic:['Computer Science','Engineering','Information Technology'], goals:['Software Development','Web Development','Full Stack'], recommendedSkills:['TypeScript','Docker','Testing'], learningSuggestions:['Build an end-to-end app','Learn REST APIs','Deploy projects'] },
  { title:'Frontend Developer', description:'Create responsive user experiences.', requiredSkills:['HTML','CSS','JavaScript','React','Git','Responsive Design'], interests:['Design','Web Development','Programming','User Experience'], academic:['Computer Science','Engineering','Design','Information Technology'], goals:['Frontend','Web Development','UI Engineering'], recommendedSkills:['Redux','Testing','Accessibility'], learningSuggestions:['Build responsive interfaces','Learn accessibility','Practice React state'] },
  { title:'Backend Developer', description:'Create secure APIs and database systems.', requiredSkills:['Node.js','Express','MongoDB','SQL','REST APIs','Git'], interests:['Programming','Databases','Problem Solving','Systems'], academic:['Computer Science','Engineering','Information Technology'], goals:['Backend','Web Development','Software Development'], recommendedSkills:['Docker','Redis','Testing'], learningSuggestions:['Design REST APIs','Learn database modeling','Practice authentication'] },
  { title:'Software Engineer', description:'Solve broad technical problems.', requiredSkills:['Data Structures','Algorithms','Git','JavaScript','Testing','Problem Solving'], interests:['Programming','Problem Solving','Systems','Innovation'], academic:['Computer Science','Engineering','Information Technology'], goals:['Software Development','Engineering','Technology'], recommendedSkills:['System Design','Docker','Linux'], learningSuggestions:['Master DSA','Contribute to projects','Practice system design'] },
  { title:'Cybersecurity Analyst', description:'Protect systems and investigate threats.', requiredSkills:['Networking','Linux','Security Fundamentals','Python','Risk Assessment'], interests:['Security','Networking','Problem Solving','Technology'], academic:['Computer Science','Engineering','Information Technology'], goals:['Cybersecurity','Security','Technology'], recommendedSkills:['Ethical Hacking','SIEM','Cloud Security'], learningSuggestions:['Learn networking','Practice labs','Study security frameworks'] },
  { title:'Cloud Engineer', description:'Operate resilient cloud infrastructure.', requiredSkills:['Cloud','Linux','Networking','Docker','CI/CD','Git'], interests:['Cloud','Systems','Automation','Infrastructure'], academic:['Computer Science','Engineering','Information Technology'], goals:['Cloud','DevOps','Infrastructure'], recommendedSkills:['Kubernetes','Terraform','Monitoring'], learningSuggestions:['Learn cloud fundamentals','Deploy containers','Practice CI/CD'] },
]

const normalize = (value = '') => value.toLowerCase().trim()
const matches = (studentValues = [], careerValues = []) => careerValues.filter((item) =>
  studentValues.map(normalize).some((value) => normalize(item).includes(value) || value.includes(normalize(item))))

router.get('/', (req, res) => res.json({ careers }))

router.post('/recommend', (req, res) => {
  const profile = req.body
  if (!profile?.name) return res.status(400).json({ message: 'Student profile is required' })
  const recommendations = careers.map((career) => {
    const matchingSkills = matches(profile.skills || [], career.requiredSkills)
    const skillScore = career.requiredSkills.length ? matchingSkills.length / career.requiredSkills.length * 100 : 0
    const interestMatches = matches(profile.interests || [], career.interests)
    const interestScore = interestMatches.length ? interestMatches.length / career.interests.length * 100 : 0
    const text = `${profile.degree || ''} ${profile.specialization || ''} ${profile.education || ''}`.toLowerCase()
    const academicScore = career.academic.some((item) => text.includes(item.toLowerCase())) ? 100 : 35
    const goalScore = normalize(profile.careerGoals).includes(normalize(career.title)) ||
      career.goals.some((goal) => normalize(profile.careerGoals).includes(normalize(goal))) ? 100 : 35
    const experienceScore = profile.experienceLevel === 'Advanced' ? 100 : profile.experienceLevel === 'Intermediate' ? 70 : 40
    const matchPercentage = Math.round(skillScore * .40 + interestScore * .25 + academicScore * .15 + goalScore * .15 + experienceScore * .05)
    const missingSkills = career.requiredSkills.filter((skill) => !matchingSkills.includes(skill))
    return { ...career, matchPercentage: Math.min(matchPercentage, 100), matchingSkills, missingSkills,
      reason: matchingSkills.length ? `Strong alignment with ${matchingSkills.slice(0, 3).join(', ')} and your career goal.` : 'A focused learning plan can build the core skills for this role.' }
  }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3)
  res.json({ recommendations })
})

module.exports = router
