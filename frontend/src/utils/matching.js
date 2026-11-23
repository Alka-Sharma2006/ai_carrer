import { careers } from '../data/careers'

const normalize = (value = '') => value.toLowerCase().trim()
const overlap = (studentValues = [], careerValues = []) => {
  const source = studentValues.map(normalize)
  return careerValues.filter((item) => source.some((value) =>
    value === normalize(item) || normalize(item).includes(value) || value.includes(normalize(item))
  ))
}

export function recommendCareers(profile) {
  if (!profile) return []
  const skills = [...(profile.skills || [])]
  const interests = [...(profile.interests || [])]

  return careers.map((career) => {
    const matchingSkills = overlap(skills, career.requiredSkills)
    const skillScore = career.requiredSkills.length
      ? (matchingSkills.length / career.requiredSkills.length) * 100
      : 0
    const interestScore = overlap(interests, career.interests).length
      ? (overlap(interests, career.interests).length / career.interests.length) * 100
      : 0
    const academicScore = (profile.degree || '').toLowerCase().includes('science') ||
      career.academic.some((item) => normalize(profile.degree).includes(normalize(item)) ||
        normalize(profile.specialization).includes(normalize(item)))
      ? 100 : (career.academic.some((item) => normalize(profile.education).includes(normalize(item))) ? 75 : 35)
    const goalMatches = overlap([profile.careerGoals], career.goals)
    const goalScore = goalMatches.length ? 100 : overlap([profile.careerGoals], [career.title]).length ? 80 : 35
    const experienceScore = profile.experienceLevel === 'Advanced' ? 100 :
      profile.experienceLevel === 'Intermediate' ? 70 : 40

    const percentage = Math.round(
      skillScore * 0.40 + interestScore * 0.25 + academicScore * 0.15 +
      goalScore * 0.15 + experienceScore * 0.05
    )
    const missingSkills = career.requiredSkills.filter((skill) =>
      !skills.map(normalize).some((value) => normalize(skill).includes(value) || value.includes(normalize(skill)))
    )
    return {
      ...career,
      matchPercentage: Math.min(100, percentage),
      matchingSkills,
      missingSkills,
      reason: matchingSkills.length
        ? `Strong alignment with ${matchingSkills.slice(0, 3).join(', ')} and your ${profile.careerGoals || 'career'} goal.`
        : `A focused learning path can help you build the core skills for this role.`,
    }
  }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3)
}
