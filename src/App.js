import logo from './logo.svg'
import './App.css'
import CardDisplay from './CardDisplay'
import Blitz from './Blitz'
import { lightTheme } from './themes'
import { ThemeProvider } from '@material-ui/core/styles'

function App () {
  return (
    <ThemeProvider theme={lightTheme}>
      <div className='App'>
        <header className='App-header'>
          {<CardDisplay />
          }
          {/*<Blitz />
*/}
        </header>
      </div>
    </ThemeProvider>
  )
}

export default App
