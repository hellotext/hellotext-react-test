import Hellotext from "@hellotext/hellotext";
import "./App.css";

// Hellotext.on("session-set", async (session) => {
//   console.log(Hellotext.session)
//   setTimeout(async () => {
//     console.log(Hellotext.session)
//
//     const response = await Hellotext.track("app.installed", {
//       app_parameters: {
//         name: `Hellotext ${new Date().toString()}`
//       }
//     })
//
//     console.log(response)
//     console.log(response.data)
//   })
//
//
// })

Hellotext.on("form:completed", (form) => {
  console.log("form completed");
  console.log(form);
});
//
// Hellotext.on('webchat:message:sent', (message) => {
//   console.log("message sent")
//   console.log(message)
// })
//
// Hellotext.on('webchat:message:received', (message) => {
//   console.log("message recevied")
//   console.log(message)
// })

Hellotext.initialize("M01az53K", {
  apiRoot: "http://api.lvh.me:3000/v1",
  webchat: {
    id: "zGrDJ1Lb",
  },
});

function App() {
  return <div className="App" id="app"></div>;
}

export default App;
