import logo from './logo.svg'
import './App.css'
import CardDisplay from './CardDisplay'
import Blitz from './Blitz'
import { lightTheme } from './themes'
import { ThemeProvider } from '@material-ui/core/styles'
import ReactGA from 'react-ga4'
import React, { useState } from 'react'
import { Button } from '@material-ui/core'

ReactGA.initialize('G-1MEGVYSVYW')
ReactGA.send('pageview')
function App () {
  const [mode, setMode] = useState(0)
  return (
    <ThemeProvider theme={lightTheme}>
      <div className='App'>
        <header className='App-header'>
          {mode === 0 && (
            <div>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  setMode(1)
                }}
              >
                Practice Mode
              </Button>
              <br></br>
              <br></br>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  setMode(2)
                }}
              >
                1-Blitz
              </Button>
            </div>
          )}
          {mode === 1 && <CardDisplay />}
          {mode === 2 && <Blitz />}
        </header>
      </div>
    </ThemeProvider>
  )
}

export default App
