import ResponsiveSetCard from './ResponsiveSetCard'
import { animated, useSprings } from '@react-spring/web'
import { lightGreen } from '@material-ui/core/colors'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@material-ui/core'
import React, { useState } from 'react'

function generateCards () {
  const deck = []
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          deck.push(`${i}${j}${k}${l}`)
        }
      }
    }
  }
  return deck
}
/** Returns the unique card c such that {a, b, c} form a set. */
function conjugateCard (a, b) {
  const zeroCode = '0'.charCodeAt(0)
  let c = ''
  for (let i = 0; i < 4; i++) {
    const sum = a.charCodeAt(i) - zeroCode + b.charCodeAt(i) - zeroCode
    const lastNum = (3 - (sum % 3)) % 3
    c += String.fromCharCode(zeroCode + lastNum)
  }
  return c
}

function getOptions (shuffledArray) {
  var cardOne = shuffledArray[0]
  var cardTwo = shuffledArray[1]
  var answer = conjugateCard(cardOne, cardTwo)
  var options = []
  options.push(answer)
  for (let x = 2; x < shuffledArray.length; x++) {
    if (shuffledArray[x] !== answer) {
      options.push(shuffledArray[x])
      if (options.length === 5) {
        return options.sort((a, b) => 0.5 - Math.random())
      }
    }
  }
}
class CardDisplay extends React.Component {
  constructor (props) {
    super(props)
    const array = generateCards()
    const shuffledArray = array.sort((a, b) => 0.5 - Math.random())
    var cardOne = shuffledArray[0]
    var cardTwo = shuffledArray[1]
    var options = getOptions(shuffledArray)
    var answer = conjugateCard(cardOne, cardTwo)
    let cardWidth
    if (window.screen.width < 500) {
        cardWidth = window.screen.width / 3

    }
    else {

        cardWidth = window.screen.width / 10
    }

    console.log(cardWidth)
    
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
      cardWidth: cardWidth
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
    this.checkSet = this.checkSet.bind(this)
  }
  resetBoard = () => {
    const shuffledArray = this.state.cardArray.sort(
      (a, b) => 0.5 - Math.random()
    )
    var cardOne = shuffledArray[0]
    var cardTwo = shuffledArray[1]
    var options = getOptions(shuffledArray)
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
    this.setState({ streak: this.state.streak + 1 })
  }
  handleSubmit = () => {
    var selected =
      (this.state.color - 1).toString() +
      (this.state.shape - 1).toString() +
      (this.state.shade - 1).toString() +
      (this.state.number - 1).toString()
    if (this.checkSet(selected, this.state.cardOne, this.state.cardTwo)) {
      this.setState({ message: 'Good job!' })
      this.resetBoard()
    } else {
      this.setState({ streak: 0 })
      this.setState({ message: 'Try again!' })
    }
  }
  handleSelection (card) {
    console.log(card)
    if (this.checkSet(card, this.state.cardOne, this.state.cardTwo)) {
      this.setState({ message: 'Good job!' })
      this.resetBoard()
    } else {
      this.setState({ streak: 0 })
      this.setState({ message: 'Try again!' })
    }
  }
  checkSet (a, b, c) {
    for (let i = 0; i < 4; i++) {
      if ((a.charAt(i) + b.charAt(i) + c.charAt(i)) % 3 !== 0) return false
    }
    return true
  }

  render () {
    return (
      <span>
        <animated.div>
          <ResponsiveSetCard
            value={this.state.cardOne}
            width={this.state.cardWidth}
            background={'#FFFDD0'}
            active={false}
          />
          <ResponsiveSetCard
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
        <span style={{ display: 'flex', width: window.screen.width, justifyContent: "center", flexWrap: "wrap" }}>
          {this.state.options.map((card, idx) => (
            <Button onClick={() => this.handleSelection(card)}>
              <ResponsiveSetCard
                id={idx}
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
          <p style={{fontFamily:'monospace', fontSize:"20px"}}>streak: {this.state.streak}</p>
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
