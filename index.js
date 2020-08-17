import {fromEvent} from 'rxjs'
import {map} from 'rxjs/operators'

const clicks = fromEvent(document, 'click')
const positions = clicks.pipe(map(ev => ev.clientX))
positions.subscribe(x => console.log(x))
