import { memo } from 'react'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import { diamondCoords, ovalCoords, squiggleCoords } from './functions'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  symbol: {
    margin: 3
  },
  card: {
    boxSizing: 'border-box',
    background: '#fff',
    border: `1px solid ${theme.palette.text.primary}`,
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: theme.setCard.background,
    transition: 'box-shadow 0.15s'
  },
  clickable: {
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0px 0px 5px 3px #bbb'
    }
  },
  active: {
    boxShadow: '0px 0px 5px 3px #4b9e9e !important'
  }
}))

const SHAPES = ['squiggle', 'oval', 'diamond']
const SHADES = ['filled', 'outline', 'striped']

function ResponsiveSymbol (props) {
  const classes = useStyles()
  const theme = useTheme()

  // Override is used to help visualize new colors in color picker dialog.
  const COLORS = props.colorOverride
    ? [
        props.colorOverride.purple,
        props.colorOverride.green,
        props.colorOverride.red
      ]
    : [theme.setCard.purple, theme.setCard.green, theme.setCard.red]

  const color = COLORS[props.color]
  const shape = SHAPES[props.shape]
  const shade = SHADES[props.shade]
  var coords = ''
  switch (props.shape) {
    // squiggle
    case 0:
      coords = squiggleCoords
      break
    // oval
    case 1:
      coords = ovalCoords
      break
    // diamond
    case 2:
      coords = diamondCoords
      break
    default:
      break
  }
  const finalCoords = coords
  switch (props.shade) {
    case 0:
        var fill = color
        break
    case 1:
        var fill = "transparent"
        break
    case 2:
        var fill = 'url(#' + props.id.toString() + props.color.toString() + props.shade.toString() + props.shape.toString() + ')'
        //var fill = color
        break
    default:
      break
  }
  return (
    <svg
      id={classes.symbol}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 500 750'
      width={props.size}
      height={2 * props.size}
      strokeWidth={26}
    >
      <defs>
        <pattern id={props.id.toString() + props.color.toString() + props.shade.toString() + props.shape.toString()} patternUnits="userSpaceOnUse" width="10" height="30" patternTransform="rotate(45)">
			<line x1="0" y="0" x2="100" y2="0" stroke={color} strokeWidth="20" />
		</pattern>
        <path id={props.shape} className='cls-1' d={finalCoords} />
      </defs>
      <use
        href={'#' + props.shape}
        fill={fill}
        stroke={color}
      />
    </svg>
  )
}

function ResponsiveSetCard (props) {
  const classes = useStyles()

  // Black magic below to scale cards given any width
  const { width, value, onClick, background, active } = props
  const height = Math.round(width / 1.6)
  const margin = Math.round(width * 0.035)
  const contentWidth = width - 2 * margin
  const contentHeight = height - 2 * margin

  // 4-character string of 0..2
  const color = value.charCodeAt(0) - 48
  const shape = value.charCodeAt(1) - 48
  const shade = value.charCodeAt(2) - 48
  const number = value.charCodeAt(3) - 48

  return (
    <div
      className={clsx(classes.card, {
        [classes.clickable]: onClick,
        [classes.active]: active
      })}
      style={{
        width: contentWidth,
        height: contentHeight,
        margin: margin,
        borderRadius: margin,
        background,
        transition: 'width 0.5s, height 0.5s'
      }}
    >
      {[...Array(number + 1)].map((_, i) => (
        <ResponsiveSymbol
          key={i}
          id={props.id}
          color={color}
          shape={shape}
          shade={shade}
          size={Math.round(contentHeight * 0.36)}
          colorOverride={props.colorOverride}
        />
      ))}
    </div>
  )
}

export default memo(ResponsiveSetCard)
