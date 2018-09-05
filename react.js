import * as React from 'react'
import WidgetBot from '@widgetbot/react-embed'

const App = () => (
  <WidgetBot
    server="299881420891881473"
    channel="355719584830980096"
    onAPI={(api) => {
      /*api.on('signIn', user => {
        console.log(`Guest signed in as ${user.name}`, user)
        api.emit('sendMessage', 'Hello world')
      })*/
    }}
  />
)

export default App

const domContainer = document.querySelector('#react_container');
ReactDOM.render(e(App), domContainer);
