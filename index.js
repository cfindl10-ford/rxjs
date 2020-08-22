import {timer} from 'rxjs'

const log = console.log
timer(2000, 500).subscribe(log)
