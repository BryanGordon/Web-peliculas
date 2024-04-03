import './App.css'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import { useState, useEffect, useCallback } from 'react'
import debounce from 'just-debounce-it'

function useSearch () {
  const [search, setSearch] = useState()
  const [error, setError] = useState(null)

  useEffect(() => {
    if (search === ' ') {
      setError('No se encuentra ninguna pelicula')
      return
    }

    setError(null)
  }, [search])

  return ({ error, search, setSearch })
}

function App () {
  const [sort, setSort] = useState(false)
  const { search, setSearch, error } = useSearch()
  const { movies, getMovies, loading } = useMovies({ search, sort })

  const debouncedGetMovies = useCallback(
    debounce(search => {
      getMovies({ search })
    }, 300), [getMovies]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    setSearch(newSearch)
    debouncedGetMovies(newSearch)
  }

  const handleSort = () => {
    setSort(!sort)
  }

  return (
    <div>
      <header className='page'>
        <h1>Prueba tecnica</h1>
        <h2>Web peliculas</h2>
        <div>
          <form className='form' onSubmit={handleSubmit}>
            <input onChange={handleChange} name='query' value={search} type='text' placeholder='Spiderman, Star wars,   Batman... ' />
            <input type='checkbox' onChange={handleSort} />
            <button type='submit'>Buscar</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </header>
      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies={movies} />
        }
      </main>
    </div>
  )
}

export default App
