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

Hellotext.initialize("zGrDJ1Lb", {
  autogenerateSession: false,
  apiRoot: 'http://api.lvh.me:3000/v1'
})

function App() {
  window.Hellotext = Hellotext
  const [forms, setForms] = useState([])

  Hellotext.on("forms:collected", (forms) => {
    setForms(Hellotext.forms.forms)
  })

  useEffect(() => {
    Hellotext.forms.collect()
  }, [])

  console.log(forms)
  return (
    <div className="App">

      <form data-hello-form="zGrDJ1Lb">
      </form>

      <header className="App-header">
        {
          forms.map(form => (
           <button onClick={() => Hellotext.forms.forms[0].mount()}>
            Load Form
          </button>
        ))
        }
      </header>
    </div>
  );
}

export default App;
