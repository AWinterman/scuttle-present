var sizzle = require('sizzle')

window.sizzle = sizzle

var sections = sizzle('section.level1')
  , current_el = sizzle(window.location.hash)

var current = sections.indexOf(current_el[0])

if(current < 0) {
  current = 0
}

document.onkeydown = next
document.onmousewheel = function(ev) {
  ev.preventDefault()
}

function next(ev) {
  if(ev.keyCode !== 38 && ev.keyCode !== 40) {
    return
  }
  ev.preventDefault()

  if(ev.keyCode === 38) {
    --current
  } else if (ev.keyCode === 40) {
    ++current
  }

  if(current < 0) {
    current = 0
  }
  if(current > sections.length - 1) {
    current = sections.length - 1
  }

  sections[current].scrollIntoView(true)

  window.location.hash = sections[current].id
}


sizzle('#demo')[0].insertAdjacentHTML('afterbegin', '<svg></svg>')



setTimeout( function() {
  require('../ScuttleDemo/example')(sizzle('svg')[0])
})
