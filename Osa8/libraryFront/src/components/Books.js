import React from 'react'

const Books = (props) => { 
  if (!props.show) {
    return null
  }
  const changeGenre = (genre) => {
    props.setGenre(genre)
    props.loadBooks({ variables: { genre: genre } })
  }

 return (
  <div>
    <h2>books</h2>

    <table>
      <tbody>
        <tr>
          <th></th>
          <th>
            author
          </th>
          <th>
            published
          </th>
        </tr>
        {props.books.map(a =>
          <tr key={a.title}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
        )}
      </tbody>
    </table>
    <div>
      {props.genres.map(genre =>
        <button key={genre} onClick={() => changeGenre(genre)}>{genre}</button>
      )}
      <button onClick={() => changeGenre(null)}>all genres</button>
    </div>
  </div>
)
}


export default Books