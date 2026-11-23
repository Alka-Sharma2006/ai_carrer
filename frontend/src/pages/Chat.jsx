import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { sendChatMessage } from '../services/api'

export default function Chat() {
  const profile = useSelector((state) => state.student.profile)
  const career = useSelector((state) => state.career.selectedCareer)
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi! I’m your CareerCompass AI Assistant. Ask me about careers, skills, interviews, resumes, or internships.' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages, loading])

  const send = async (event) => {
    event.preventDefault()
    const message = input.trim()
    if (!message || loading) return
    setMessages((current) => [...current, { role: 'user', text: message }])
    setInput('')
    setLoading(true)
    try {
      const response = await sendChatMessage({ message, profile, selectedCareer: career })
      setMessages((current) => [...current, { role: 'assistant', text: response.reply }])
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', text: `I couldn’t reach the AI service: ${error.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-page">
      <aside className="chat-sidebar"><span className="eyebrow">Career assistant</span><h1>CareerCompass <span>AI</span></h1><p>{profile ? `Ready to help ${profile.name || 'you'} plan the next step.` : 'Create a profile for personalized context.'}</p><div className="chat-topic-list"><b>Try asking</b><button onClick={() => setInput('Which skills should I learn next?')}>Which skills should I learn next?</button><button onClick={() => setInput('How can I prepare for a technical interview?')}>Prepare for an interview</button><button onClick={() => setInput('How should I build my resume for an internship?')}>Improve my resume</button></div></aside>
      <section className="chat-window">
        <div className="chat-header"><div className="assistant-avatar">AI</div><div><h2>CareerCompass AI Assistant</h2><span><i /> Online</span></div></div>
        <div className="messages">{messages.map((message, index) => <div className={`message ${message.role}`} key={index}>{message.role === 'assistant' && <div className="mini-avatar">AI</div>}<div className="bubble">{message.text}</div></div>)}{loading && <div className="message assistant"><div className="mini-avatar">AI</div><div className="bubble typing"><i /><i /><i /></div></div>}<div ref={bottomRef} /></div>
        <form className="chat-input" onSubmit={send}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about careers, skills, or interviews..." /><button type="submit" disabled={loading || !input.trim()}>Send <span>→</span></button></form>
      </section>
    </div>
  )
}
