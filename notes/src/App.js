import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'
import noteService from './services/noteService'
import loginService from './services/login'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const noteFromRef = useRef()

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])
  // dodavanje notesa bez noteServices componente
  // const addNote = (event) => {
  //   event.preventDefault()
  //   const noteObject = {
  //     content: newNote,
  //     date: new Date().toISOString(),
  //     important: Math.random() > 0.5,
  //     id: notes.length + 1,
  //   }

  //   axios
  //   .post('http://localhost:3001/notes', noteObject)
  //   .then(response => {
  //     setNotes(notes.concat(response.data))
  //     setNewNote('')
  //   })
  // }

  // ova mozda radi
  // const addNote = (event) => {
  //   event.preventDefault()
  //   const noteObject = {
  //     content: newNote,
  //     date: new Date().toISOString(),
  //     important: Math.random() > 0.5,
  //     id: notes.length + 1,
  //   }

  //   noteService
  //     .create(noteObject)
  //     .then(returnedNote => {
  //       setNotes(notes.concat(returnedNote))
  //       setNewNote('')
  //     })
  // }

  // mozda ona od gore radi ako ova ne
  // const addNote = (event) => {
  //   event.preventDefault()
  //   const noteObject = {
  //     content: newNote,
  //     important: Math.random() > 0.5,
  //   }

  //   noteService
  //     .create(noteObject)
  //       .then(returnedNote => {
  //       setNotes(notes.concat(returnedNote))
  //       setNewNote('')
  //     })
  // }

    // metoda za update bez noteService komponente
  // const toggleImportanceOf = id => {
  //   const url = `http://localhost:3001/notes/${id}`
  //   const note = notes.find(n => n.id === id)
  //   const changedNote = {...note, important: !note.important}
    
  //   axios
  //   .put(url, changedNote)
  //   .then(response => {
  //     setNotes(notes.map(n => 
  //       n.id !== id? n: response.data))
  //   })
  // }

  // const toggleImportanceOf = id => {
  //   const note = notes.find(n => n.id === id)
  //   const changedNote = {...note, important: !note.important}
  
  //   noteService
  //   .update(id,changedNote)
  //   .then(returnedNote => {
  //     setNotes(notes.map(note => note.id !== id ? note: returnedNote))
  //   })
  //   .catch(error => {
  //     alert(
  //       `the note ${note.content} was already deleted from server`
  //     )
  //     setNotes(notes.filter(n => n.id !== id))
  //   })
  // }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
 }

   const notesToShow = showAll
   ? notes
   : notes.filter(note => note.important)

   const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      noteService.setToken(user.token)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  
  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFromRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )
    // <form onSubmit={handleLogin}>
    //     <div>
    //       username 
    //        <input 
    //       type="text" 
    //       value={username} 
    //       name="Username"
    //       onChange={({ target }) => setUsername(target.value)}
    //       />
    //     </div>
    //     <div>
    //       password
    //       <input
    //       type="password"
    //       value={password}
    //       name="Password"
    //       onChange={({ target }) => setPassword(target.value)}
    //       />
    //     </div>
    //     <button type="submit">login</button>
    //   </form>
 // }
      return (
        <div>
          <h1>Notes app</h1>
          <Notification message={errorMessage} />
    {/*       
      {user === null && loginForm()}
      {user !== null && noteForm()} */}

      {/* ovo je isto kao i ovo gore samo pomocu conditional operatora*/}

      {/* {user === null ? loginForm() : noteForm()} */}
          {!user &&
            <Togglable buttonLabel="log in">
              <LoginForm
                username={username}
                password={password}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleSubmit={handleLogin}
              />
            </Togglable>
          }
          {user &&
            <div>
              <p>{user.name} logged in</p>
              <Togglable buttonLabel="new note">
                <NoteForm createNote={addNote} />
              </Togglable>
            </div>
          }
     
          <div>
            <button onClick={() => setShowAll(!showAll)}>
              show {showAll ? 'important' : 'all' }
            </button>
          </div> 
          <ul>
            {notesToShow.map(note => 
              <Note
                key={note.id}
                note={note}
                toggleImportance={() => toggleImportanceOf(note.id)}
              />
            )}
          </ul>
    
          <Footer />
        </div>
      )
    }
    
    export default App