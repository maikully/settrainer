import ResponsiveSetCard from './ResponsiveSetCard'
import { animated, useSprings } from '@react-spring/web'
import { lightGreen } from '@material-ui/core/colors'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Backdrop,
  Fade
} from '@material-ui/core'
import React, { useState, useRef, useEffect } from 'react'
import { checkSet, conjugateCard, generateCards, match } from './functions'
const Timer = () => {
  // We need ref in this, because we are dealing
  // with JS setInterval to keep track of it and
  // stop it when needed
  const Ref = useRef(null)

  // The state for our timer
  const [timer, setTimer] = useState('00:00:00')

  const getTimeRemaining = e => {
    const total = Date.parse(e) - Date.parse(new Date())
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / 1000 / 60 / 60) % 24)
    return {
      total,
      hours,
      minutes,
      seconds
    }
  }

  const startTimer = e => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e)
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      setTimer(
        (hours > 9 ? hours : '0' + hours) +
          ':' +
          (minutes > 9 ? minutes : '0' + minutes) +
          ':' +
          (seconds > 9 ? seconds : '0' + seconds)
      )
    }
  }

  const clearTimer = e => {
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer('00:01:00')

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current)
    const id = setInterval(() => {
      startTimer(e)
    }, 1000)
    Ref.current = id
  }

  const getDeadTime = () => {
    let deadline = new Date()

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setMinutes(deadline.getMinutes() + 1)
    return deadline
  }

  // We can use useEffect so that when the component
  // mount the timer will start as soon as possible

  // We put empty array to act as componentDid
  // mount only
  useEffect(() => {
    clearTimer(getDeadTime())
  }, [])

  // Another way to call the clearTimer() to start
  // the countdown is via action event from the
  // button first we create function to be called
  // by the button
  const onClickReset = () => {
    clearTimer(getDeadTime())
  }

  return (
    <div>
      <h2>{timer}</h2>
      <button onClick={onClickReset}>Reset</button>
    </div>
  )
}

