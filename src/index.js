import {fromEvent} from 'rxjs'
import {throttleTime, buffer, map, filter, tap} from 'rxjs/operators'

const log = console.log
const button = document.querySelector('#button')
const label = document.querySelector('h3')

const clickStream = fromEvent(button, 'click')

const bufferedClickStream = clickStream.pipe(
  buffer(clickStream.pipe(throttleTime(250))),
  map(ra => ra.length),
)

const doubleClickStream = bufferedClickStream.pipe(filter(len => len === 2))
doubleClickStream.subscribe(val => {
  log('doubleClick: ', val)
  label.textContent = 'double click'
})

bufferedClickStream.pipe(filter(len => len !== 2)).subscribe(val => {
  log('click: ', val)
  label.textContent = '-'
})
