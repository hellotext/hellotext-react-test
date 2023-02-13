import logo from './logo.svg';
import './App.css';
import Hellotext from "@hellotext/hellotext";

Hellotext.on("session-set", async (session) => {
  console.log("session is set")
  const response = await Hellotext.track("app.installed", {
    app_attributes: {
      name: `Hellotext ${new Date().toString()}`
    }
  })

  console.log(response)
  console.log(response.data)
})

// Hellotext.initialize("BUSINESS_ID")

function App() {
  window.Hellotext = Hellotext
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
