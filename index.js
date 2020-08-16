import * as jQuery from 'jquery'
import {fromEvent} from 'rxjs'
import {fromPromise} from 'rxjs/internal-compatibility'
import {map, mergeMap} from 'rxjs/operators'

const refresh = document.querySelector('.refresh')
const refreshClickStream = fromEvent(refresh, 'click')

const urlStream = refreshClickStream.pipe(
  map(event => {
    const offset = Math.floor(Math.random() * 500)
    return 'http://api.github.com/users?since=' + offset
  }),
)

const responseStream = urlStream.pipe(
  mergeMap(url => fromPromise(jQuery.getJSON(url))),
)

function createUserStream(responseStream) {
  return responseStream.pipe(
    map(users => users[Math.floor(Math.random() * users.length)]),
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
  const username = element.querySelector('.username')
  const img = element.querySelector('img')
  username.href = user.html_url
  username.textContent = user.login
  img.src = user.avatar_url
}
