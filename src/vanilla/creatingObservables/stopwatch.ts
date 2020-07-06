import {interval, fromEvent, merge} from 'rxjs'
import {map, takeUntil} from 'rxjs/operators'

const startBtn = document.querySelector('#start-button')
const stopBtn = document.querySelector('#stop-button')
const display = document.querySelector<HTMLElement>('.output')

const startBtnClicks = fromEvent(startBtn, 'click')
const stopBtnClicks = fromEvent(stopBtn, 'click')
const allClicks = merge(startBtnClicks, stopBtnClicks)

const tenthSeconds = interval(100).pipe(map(tick => tick / 10))

startBtnClicks.subscribe(() => {
  tenthSeconds
    .pipe(takeUntil(allClicks))
    .subscribe(t => (display.innerText = t + 's'))
})
