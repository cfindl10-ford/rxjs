import * as jQuery from 'jquery'
import {of} from 'rxjs'
import {fromPromise} from 'rxjs/internal-compatibility'
import {mergeMap, tap} from 'rxjs/operators'

const log = console.log
const urlStream = of('https://api.github.com/users')

const responseStream = urlStream.pipe(
  mergeMap(url => fromPromise(jQuery.getJSON(url))),
)

responseStream.subscribe(response => log(response))
