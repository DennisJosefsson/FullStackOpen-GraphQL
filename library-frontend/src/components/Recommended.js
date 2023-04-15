import { useLazyQuery, useQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from '../queries'
import { useEffect, useState } from 'react'

const Recommended = ({ show }) => {
  const user = useQuery(ME, { fetchPolicy: 'no-cache' })
  const [books, setBooks] = useState([])
  const [getRecommendedBooks, recommendedBooks] = useLazyQuery(ALL_BOOKS)

  useEffect(() => {
    if (user.data && user.data.me) {
      getRecommendedBooks({ variables: { genre: user.data.me.favoriteGenre } })
    }
  }, [user.data, getRecommendedBooks])

  useEffect(() => {
    if (recommendedBooks.data) {
      setBooks(recommendedBooks.data.allBooks)
    }
  }, [recommendedBooks.data, setBooks])

  if (!show) {
    return null
  }

  if (user.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>Recommendations</h2>
      <p>Books in your favorite genre {user.data.me.favoriteGenre}</p>
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
    </div>
  )
}

export default Recommended
