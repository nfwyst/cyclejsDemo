import xs from 'xstream';
import { div, input, p, h1, h4, a, button } from '@cycle/dom';
import { Sources, Sinks } from './interfaces'

/**
 * @param { interactionStream } sources : 用户的交互流
 * @return { screenStream } app 输出流
 */
export function Main(sources: Sources): Sinks {
  // http 请求流
  const getRandomUser$ = sources.DOM.select('.get-random').events('click')
    .map(() => {
      const randomNum = Math.round(Math.random() * 9) + 1;
      return {
        url: 'https://jsonplaceholder.typicode.com/users/' + String(randomNum),
        category: 'users',
        method: 'GET'
      };
    });

  // 获取 http 资源
  const user$: any = sources.HTTP.select('users')
    .flatten()
    .map((res:any) => res.body)
    .startWith(null)

  // 虚拟 dom
  const vdom$ = user$.map((user: any) => 
    div('.users', [
      button('.get-random', 'Get random user'),
      user === null ? null : div('.user-details', [
        h1('.user-name', user.name),
        h4('.user-email', user.email),
        a('.user-website', {attrs: {href: user.website}}, user.website)
      ])
    ]) 
  )

  // 返回 screenStream 流
  return {
    DOM: vdom$,
    HTTP: getRandomUser$
  }
}
