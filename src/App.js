import { useEffect, useState } from 'react';

import logo from './logo.svg';
import './App.css';
import Hellotext from "@hellotext/hellotext";

// Hellotext.on("session-set", async (session) => {
//   console.log("session is set")
//   const response = await Hellotext.track("app.installed", {
//     app_parameters: {
//       name: `Hellotext ${new Date().toString()}`
//     }
//   })
//
//   console.log(response)
//   console.log(response.data)
// })

Hellotext.on('form:completed', (form) => {
  console.log("form completed")
  console.log(form)
})

Hellotext.on('webchat:message:sent', (message) => {
  console.log("message sent")
  console.log(message)
})

Hellotext.on('webchat:message:received', (message) => {
  console.log("message recevied")
  console.log(message)
})

Hellotext.initialize("zGrDJ1Lb", {
  apiRoot: 'http://api.lvh.me:3000/v1',
  webChat: {
    id: 'APwbP54L',
    container: '#app',
    behaviour: 'modal',
  }
})

function App() {

  return (
    <div className="App" id="app">
      <header className="App-header">
      </header>
    </div>
  );
}

export default App;
