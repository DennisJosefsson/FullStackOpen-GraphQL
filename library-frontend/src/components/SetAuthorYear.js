import { useState } from 'react'
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from '../queries'
import { useMutation } from '@apollo/client'
import Select from 'react-select'

const SetAuthorYear = ({ authors }) => {
  const [author, setAuthor] = useState(null)
  const [year, setYear] = useState('')

  const [editYear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const options = authors.map((author) => {
    return { value: author.name, label: author.name }
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    const intYear = Number(year)
    editYear({ variables: { name: author.value, setBornTo: intYear } })
    setAuthor('')
    setYear('')
  }
  return (
    <div>
      <h4>Set birthyear</h4>
      <form onSubmit={handleSubmit}>
        <div>
          author
          <Select
            defaultValue={author}
            onChange={setAuthor}
            options={options}
          />
        </div>
        <div>
          year
          <input
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default SetAuthorYear
