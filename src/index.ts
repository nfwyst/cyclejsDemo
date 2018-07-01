import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import {Component} from './interfaces'

// import {App} from './app'
import {Main} from './checkbox'

const main: Component = Main

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
}

run(main, drivers)
