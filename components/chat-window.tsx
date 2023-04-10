import { useState } from 'react'

type GPTMessage = {
    role: 'user' | 'assistant'
    content: string
}

const ChatWindow = () => {
    const [messages, setMessages] = useState<GPTMessage[]>([])
    const [messageInput, setMessageInput] = useState('')

    const sendPrompt = async () => {
        try {
            const { response } = await (await fetch('/api/gpt', { method: 'POST', body: JSON.stringify({ messages }) })).json()
            console.log(response)
            setMessages(prev => [...prev, response])
        } catch (error) {
            console.error(error)
        }
    }

    function handleSubmit(e: any) {
        e.preventDefault()
        if (!messageInput) return
        messages.push({ role: 'user', content: messageInput })
        setMessageInput('')
        sendPrompt()
    }

    return (
        <div className="flex flex-col flex-1">
            <div className="flex-grow flex-shrink overflow-y-auto p-4">
                {messages.map((message, index) => (
                    <div key={index} className="flex">
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
                <form onSubmit={handleSubmit} className="flex min-w-[400px]">
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
