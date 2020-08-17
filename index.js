import * as jQuery from 'jquery'
import {fromEvent, from, of, merge} from 'rxjs'
import {
  map,
  mergeMap,
  shareReplay,
  startWith,
  tap,
  withLatestFrom,
} from 'rxjs/operators'

const replaceButton1 = document.querySelector('.close1')
const replaceButton2 = document.querySelector('.close2')
const replaceButton3 = document.querySelector('.close3')

const replace1ClickStream = fromEvent(replaceButton1, 'click')
const replace2ClickStream = fromEvent(replaceButton2, 'click')
const replace3ClickStream = fromEvent(replaceButton3, 'click')

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
  shareReplay(1),
)

// refreshUrlStream:   -------c----------------------->
// :                   -------N----------------------->
// urlStream:          u------u----------------------->
// responseStream:     ---R------R-------------------->
// replaceClickStream: ---------------x--------------->
// :                   ---------------R--------------->
// user1Stream:        N--1---N--1----N--------------->

function getRandom(users) {
  return users[Math.floor(Math.random() * users.length)]
}

function createUserStream(responseStream, replaceClickStream) {
  return merge(
    replaceClickStream.pipe(
      withLatestFrom(responseStream, (event, users) => getRandom(users)),
    ),
    responseStream.pipe(
      map(users => getRandom(users)),
      startWith(null),
    ),
    refreshClickStream.pipe(map(event => null)),
  )
}

const user1Stream = createUserStream(responseStream, replace1ClickStream)
const user2Stream = createUserStream(responseStream, replace2ClickStream)
const user3Stream = createUserStream(responseStream, replace3ClickStream)

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
