import {fromEvent, interval} from 'rxjs'
import {switchMapTo, takeUntil} from 'rxjs/operators'

const log = console.log

// startStream:       ----s----s-s----->
const startStream = fromEvent(document.querySelector('#start'), 'click')
// stopStream:       -------x--x---x-->
const stopStream = fromEvent(document.querySelector('#stop'), 'click')

// intervalStream:    ---0----1---2---->
const intervalStream = interval(1000)

// startStream:                  ----s----s-s----->
// switchMap(e=>intervalStream): ----i----i-i----->
// switchMapTo(intervalStream)
// startIntervalStream:          ----012340101234->
const startIntervalStream = startStream.pipe(switchMapTo(intervalStream))

// intervalStream:        ---0----1---2---->
// stopStream:            --------x-------->
// takeUntil(stopStream):
// stopIntervalStream   : ---0----1-------->
const stopIntervalStream = intervalStream.pipe(takeUntil(stopStream))

// startStream:                  ----s-----s-s----->
// switchMapTo(stopIntervalStream)
// stopIntervalStream:           --------x-----x-->
// startIntervalThenStopStream:  ----01234---012-->
const startIntervalThenStopStream = startStream.pipe(
  switchMapTo(stopIntervalStream),
)
startIntervalThenStopStream.subscribe(n => log(n))
