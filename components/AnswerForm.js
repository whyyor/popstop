import { useState } from "react"
import { web3 } from "../lib/web3"

const AnswerForm = function ({ accounts, setAnswers, isLoggedIn }) {
  const [message, setMessage] = useState("")

  const post = async function (event) {
    event.preventDefault()

    setMessage('')

    const confirmationMessage = "This message is to verify that you are the person who is posting this reply"

    const signedMessage = await web3.eth.personal.sign(confirmationMessage,accounts[0])

    // TODO!
    // send the message state to the /api/answers
    // but we need to verify who we say we are!
    // we don't want people pretending it's us!

    const data = {
      questionId: 1,
      reply: message,
      account: accounts[0],
      confirmationMessage: confirmationMessage,
      signedMessage: signedMessage
    }

    fetch("/api/answers", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        setAnswers(current => {
      return [...current,data]
    })
     })
    .catch(error => {
     console.error(error)
    })
  }

  return (
    <form onSubmit={post} className="answer-form">
      <textarea
        placeholder="Please be nice and courteous in your answers!"
        value={message}
        onChange={e => setMessage(e.target.value)}>
      </textarea>

      <button disabled={!isLoggedIn}>Reply</button>
    </form>
  )
}

export default AnswerForm
