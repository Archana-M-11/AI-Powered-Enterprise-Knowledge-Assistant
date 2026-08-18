import Chatwindow from "../components/Chatwindow"
import Navbar from "../components/Navbar"
import React,{useState} from 'react'
import Chatinput from "../components/Chatinput"

const ChatPage = () => {
  const [messages, setMessages] = useState([])
  return (
   <>
    <Navbar/>
    <main>
    <Chatwindow messages={messages}/>
    <Chatinput setMessages={setMessages}/>
    </main>
   </>
  )
}

export default ChatPage