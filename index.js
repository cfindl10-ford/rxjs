import {fromEvent} from 'rxjs'
import {map} from 'rxjs/operators'

const percentageProgressFor = ({
  scrollTop,
  scrollHeight,
  clientHeight,
}) => (scrollTop / (scrollHeight - clientHeight)) * 100

const scrollStream = fromEvent(window, 'scroll')

const progressStream = scrollStream.pipe(
  map(({target: {scrollingElement}}) =>
    percentageProgressFor(scrollingElement),
  ),
)

const progressElem = document.querySelector('.progress')

progressStream.subscribe(percentage => {
  progressElem.style.width = `${percentage}%`
})
