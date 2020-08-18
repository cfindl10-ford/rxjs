import {fromEvent, interval, merge} from 'rxjs'
import {mapTo, scan, startWith, switchMap, takeUntil} from 'rxjs/operators'

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

startStreams
  .pipe(
    switchMap(setIncrementAndCountUntilStopOrReset),
    startWith(reset()),
    scan((acc, curr) => curr(acc)),
  )
  .subscribe(n => log(n))
