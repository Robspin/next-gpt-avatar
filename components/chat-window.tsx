import { useState } from 'react'

type GPTMessage = {
    role: 'user' | 'assistant'
    content: string
}

const ChatWindow = () => {
    const [messages, setMessages] = useState<GPTMessage[]>([])
    const [messageInput, setMessageInput] = useState('')
    const [listeningForPrompt, setListeningForPrompt] = useState(false)

    const handleSpeechSynthesis = (text: string) => {
        const synth = window.speechSynthesis
        const utterance = new SpeechSynthesisUtterance(text)
        const samantha = synth.getVoices().filter((voice) => voice.voiceURI === 'Samantha')[0]
        utterance.voice = samantha
        synth.speak(utterance)
    }

    const handleSpeechRecognition = () => {
        if (typeof window === 'undefined') return
        // @ts-ignore
        const recognition = new window.webkitSpeechRecognition()
        recognition.continuous = true
        recognition.lang = 'en-US'
        recognition.start()
        recognition.onresult = (event: any) => {
            const results = event.results
            const transcript = results[results.length  - 1][0].transcript
            console.log(transcript.toLowerCase().includes('gpt'))
            if (transcript.toLowerCase().includes('gpt') && !listeningForPrompt) {
                setListeningForPrompt(true)
                handleSpeechSynthesis('Yes?')
            } else if (listeningForPrompt) {
                const m: GPTMessage[] = [...messages, { role: 'user', content: transcript}]
                setMessages(m)
                sendPrompt(m)
                setListeningForPrompt(false)
            }

        }
    }

    handleSpeechRecognition()

    const sendPrompt = async (messages: GPTMessage[]) => {
        try {
            const { response } = await (await fetch('/api/gpt', { method: 'POST', body: JSON.stringify({ messages }) })).json()
            handleSpeechSynthesis(response.content)
            setMessages(prev => [...prev, response])
        } catch (error) {
            console.error(error)
        }
    }

    function handleSubmit(e: any) {
        e.preventDefault()
        if (!messageInput) return
        const m: GPTMessage[] = [...messages, { role: 'user', content: messageInput}]
        setMessages(m)
        sendPrompt(m)
        setMessageInput('')
    }

    return (
        <div className="flex flex-col flex-1 row-span-2 items-center -ml-2">
            <div className="flex-grow flex-shrink overflow-y-auto px-4">
                {messages.map((message, index) => (
                    <div key={index} className="flex justify-center items-center">
                        <div
                            className={`my-2 rounded-lg py-2 px-4 ${
                                message.role === 'user' ? 'bg-gray-200 text-right ml-auto' : 'bg-blue-200 text-left mr-auto'
                            }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="flex min-w-[400px] px-2 pb-1">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatWindow
