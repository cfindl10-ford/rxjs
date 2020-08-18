import {fromEvent, interval} from 'rxjs'
import {switchMapTo} from 'rxjs/operators'

const log = console.log

// startStream:       ----s----s-s----->
const startStream = fromEvent(document.querySelector('#start'), 'click')

// intervalStream:    ---0----1---2---->
const intervalStream = interval(1000)

// startButtonStream:            ----s----s-s----->
// switchMap(e=>intervalStream): ----i----i-i----->
// switchMapTo(intervalStream)
// startIntervalStream:          ----012340101234->
const startIntervalStream = startStream.pipe(switchMapTo(intervalStream))

startIntervalStream.subscribe(n => log(n))
