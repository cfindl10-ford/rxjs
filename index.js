import * as jQuery from 'jquery'
import {fromEvent, from, of, merge} from 'rxjs'
import {map, mergeMap, startWith} from 'rxjs/operators'

const refresh = document.querySelector('.refresh')
const refreshClickStream = fromEvent(refresh, 'click')
const startupUrlStream = of('http://api.github.com/users')

const refreshUrlStream = refreshClickStream.pipe(
  map(event => {
    const offset = Math.floor(Math.random() * 500)
    return 'http://api.github.com/users?since=' + offset
  }),
)

const urlStream = merge(startupUrlStream, refreshUrlStream)

const responseStream = urlStream.pipe(
  mergeMap(url => from(jQuery.getJSON(url))),
)

function createUserStream(responseStream) {
  return responseStream.pipe(
    map(users => users[Math.floor(Math.random() * users.length)]),
    startWith(null),
  )
}

const user1Stream = createUserStream(responseStream)
const user2Stream = createUserStream(responseStream)
const user3Stream = createUserStream(responseStream)

user1Stream.subscribe(user => render(user, '.suggestion1'))
user2Stream.subscribe(user => render(user, '.suggestion2'))
user3Stream.subscribe(user => render(user, '.suggestion3'))

function render(user, selector) {
  const element = document.querySelector(selector)
  if (user === null) {
    element.style.visibility = 'hidden'
    return
  }
  element.style.visibility = 'visible'
  const username = element.querySelector('.username')
  const img = element.querySelector('img')
  username.href = user.html_url
  username.textContent = user.login
  img.src = user.avatar_url
}
