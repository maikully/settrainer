import { memo } from 'react'

import { makeStyles, useTheme } from '@material-ui/core/styles'
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
      coords =
        'm474.32,715.48c-40.86,82.93-335.32,167.06-401.42-76.92-30.3-111.83,8.08-162.81,40.84-217.51,17.14-28.62,27.53-60.8,30-94.07,7.02-94.82-26.74-127.6-44.3-138.13-4.21-2.52-8.85-4.24-13.65-5.29-18.04-3.91-96.38-25.43-60.09-99.04C66.55,1.59,361.01-82.54,427.11,161.44c30.3,111.82-8.07,162.79-40.84,217.49-17.14,28.62-27.54,60.81-30.01,94.08-7.02,94.82,26.73,127.6,44.29,138.13,4.22,2.52,8.86,4.25,13.65,5.29,18.04,3.91,96.38,25.43,60.1,99.06Z'
      break
    // oval
    case 1:
      coords =
        'm449.5,193v414.5c0,106.31-86.19,192.5-192.5,192.5s-192.5-86.19-192.5-192.5V193C64.5,86.69,150.69.5,257,.5s192.5,86.19,192.5,192.5Z'
      break
    // diamond
    case 2:
      coords =
      "m250,705.87L65.82,375l.27-.49L250,44.13l.87,1.57,183.31,329.3-.27.49-183.91,330.38Z"
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
        var fill = 'url(#' + props.shade.toString() + props.color.toString() + ')'
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
      strokeWidth={18}
    >
      <defs>
        <pattern
          id={props.shade.toString() + props.color.toString()}
          patternUnits='userSpaceOnUse'
          width='4'
          height='4'
        >
          <path d="M-1,1 l2,-2
               M0,4 l4,-4
               M3,5 l2,-2"
            stroke={color}
            strokeWidth='2'
          />
        </pattern>{' '}
        <path id={props.shape} class='cls-1' d={finalCoords} />
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
