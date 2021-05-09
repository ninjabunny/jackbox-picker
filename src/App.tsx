import React, { useEffect, useState } from 'react'
import './App.scss'

import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Table'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Types from './types'
import Header from './components/Header'
import Filter from './components/Filter'
import Game from './components/Game'
import About from './components/About'

const DEFAULT_JBGAMES_STATE = {
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  drawful2: true,
}

function App() {
  const [gamesList, setGamesList] = useState<Types.GamesInterface[]>()
  const [showImages, setShowImages] = useState<boolean>(true)
  const [players, setPlayers] = useState<number>()
  const [jbGames, setjbGames] = useState<any>(DEFAULT_JBGAMES_STATE)
  const [filterChecks, setFilterChecks] = useState<any>({
    extended_timers: false,
    family_mode: false,
    audience: false,
    drawing: false,
  })

  const hideMobileCell = 'd-none d-md-table-cell'

  useEffect(() => {
    setGamesList(require('./data/data.json'))
  }, [])

  const handleShowImagesChange = (newValue: boolean) => {
    setShowImages(newValue)
  }

  const handlePlayersChange = (newValue: number) => {
    setPlayers(newValue)
  }

  const handleJbGamesChange = (newValue: any) => {
    setjbGames({ ...jbGames, [newValue.name]: newValue.checked })
  }

  const handleFilterChecksChange = (newValue: any) => {
    setFilterChecks({ ...filterChecks, [newValue.name]: newValue.checked })
  }

  const handleCheckUncheckOnClick = (newValue: any) => {
    const jbGamesKeys = Object.keys(jbGames)
    if (
      jbGamesKeys.filter((keys) => jbGames[keys]).length < jbGamesKeys.length
    ) {
      // If any checkboxes are unchecked, check them all
      setjbGames({ ...DEFAULT_JBGAMES_STATE })
    } else {
      // If any checkboxes are checked, uncheck them all
      setjbGames(
        jbGamesKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
      )
    }
  }

  const filteredList =
    gamesList &&
    gamesList.length > 0 &&
    gamesList
      .filter((game) => {
        return (
          !players ||
          (game.min_players <= players && players <= game.max_players)
        )
      })
      .filter((game) => {
        return jbGames[game.pack]
      })
      .filter((game) => {
        return (
          (!filterChecks.extended_timers || game.extended_timers) &&
          (!filterChecks.family_mode || game.family_mode) &&
          (!filterChecks.audience || game.audience) &&
          (!filterChecks.drawing || game.drawing)
        )
      })

  return (
    <div className='App'>
      <Router>
        <Container>
          <Row>
            <Col>
              <Header />
            </Col>
          </Row>
          <Switch>
            <Route path='/jackbox-picker/about'>
              <About />
            </Route>
            <Route path='/jackbox-picker'>
              <Row>
                <Col>
                  <Filter
                    onShowImagesChange={handleShowImagesChange}
                    onPlayersChange={handlePlayersChange}
                    onJbGamesChange={handleJbGamesChange}
                    jbGames={jbGames}
                    filterChecks={filterChecks}
                    onFilterChecksChange={handleFilterChecksChange}
                    handleCheckUncheckOnClick={handleCheckUncheckOnClick}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  {!!filteredList && !!filteredList.length && (
                    <Table striped bordered hover size='sm'>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Pack</th>
                          <th>Players</th>
                          <th>Length</th>
                          <th>Longer timers?</th>
                          <th className={hideMobileCell}>Family friendly?</th>
                          <th className={hideMobileCell}>Audience?</th>
                          <th className={hideMobileCell}>Drawing involved?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredList.map((game) => (
                          <Game
                            key={game.id}
                            title={game.title}
                            pack={game.pack}
                            min_players={game.min_players}
                            max_players={game.max_players}
                            extended_timers={game.extended_timers}
                            img={game.img}
                            family_mode={game.family_mode}
                            audience={game.audience}
                            drawing={game.drawing}
                            game_length={game.game_length}
                            show_images={showImages}
                            steam_id={game.steam_id}
                          />
                        ))}
                      </tbody>
                    </Table>
                  )}
                  {!filteredList ||
                    (filteredList.length === 0 && (
                      <Alert variant='warning'>
                        No results found, please adjust your filters
                      </Alert>
                    ))}
                </Col>
              </Row>
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  )
}

export default App
