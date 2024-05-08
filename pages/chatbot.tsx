import React, { useState } from 'react';
import axios from 'axios'
import { query } from 'express';
// Define the interface right above your component or in a separate types file
interface Message {
  id?: number;
  text: string;
  sender: 'user' | 'bot';
}

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (input.trim() !== '') {
            const newMessage: Message = {
                id: messages.length + 1,
                text: input,
                sender: 'user'
            };
            setMessages([...messages, newMessage]);  // Add new user message to messages
            setInput('');

            // Simulate a bot response
            
                const response = await axios.post('/api/chat',  {
                    query:input
                });
                const botResponse: Message = {
                    id: messages.length + 2,
                    text: `${response}`,
                    sender: 'bot'
                };
                setMessages(prevMessages => [...prevMessages, botResponse]);
           
        }
    };

    return (
        <div className="chat-interface">
            <div className="message-list">
                {messages.map((message: Message) => (
                    <div key={message.id} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="input-form">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    className="input-box"
                />
                <button type="submit" className="submit-button">Send</button>
            </form>
        </div>
    );
};

export default ChatInterface;
