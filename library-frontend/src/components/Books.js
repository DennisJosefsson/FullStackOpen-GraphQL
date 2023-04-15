import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const [filter, setFilter] = useState(null)
  const result = useQuery(ALL_BOOKS, { variables: { genre: filter } })
  const genresResult = useQuery(ALL_GENRES)

  if (!props.show) {
    return null
  }

  if (result.loading || genresResult.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const genres = genresResult.data.allBooks

  const genreList = [
    ...new Set(
      genres
        .map((book) => {
          return book.genres.map((genre) => genre)
        })
        .flat()
    ),
  ]

  return (
    <div>
      <h2>books</h2>
      <p>{filter ? `In genre ${filter}` : 'In all genres'}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genreList.map((genre) => (
        <button key={genre} onClick={() => setFilter(genre)}>
          {genre}
        </button>
      ))}
      <button key="reset" onClick={() => setFilter(null)}>
        All genres
      </button>
    </div>
  )
}

export default Books