function getOptions (shuffledArray, n, d) {
  console.log(n)
  var cardOne = shuffledArray[0]
  var cardTwo = shuffledArray[1]
  var answer = conjugateCard(cardOne, cardTwo)
  var options = []
  options.push(answer)
  for (let x = 2; x < shuffledArray.length; x++) {
    if (shuffledArray[x] !== answer) {
      if (d && match(shuffledArray[x], answer) >= d - 1) {
        options.push(shuffledArray[x])
      }
      if (!d) {
        options.push(shuffledArray[x])
      }
      if (options.length === n) {
        return options.sort((a, b) => 0.5 - Math.random())
      }
    }
  }
  if (options.length < n) {
    for (let x = 2; x < shuffledArray.length && options.length < n; x++) {
      if (!options.includes(shuffledArray[x])) {
        options.push(shuffledArray[x])
      }
    }
  }
  return options.sort((a, b) => 0.5 - Math.random())
}
class Blitz extends React.Component {
  constructor (props) {
    super(props)
    const array = generateCards()
    const shuffledArray = array.sort((a, b) => 0.5 - Math.random())
    var cardOne = shuffledArray[0]
    var cardTwo = shuffledArray[1]
    var options = getOptions(shuffledArray, 5, 1)
    var answer = conjugateCard(cardOne, cardTwo)
    let cardWidth
    if (window.screen.width < 500) {
      cardWidth = window.screen.width / 3
    } else {
      cardWidth = window.screen.width / 10
    }

    this.state = {
      number: 0,
      shape: 0,
      shade: 0,
      color: 0,
      answer: answer,
      cardArray: array,
      shuffledArray: shuffledArray,
      cardOne: shuffledArray[0],
      cardTwo: shuffledArray[1],
      options: options,
      count: 0,
      cardWidth: cardWidth,
      numberDisplay: 5,
      settingsOpen: false,
      difficulty: 1,
      scores: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSettingsOpen = this.handleSettingsOpen.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
  }
  resetBoard = () => {
    const shuffledArray = this.state.cardArray.sort(
      (a, b) => 0.5 - Math.random()
    )
    var cardOne = shuffledArray[0]
    var cardTwo = shuffledArray[1]
    console.log(this.state.numberDisplay)
    var options = getOptions(
      shuffledArray,
      this.state.numberDisplay,
      this.state.difficulty
    )
    console.log(options)
    var answer = conjugateCard(cardOne, cardTwo)
    this.setState({
      shuffledArray: shuffledArray
    })
    this.setState({ cardOne: this.state.shuffledArray[0] })
    this.setState({ cardTwo: this.state.shuffledArray[1] })
    this.setState({ number: 0 })
    this.setState({ shape: 0 })
    this.setState({ color: 0 })
    this.setState({ shade: 0 })
    this.setState({ options: options })
    this.setState({ answer: answer })
    this.setState({ count: this.state.count + 1 })
  }

  handleSubmit = () => {
    var selected =
      (this.state.color - 1).toString() +
      (this.state.shape - 1).toString() +
      (this.state.shade - 1).toString() +
      (this.state.number - 1).toString()
    if (checkSet(selected, this.state.cardOne, this.state.cardTwo)) {
      this.setState({ message: 'Good job!' })
      this.resetBoard()
    } else {
      this.setState({ message: 'Try again!' })
    }
  }
  handleSelection (card) {
    console.log(card)
    if (checkSet(card, this.state.cardOne, this.state.cardTwo)) {
      this.setState({ message: 'Good job!' })
      this.resetBoard()
    } else {
      this.setState({ streak: 0 })
      this.setState({ message: 'Try again!' })
    }
  }
  handleSettingsOpen () {
    this.setState({ settingsOpen: !this.state.settingsOpen })
  }
  handleSettingsChange (x, e) {
    if (x === 0) {
      this.setState(
        { numberDisplay: parseInt(e.target.value) },
        this.resetBoard
      )
    } else if (x === 1) {
      this.setState({ difficulty: parseInt(e.target.value) }, this.resetBoard)
    }
  }

  render () {
    return (
      <span>
        <Button
          style={{ position: 'absolute', right: '5%', top: '2%' }}
          onClick={this.handleSettingsOpen}
        >
          High Scores
        </Button>
        <Modal
          aria-labelledby='transition-modal-title'
          aria-describedby='transition-modal-description'
          open={this.state.settingsOpen}
          onClose={this.handleSettingsOpen}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={this.state.settingsOpen}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4
              }}
            >
              <Typography
                id='modal-modal-title'
                variant='h6'
                component='h2'
                style={{ color: 'white' }}
              >
                High Scores
              </Typography>
              <ol>
                {this.state.scores.length > 0 && this.state.scores.sort((a,b) => b-a).slice(0, 5).map((score, idx) => (
                  <li>{score}</li>
                ))}
              </ol>
            </Box>
          </Fade>
        </Modal>
        <Timer></Timer>
        <animated.div>
          <ResponsiveSetCard
            id={0}
            value={this.state.cardOne}
            width={this.state.cardWidth}
            background={'#FFFDD0'}
            active={false}
          />
          <ResponsiveSetCard
            id={1}
            value={this.state.cardTwo}
            width={this.state.cardWidth}
            background={'#FFFDD0'}
            active={false}
          />
        </animated.div>
        <br></br>
        <br></br>
        <span
          style={{
            display: 'flex',
            width:
              window.screen.width <= 500
                ? window.screen.width
                : window.screen.width / 1.75,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          {this.state.options.map((card, idx) => (
            <Button
              style={{
                flex:
                  window.screen.width <= 500
                    ? '1 0 calc(35% - 10px)'
                    : '1 0 calc(20% - 10px)'
              }}
              onClick={() => this.handleSelection(card)}
            >
              <ResponsiveSetCard
                id={1 + idx}
                value={card}
                width={this.state.cardWidth}
                background={'#FFFDD0'}
              />
            </Button>
          ))}
        </span>
        <br></br>
        <p style={{ fontFamily: 'monospace', fontSize: '20px' }}>
          count: {this.state.count}
        </p>
      </span>
    )
  }
}

export default Blitz
