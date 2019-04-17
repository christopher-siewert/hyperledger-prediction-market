import React, { Component } from 'react';
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import Header from '../components/layout'
import css from "../style.css"
const address = require("../ip-config").address

const delay = ms => new Promise(res => setTimeout(res, ms))

function calcPrice (q1, q2) {
  const b = 100
  return Math.exp(q1/b) / (Math.exp(q1/b) + Math.exp(q2/b))
}

class Resolve extends Component {
  constructor(props) {
    super(props);
    this.answer = React.createRef();
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    let bodyParams = {
      "$class": "org.example.basic.ResolveMarket",
      "market": "resource:org.example.basic.Market#" + this.props.data.marketId,
      "answer": this.answer.current.value
    }
    let headerParams = {"Content-Type": "application/json"}
    await fetch(address + '/api/ResolveMarket', {
                method: 'POST',
                headers: headerParams,
                body: JSON.stringify(bodyParams)
            }).then((res) => res.json())
            .then((data) =>  console.log(data))
            .catch((err)=>console.log(err))
    bodyParams = {
      "$class": "org.example.basic.ClaimProfits",
      "trader": "resource:org.example.basic.Trader#1",
      "market": "resource:org.example.basic.Market#" + this.props.data.marketId
    }
    await delay(2000)
    await fetch(address + '/api/ClaimProfits', {
                method: 'POST',
                headers: headerParams,
                body: JSON.stringify(bodyParams)
            }).then((res) => res.json())
            .then((data) =>  console.log(data))
            .catch((err)=>console.log(err))
  }

  render() {
    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <select ref={this.answer}>
          <option value="YES">YES</option>
          <option value="NO">NO</option>
        </select>&nbsp;&nbsp;
        <input type="submit" value="Submit" />
      </form>
      </div>
    )
  }
}

class NewMarket extends Component {
  constructor(props) {
    super(props);
    this.question = React.createRef();
    this.ID = React.createRef();
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    let bodyParams = {
      "$class": "org.example.basic.Market",
      "marketId": this.ID.current.value,
      "question": this.question.current.value,
      "yesShares": 0,
      "noShares": 0,
      "isResolved": false,
      "answer": "YES"
    }
    let headerParams = {"Content-Type": "application/json"}
    await fetch(address + '/api/Market', {
                method: 'POST',
                headers: headerParams,
                body: JSON.stringify(bodyParams)
            }).then((res) => res.json())
            .then((data) =>  console.log(data))
            .catch((err)=>console.log(err))
    this.question.current.value = ""
    this.ID.current.value = ""
  }

  render() {
    return (
      <div className="card">
      <div> Create a new market</div> <br />
      <form onSubmit={this.handleSubmit}>
        <label for="ID">ID</label>&nbsp;&nbsp;&nbsp;
        <input id="ID" type="text" ref={this.ID}
        className="textInput" style={{ width: 100}}>
        </input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label for="question">Question</label>&nbsp;&nbsp;&nbsp;
        <input id="question" type="text" ref={this.question}
        className="textInput" style={{ width: 450}}>
        </input>&nbsp;&nbsp;&nbsp;
        <input type="submit" value="Submit" />
      </form>
      </div>
    )
  }
}

class Market extends Component {
  render() {
    let prob = calcPrice(this.props.data.yesShares, this.props.data.noShares)
    prob = Math.round(prob*100*100)/100
    return (
      <tr>
        <td>{this.props.data.marketId}</td>
        <td>{this.props.data.question}</td>
        <td>{this.props.data.yesShares}</td>
        <td>{this.props.data.noShares}</td>
        <td>{prob}%</td>
        <td>{this.props.data.isResolved.toString()}</td>
        <td>{this.props.data.answer}</td>
        <td><Resolve data={this.props.data} /></td>
      </tr>
    )
  }
}

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
    }
  }

  async updateMarkets() {
    const res = await fetch(address + '/api/Market')
    const json = await res.json()
    this.setState({
      isLoaded:true,
      markets:json
    })
  }

  async componentDidMount() {
    this.marketTimer = setInterval(
      () => this.updateMarkets(),
      1000
    )
  }

  render () {
    const { error, isLoaded, markets } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      let list = this.state.markets.map(entry => {
        return (
          <Market data={entry}/>
        )
      })
      return (
        <div>
          <Header />
          <div className="center">
          <NewMarket data={this.state.markets}/>
          <br />
          <table id="markets">
            <tr>
              <th>ID</th>
              <th>Question</th>
              <th>Yes</th>
              <th>No</th>
              <th>Probability</th>
              <th>Is Resolved?</th>
              <th>Answer</th>
              <th>Resolve</th>
            </tr>

          {list}
          </table>
          </div>
          </div>
      )
    }
  }
}


export default App
