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
class CardDisplay extends React.Component {
  constructor (props) {
    super(props)
    const array = generateCards()
    const shuffledArray = array.sort((a, b) => 0.5 - Math.random())
    this.state = {
      number: 0,
      shape: 0,
      shade: 0,
      color: 0,
      cardArray: array,
      shuffledArray: shuffledArray,
      cardOne: shuffledArray[0],
      cardTwo: shuffledArray[1],
      message: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkSet = this.checkSet.bind(this);
  }
  handleSubmit = () => {
    var selected =
      (this.state.color - 1).toString() +
      (this.state.shape - 1).toString() +
      (this.state.shade - 1).toString() +
      (this.state.number - 1).toString()
    if (this.checkSet(selected, this.state.cardOne, this.state.cardTwo)) {
        this.setState({message: "Good job!"})
        this.setState({shuffledArray: this.state.cardArray.sort((a, b) => 0.5 - Math.random())})
        this.setState({cardOne: this.state.shuffledArray[0]})
        this.setState({cardTwo: this.state.shuffledArray[1]})
        this.setState({number:0})
        this.setState({shape:0})
        this.setState({color:0})
        this.setState({shade:0})
    } else {
        this.setState({message: "Try again!"})

    }
  }
  checkSet(a, b, c) {
    for (let i = 0; i < 4; i++) {
      if ((a.charAt(i) + b.charAt(i) + c.charAt(i)) % 3 !== 0)
        return false;
    }
    return true;
  }
  
  render () {
    return (
      <span>
      <div>
        <h4>what card completes the set?</h4>
      </div>
        <animated.div>
          <ResponsiveSetCard
            value={this.state.cardOne}
            width={200}
            background={"#FFFDD0"}
            active={false}
          />
          <ResponsiveSetCard
            value={this.state.cardTwo}
            width={200}
            background={"#FFFDD0"}
            active={false}
          />
        </animated.div>
      <br></br>
        <span style={{ display: 'flex' }}>
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
        </span>
        <br></br>
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
              background={"#FFFDD0"}
              active={false}
            />
          )}
        <br></br>
        <Button variant='text' onClick={this.handleSubmit}>
          Submit
        </Button>
        <p>{this.state.message}</p>
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
