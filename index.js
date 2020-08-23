import {from} from 'rxjs'
import {
  distinctUntilChanged,
  map,
  scan,
  tap,
} from 'rxjs/operators'

const log = console.log

const users = [
  {name: 'Brian', loggedIn: false, token: null},
  {name: 'Brian', loggedIn: true, token: 'abc'},
  {name: 'Brian', loggedIn: true, token: '123'},
]

const state$ = from(users).pipe(
  scan((acc, curr) => {
    return {...acc, ...curr}
  }, {}),
)

const name$ = state$.pipe(
  distinctUntilChanged(
    (prev, curr) => prev.name === curr.name,
  ),
  tap(log),
  map(state => state.name),
)

name$.subscribe(log)
