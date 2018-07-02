import xs from 'xstream';
import { input, makeDOMDriver } from '@cycle/dom';
import { Sources, Sinks } from './interfaces';
import { run } from '@cycle/run';
import * as Snabbdom from 'snabbdom-pragma';

export function bim(sources: Sources) : Sinks {
  const changeWeight$ = sources.DOM.select('.weight')
    .events('input')
    .map((ev: any) => ev.target.value)

  const changeHeight$ = sources.DOM.select('.height')
    .events('input')
    .map((ev: any) => ev.target.value)

  const weight$ = changeWeight$.startWith(70)
  const height$ = changeHeight$.startWith(170)

  const bmi$ = xs.combine(weight$, height$)
    .map(([weight, height]) => {
      const heightMeters = height * 0.01
      return Math.round(weight / (heightMeters * heightMeters))
    })

  const vdom$ = bmi$.map(bmi => 
    <div>
      <div>体重: km <input className="weight" type="range" min="40" max="140" /></div> 
      <div>身高: cm <input className="height" type="range" min="40" max="210" /></div> 
      <h2>{ '你的标准体重指数是' + bmi }</h2>
    </div> 
  )

  return {
    DOM: vdom$
  }
}
