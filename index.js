import {fromEvent, interval, merge} from 'rxjs'
import {mapTo, scan, startWith, switchMapTo, takeUntil} from 'rxjs/operators'

const log = console.log

const startStream = fromEvent(document.querySelector('#start'), 'click')
const stopStream = fromEvent(document.querySelector('#stop'), 'click')
const resetStream = fromEvent(document.querySelector('#reset'), 'click')
const intervalStream = interval(1000)
const stopIntervalStream = intervalStream.pipe(takeUntil(stopStream))

const increment = n => n + 1
const reset = () => 0

const incrementOrReset = merge(
  stopIntervalStream.pipe(mapTo(increment)),
  resetStream.pipe(mapTo(reset)),
)
startStream
  .pipe(
    switchMapTo(incrementOrReset),
    startWith(reset()),
    scan((acc, curr) => curr(acc)),
  )
  .subscribe(n => log(n))
