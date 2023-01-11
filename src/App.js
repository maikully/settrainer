import logo from './logo.svg'
import './App.css'
import CardDisplay from './CardDisplay'
import Blitz from './Blitz'
import { lightTheme } from './themes'
import { ThemeProvider } from '@material-ui/core/styles'
import ReactGA from "react-ga4";

ReactGA.initialize('G-FZQGHMXF1K');
ReactGA.send("pageview");
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
