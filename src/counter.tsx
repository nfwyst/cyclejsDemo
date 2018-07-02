import xs from 'xstream';
import { run } from '@cycle/run';
import { div, input, h2, makeDOMDriver } from '@cycle/dom';
import { Sources, Sinks } from './interfaces';
import * as Snabbdom from 'snabbdom-pragma';

export function counter(sources: Sources): Sinks {
  // action stream
  const action$ = xs.merge(
    sources.DOM.select('.dec').events('click').mapTo(-1),
    sources.DOM.select('.inc').events('click').mapTo(1)
  )
  // count stream
  const count$ = action$.fold((x, y) => x + y, 0)

  const vdom$ = count$.map(count => 
    <div>
      <button className="dec">减少计数</button>
      <button className="inc">增加计数</button>
      <p>{ 'counter: ' + count }</p>
    </div>
  )

  return {
    DOM: vdom$
  }
}
