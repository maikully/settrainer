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

function getDeadTime () {
  let deadline = new Date()

  // adjust timer here
  deadline.setSeconds(deadline.getSeconds() + 3)
  return deadline
}
function getOptions (shuffledArray, n, d) {
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
class BlitzMode extends React.Component {
  timer = ({ onSwitch }) => {
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

    const runTimer = e => {
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
      } else {
        this.endGame()
        clearTimer()
      }
    }

    const clearTimer = () => {
      // If you adjust it you should also need to
      // adjust the Endtime formula we are about
      // to code next
      if (Ref.current) clearInterval(Ref.current)
      setTimer('00:01:00')

      // If you try to remove this line the
      // updating of timer Variable will be
      // after 1000ms or 1sec
    }
    function startTimer (e) {
      if (Ref.current) clearInterval(Ref.current)
      const id = setInterval(() => {
        runTimer(e)
      }, 1000)
      Ref.current = id
    }

    // We can use useEffect so that when the component
    // mount the timer will start as soon as possible

    // We put empty array to act as componentDid
    // mount only
    useEffect(() => {
      clearTimer()
      startTimer(getDeadTime())
    }, [])
    useEffect(() => {
      startTimer(getDeadTime())
    }, [onSwitch])

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
      </div>
    )
  }
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
      scores: [],
      status: 'inactive',
      onSwitch: 0,
      lockout: false,
      isShowingAlert: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSettingsOpen = this.handleSettingsOpen.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
    this.timer = this.timer.bind(this)
    this.endGame = this.endGame.bind(this)
  }
  resetBoard = () => {
    const shuffledArray = this.state.cardArray.sort(
      (a, b) => 0.5 - Math.random()
    )
    var cardOne = shuffledArray[0]
    var cardTwo = shuffledArray[1]
    var options = getOptions(
      shuffledArray,
      this.state.numberDisplay,
      this.state.difficulty
    )
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
  }
  endGame = () => {
    this.setState({ status: 'waiting' })
    if (this.state.scores.length === 0 || this.state.count > this.state.scores[0]) {
      this.setState({ isShowingAlert: true })
      setTimeout(() => {
        this.setState({
          isShowingAlert: false
        });
      }, 2000);
    }
    this.setState({
      scores: [...this.state.scores, this.state.count].sort((a, b) => b - a)
    })
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
    if (this.state.status === 'active') {
      if (checkSet(card, this.state.cardOne, this.state.cardTwo)) {
        this.setState({ message: 'Good job!' })
        if (
          this.state.count % 9 === 0 &&
          this.state.count !== 0 &&
          this.state.difficulty < 4
        ) {
          this.setState({ difficulty: this.state.difficulty + 1 })
        }

        this.setState({ count: this.state.count + 1 })
        this.resetBoard()
      } else {
        this.setState({ streak: 0 })
        this.setState({ message: 'Try again!' })
        this.setState({ lockout: true })
        setTimeout(() => this.setState({ lockout: false }), 1100)
      }
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
              <ol style={{ color: 'white' }}>
                {this.state.scores.length > 0 &&
                  this.state.scores
                    .slice(0, 5)
                    .map((score, idx) => <li>{score}</li>)}
              </ol>
            </Box>
          </Fade>
        </Modal>
        {this.state.status === 'inactive' && (
          <div>
            <h3>You have 1 minute to find as many sets as you can.</h3>
            <h4>Every 10 sets, the difficulty will increase.</h4>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                this.setState({ status: 'active' })
              }}
            >
              Start
            </Button>
          </div>
        )}
        {(this.state.status === 'active' ||
          this.state.status === 'waiting') && (
          <>
            <div
              className={`alert alert-success ${
                this.state.isShowingAlert ? 'alert-shown' : 'alert-hidden'
              }`}
              style={{position:"absolute",right:"10%",top:"20%"}}
            >
              <strong>New high score!</strong>
            </div>
            <this.timer onSwitch={this.state.onSwitch}></this.timer>
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
                  disabled={
                    this.state.lockout || this.state.status === 'waiting'
                  }
                >
                  <ResponsiveSetCard
                    id={1 + idx}
                    value={card}
                    width={this.state.cardWidth}
                    background={
                      this.state.lockout || this.state.status === 'waiting'
                        ? '#cccaa1'
                        : '#FFFDD0'
                    }
                  />
                </Button>
              ))}
            </span>
            <br></br>
            <p style={{ fontFamily: 'monospace', fontSize: '20px' }}>
              score: {this.state.count}
            </p>
            {this.state.status === 'waiting' && (
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  this.setState({ status: 'active' })
                  this.setState({ count: 0 })
                  this.setState({ onSwitch: 1 - this.state.onSwitch })
                  this.resetBoard()
                }}
              >
                Play Again
              </Button>
            )}
          </>
        )}{' '}
      </span>
    )
  }
}

export default BlitzMode
