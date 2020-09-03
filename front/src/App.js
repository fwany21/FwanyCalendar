import React, { Component } from "react";
// import Data from './Data';

class App extends Component {
  state = {
    data: {
      firstname: null,
      lastname: null,
    },
  };
  componentDidMount() {
    fetch("/data")
      .then((res) => res.json())
      .then((result) => this.setState({ data: result }));
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        {data.lastname} {data.firstname}
      </div>
    );
  }
}

// function App() {
//   const [data, setData] = useState({});
//   fetch("/data/Req")
//     .then((res) => res.json())
//     .then(
//       (result) => setData(result),
//       () => {
//         console.log("data read : ", data);
//       }
//     );
//   return (
//     // <div>
//     //   <Data />
//     // </div>
//     <div>
//       {data.lastname} {data.firstname}
//     </div>
//   );
// }

export default App;
