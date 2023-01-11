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
import React, { useState } from 'react'
import { checkSet, conjugateCard, generateCards, match } from './functions'

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
class CardDisplay extends React.Component {
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
      message: 'select a card!',
      streak: 0,
      cardWidth: cardWidth,
      numberDisplay: 5,
      settingsOpen: false,
      difficulty: 1
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
      this.setState({ streak: 0 })
      this.setState({ message: 'Try again!' })
    }
  }
  handleSelection (card) {
    console.log(card)
    if (checkSet(card, this.state.cardOne, this.state.cardTwo)) {
      this.setState({ message: 'Good job!' })
      this.setState({ streak: this.state.streak + 1 })
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
    if (x === 0 && parseInt(e.target.value) > 0 && parseInt(e.target.value) <= 15) {
      this.setState(
        { numberDisplay: parseInt(e.target.value) },
        this.resetBoard
      )
    } else if (x === 1 && parseInt(e.target.value) > 0 && parseInt(e.target.value) <= 4) {
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
          Settings
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
                Settings
              </Typography>
              <br></br>
              <Typography
                style={{ color: 'white' }}
                id='modal-modal-description'
                sx={{ mt: 2 }}
              >
                Number of options to display:{' '}
              </Typography>
              <TextField
                id='outlined-number'
                type='number'
                value={this.state.numberDisplay}
                InputProps={{ inputProps: { min: 2, max: 15 } }}
                onChange={e => this.handleSettingsChange(0, e)}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <br></br>
              <br></br>
              <Typography
                style={{ color: 'white' }}
                id='modal-modal-description'
                sx={{ mt: 2 }}
              >
                Difficulty (1-4) of options:{' '}
              </Typography>
              <TextField
                id='outlined-number'
                type='number'
                InputProps={{ inputProps: { min: 1, max: 4 } }}
                value={this.state.difficulty}
                onChange={e => this.handleSettingsChange(1, e)}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Box>
          </Fade>
        </Modal>
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
        <div>
          <h4>which card completes the set?</h4>
        </div>
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
          {/*
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Number</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={this.state.number}
              label='Number'
              onChange={event => {
                this.setState({ number: event.target.value })
              }}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Shading</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={this.state.shade}
              label='Shading'
              onChange={event => {
                this.setState({ shade: event.target.value })
              }}
            >
              <MenuItem value={1}>filled</MenuItem>
              <MenuItem value={2}>empty</MenuItem>
              <MenuItem value={3}>striped</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Color</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={this.state.color}
              label='Color'
              onChange={event => {
                this.setState({ color: event.target.value })
              }}
            >
              <MenuItem value={1}>purple</MenuItem>
              <MenuItem value={2}>green</MenuItem>
              <MenuItem value={3}>red</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Shape</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={this.state.shape}
              label='Shape'
              onChange={event => {
                this.setState({ shape: event.target.value })
              }}
            >
              <MenuItem value={1}>squiggle(s)</MenuItem>
              <MenuItem value={2}>oval(s)</MenuItem>
              <MenuItem value={3}>diamond(s)</MenuItem>
            </Select>
          </FormControl>
            */}
        </span>
        <br></br>
        {/*
        {this.state.number !== 0 &&
          this.state.shade !== 0 &&
          this.state.color !== 0 &&
          this.state.shape !== 0 && (
            <ResponsiveSetCard
              value={
                (this.state.color - 1).toString() +
                (this.state.shape - 1).toString() +
                (this.state.shade - 1).toString() +
                (this.state.number - 1).toString()
              }
              width={200}
              background={'#FFFDD0'}
              active={false}
            />
          )}
        <br></br>
        <Button variant='text' onClick={this.handleSubmit}>
          Submit
        </Button>
            */}
        <p>{this.state.message}</p>
        <p style={{ fontFamily: 'monospace', fontSize: '20px' }}>
          streak: {this.state.streak}
        </p>
        {/*
        {this.state.cardArray.map((card, idx) => (
          <animated.div
            key={card}
            style={{
              position: "absolute",
              ...springProps[idx],
              visibility: springProps[idx].opacity.to((x) =>
                x > 0 ? "visible" : "hidden"
              ),
            }}
          >
            <ResponsiveSetCard
              value={card}
              width={200}
              background={this.state.cards[card].background}
              active={false}
            />
          </animated.div>
        ))}*/}
      </span>
    )
  }
}

export default CardDisplay
