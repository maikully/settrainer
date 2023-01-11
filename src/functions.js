export function generateCards () {
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
export function conjugateCard (a, b) {
  const zeroCode = '0'.charCodeAt(0)
  let c = ''
  for (let i = 0; i < 4; i++) {
    const sum = a.charCodeAt(i) - zeroCode + b.charCodeAt(i) - zeroCode
    const lastNum = (3 - (sum % 3)) % 3
    c += String.fromCharCode(zeroCode + lastNum)
  }
  return c
}

export function match (s1, s2) {
  var count = 0

  for (let i = 0; i < s1.length; i++) {
    if (s2[i] === s1[i]) count++
  }

  return count
}

export function checkSet (a, b, c) {
  for (let i = 0; i < 4; i++) {
    if ((a.charAt(i) + b.charAt(i) + c.charAt(i)) % 3 !== 0) return false
  }
  return true
}

export const squiggleCoords =
  'm474.32,715.48c-40.86,82.93-335.32,167.06-401.42-76.92-30.3-111.83,8.08-162.81,40.84-217.51,17.14-28.62,27.53-60.8,30-94.07,7.02-94.82-26.74-127.6-44.3-138.13-4.21-2.52-8.85-4.24-13.65-5.29-18.04-3.91-96.38-25.43-60.09-99.04C66.55,1.59,361.01-82.54,427.11,161.44c30.3,111.82-8.07,162.79-40.84,217.49-17.14,28.62-27.54,60.81-30.01,94.08-7.02,94.82,26.73,127.6,44.29,138.13,4.22,2.52,8.86,4.25,13.65,5.29,18.04,3.91,96.38,25.43,60.1,99.06Z'
export const ovalCoords =
  'm449.5,193v414.5c0,106.31-86.19,192.5-192.5,192.5s-192.5-86.19-192.5-192.5V193C64.5,86.69,150.69.5,257,.5s192.5,86.19,192.5,192.5Z'
export const diamondCoords =
  'm250,705.87L65.82,375l.27-.49L250,44.13l.87,1.57,183.31,329.3-.27.49-183.91,330.38Z'
