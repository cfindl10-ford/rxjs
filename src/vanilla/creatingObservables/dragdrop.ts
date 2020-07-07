import {fromEvent} from 'rxjs'
import {map, takeUntil} from 'rxjs/operators'

const draggable = document.querySelector<HTMLElement>('#draggable')
const mouseDowns = fromEvent<MouseEvent>(draggable, 'mousedown')
const mouseMoves = fromEvent<MouseEvent>(draggable, 'mousemove')
const mouseUps = fromEvent<MouseEvent>(draggable, 'mouseup')

mouseDowns.subscribe(() => {
  mouseMoves
    .pipe(
      map(e => {
        e.preventDefault()
        return {x: e.clientX, y: e.clientY}
      }),
      takeUntil(mouseUps)
    )
    .subscribe(pos => {
      draggable.style.left = pos.x + 'px'
      draggable.style.top = pos.y + 'px'
    })
})
