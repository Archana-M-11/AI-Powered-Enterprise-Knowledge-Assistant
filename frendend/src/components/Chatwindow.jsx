import React from 'react'

const Chatwindow = () => {
  return (
   <section className='sorces'>
      <div className='msg user'>
        <div className='msg-role'>YOU</div>
        <div>
          What is leave policy?
        </div>
      </div>

      <div className='msg assistant'>
        <div className='msg-role'>ASSISTANT</div>
        <div className='answer'>
          Employees are entitled to 20 days of annual leave.
        </div>
        <div className="sources">
          <div className="source-card">
            <span className="source-idx">01</span>
            <span className="source-name text-break">Leave_Policy.pdf</span>
            <span className="source-meta">Page 3</span>
          </div>
        </div>
      </div>
   </section>
  )
}

export default Chatwindow