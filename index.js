import {fromEvent, interval, merge, combineLatest} from 'rxjs'
import {map, mapTo, scan, startWith, switchMap, takeUntil} from 'rxjs/operators'

const log = console.log

const startStream = fromEvent(document.querySelector('#start'), 'click')
const stopStream = fromEvent(document.querySelector('#stop'), 'click')
const resetStream = fromEvent(document.querySelector('#reset'), 'click')
const halfStream = fromEvent(document.querySelector('#half'), 'click')
const quarterStream = fromEvent(document.querySelector('#quarter'), 'click')

const increment = n => n + 1
const reset = () => 0

const startStreams = merge(
  startStream.pipe(mapTo(1000)),
  halfStream.pipe(mapTo(500)),
  quarterStream.pipe(mapTo(250)),
  3,
)

const setIncrementAndCountUntilStopOrReset = time =>
  merge(
    interval(time)
      .pipe(takeUntil(stopStream))
      .pipe(mapTo(increment)),
    resetStream.pipe(mapTo(reset)),
    2,
  )

const startTimerStream = startStreams.pipe(
  switchMap(setIncrementAndCountUntilStopOrReset),
  startWith(reset()),
  scan((acc, curr) => curr(acc)),
)

const inputStream = fromEvent(document.querySelector('#input'), 'input').pipe(
  map(event => event.target.value),
)

combineLatest(startTimerStream, inputStream)
  .pipe(map(ra => ({count: ra[0], text: ra[1]})))
  .subscribe(x => log(x))
