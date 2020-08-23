import {interval} from 'rxjs'
import {scan, mapTo, filter} from 'rxjs/operators'

const log = console.log
const countdown = document.getElementById('countdown')
const message = document.getElementById('message')

const counterStream = interval(1000)

counterStream
  .pipe(
    mapTo(-1),
    scan((acc, curr) => acc + curr, 11),
    filter(count => count >= 0),
  )
  .subscribe(count => {
    countdown.innerHTML = count
    if (!count) message.innerHTML = 'liftoff'
  })
