import React, { useState } from 'react'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  if (!props.show) {
    return null
  }
  const authors = props.authors

  const submit = async (event) => {
    event.preventDefault()

    await props.setBirthyear({ variables: { name, setBornTo: Number(born) } })
    props.loadAuthors()
    setName('')
    setBorn('')
  }

  let setBirthyearFrom = null
  if (props.token) {
    setBirthyearFrom = (
      <>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
          <div>
            name
        <select value={name} onChange={({ target }) => setName(target.value)} required>
              <option style={{ display: "none" }} value="" defaultValue>Select author</option>
              {authors.map(author =>
                <option key={author.name} value={author.name}>{author.name}</option>
              )}
            </select>
          </div>
          <div>
            born
        <input
              type='number'
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          <button type='submit'>update author</button>
        </form>
      </>
    )
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      {setBirthyearFrom}
    </div>
  )
}

export default Authors
