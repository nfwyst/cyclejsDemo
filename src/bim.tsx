import xs, { Stream } from 'xstream';
import { input, makeDOMDriver } from '@cycle/dom';
import { Sources, Sinks, Component } from './interfaces';
import { run } from '@cycle/run';
import * as Snabbdom from 'snabbdom-pragma';


// view helper
function renderWeightSlider(weight: number) {
  return <div>体重: { weight } km <input className="weight" type="range" min="40" max="140" /></div> 
}
function renderHeightSlider(height: number) {
  return <div>身高: { height } cm <input className="height" type="range" min="40" max="210" /></div> 
}

// model helper
function bmi(weight: any, height: any) {
  const heightMeters = height * 0.01
  return Math.round(weight / (heightMeters * heightMeters))
}

// 输出返回
function view(state$: Stream<{ weight: any, height: any, bmi: any}>) : Stream<any> {
  return state$.map(({ weight, height, bmi }: any) => 
    <div>
      {  renderHeightSlider(height) }
      { renderWeightSlider(height) }
      <h2>{ '你的标准体重指数是' + bmi }</h2>
    </div> 
  )
}

// 处理信息
function model(actions: any) {
  const weight$ = actions.changeWeight$.startWith(70)
  const height$ = actions.changeHeight$.startWith(170)

  return xs.combine(weight$, height$)
    .map(([weight, height]) => {
      return {
        weight,
        height,
        bmi: bmi(weight, height)
      }
    })
}

// 监听
function intent(domSource: any) {
  return {
    changeWeight$: domSource.select('.weight').events('input').map((ev: any) => ev.target.value),
    changeHeight$: domSource.select('.height').events('input').map((ev: any) => ev.target.value)
  }
}

export function bim(sources: Sources) : Sinks {
  // actions => model => view
  return {
    DOM: view(model(intent(sources.DOM)))
  }
}
