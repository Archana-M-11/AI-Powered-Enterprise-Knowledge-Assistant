import Chatwindow from "../components/Chatwindow"
import Navbar from "../components/Navbar"
import React from 'react'
import Chatinput from "../components/Chatinput"

const ChatPage = () => {
  return (
   <>
    <Navbar/>
    <Chatwindow/>
    <Chatinput/>
   </>
  )
}

export default ChatPage