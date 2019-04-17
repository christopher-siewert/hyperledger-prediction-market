import React, { Component } from 'react';
import Link from 'next/link'
import Header from '../components/layout'
import fetch from 'isomorphic-unfetch'
import css from "../style.css"
const address = require("../ip-config").address

function costCalc(q1, q2) {
  const b = 100
  return b * Math.log(Math.exp(q1/b) + Math.exp(q2/b))
}

class UserInput extends Component {
  render() {
    return (
      <form>
          <label>
          User:
          <input type="text"
          value={this.props.value}
          onChange={this.props.changeTrader} />
          </label>
      </form>
    )
  }
}
class BuyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {amount: 1, option: "YES"};
  }

  handleChange = (e) => {
    this.setState({amount: e.target.value});
  }

  handleOptionChange = (e) => {
    this.setState({
      option: e.target.value
    })
  }

  handleSubmit = async (e) => {
    let bodyParams = {
      $class: "org.example.basic.BuyShares",
      trader: "resource:org.example.basic.Trader#1",
      market: "resource:org.example.basic.Market#" + this.props.ID,
      type: this.state.option,
      amount: this.state.amount
    }
    let headerParams = {"Content-Type": "application/json"}
    await fetch(address + '/api/BuyShares', {
                method: 'POST',
                headers: headerParams,
                body: JSON.stringify(bodyParams)
            }).then((res) => res.json())
            .then((data) =>  console.log(data))
            .catch((err)=>console.log(err))
  }
  render() {
    let price

    if (this.state.option == "YES") {
      price = costCalc(this.props.yesShares + Number(this.state.amount),
                  this.props.noShares) -
                  costCalc(this.props.yesShares, this.props.noShares)
    } else {
      price = costCalc(this.props.yesShares,
                  this.props.noShares + Number(this.state.amount)) -
                  costCalc(this.props.yesShares, this.props.noShares)
    }

    return (
      <div>
        <h5> Buy market shares </h5>
        <form onSubmit={this.handleSubmit}>
          <input type="radio" value="YES"
            checked={this.state.option === "YES"}
            onChange={this.handleOptionChange} /> Yes <br />
          <input type="radio" value="NO"
          checked={this.state.option === "NO"}
          onChange={this.handleOptionChange} /> No <br />
          <label>
          Amount to purchase:&nbsp;&nbsp;
          <input type="text"
          value={this.state.amount}
          onChange={this.handleChange} className="textInput"
          style={{ width: 100}}/>
          </label>&nbsp;&nbsp;
          <input type="submit" value="Submit" />
        </form>
        <p>Cost of purchase will be ${Math.round(price*100)/100}.</p>
      </div>
    );
  }
}

class SellForm extends Component {
  constructor(props) {
    super(props);
    this.state = {amount: 1, option: "YES"};
  }

  handleChange = (e) => {
    this.setState({amount: e.target.value});
  }

  handleOptionChange = (e) => {
    this.setState({
      option: e.target.value
    })
  }

  handleSubmit = async (e) => {
    let bodyParams = {
      $class: "org.example.basic.SellShares",
      trader: "resource:org.example.basic.Trader#1",
      market: "resource:org.example.basic.Market#" + this.props.ID,
      type: this.state.option,
      amount: this.state.amount
    }
    let headerParams = {"Content-Type": "application/json"}
    await fetch(address + '/api/SellShares', {
                method: 'POST',
                headers: headerParams,
                body: JSON.stringify(bodyParams)
            }).then((res) => res.json())
            .then((data) =>  console.log(data))
            .catch((err)=>console.log(err))
  }
  render() {
    let price

    if (this.state.option == "YES") {
      price = costCalc(this.props.yesShares - Number(this.state.amount),
                  this.props.noShares) -
                  costCalc(this.props.yesShares, this.props.noShares)
    } else {
      price = costCalc(this.props.yesShares,
                  this.props.noShares - Number(this.state.amount)) -
                  costCalc(this.props.yesShares, this.props.noShares)
    }

    return (
      <div>
        <h5> Sell market shares </h5>
        <form onSubmit={this.handleSubmit}>
          <input type="radio" value="YES"
            checked={this.state.option === "YES"}
            onChange={this.handleOptionChange} /> Yes <br />
          <input type="radio" value="NO"
          checked={this.state.option === "NO"}
          onChange={this.handleOptionChange} /> No <br />
          <label>
          Amount to sell:&nbsp;&nbsp;
          <input type="text"
          value={this.state.amount}
          onChange={this.handleChange}
          className="textInput"
          style={{ width: 100}}/>
          </label>&nbsp;&nbsp;
          <input type="submit" value="Submit" />
        </form>
        <p>You will be paid ${Math.round(-price*100)/100}.</p>
      </div>
    );
  }
}

class Market extends Component {
  render() {
    let yes = 0;
    let no = 0;
    if (this.props.trader.shares) {
      for (let i = 0; i < this.props.trader.shares.length; i++) {
        if (this.props.trader.shares[i].market
          == "resource:org.example.basic.Market#"
          + this.props.ID) {
            yes = this.props.trader.shares[i].yesShares
            no = this.props.trader.shares[i].noShares
        }
      }
    }

    return (
      <div className="card">
        <h3>Market {this.props.ID} - {this.props.question}</h3>
        <div>Owned Shares: {yes} yes shares and {no} no shares.</div>
        <div className="row">
        <div className="column">
          <BuyForm ID={this.props.ID}
          yesShares={this.props.yesShares}
          noShares={this.props.noShares}
          changeMarkets={this.props.changeMarkets}/>
        </div>
        <div className="column">
        <SellForm ID={this.props.ID}
        yesShares={this.props.yesShares}
        noShares={this.props.noShares}
        changeMarkets={this.props.changeMarkets}/>
        </div>
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        markets: {},
        trader: {}
      };
    }
  componentDidMount() {
    fetch(address + ":3000/api/Market")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            markets: result
          })
        },
        (error) => {
            this.setState({
              error
            })
        }
      )
    fetch(address + "/api/Trader/1")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            trader: result
          })
        },
        (error) => {
          this.setState({
            error
          })
        }
      )
    this.marketTimer = setInterval(
      () => this.changeMarkets(),
      1000
    );
    this.traderTimer = setInterval(
      () => this.changeTrader(),
      1000
    );
  }

  changeMarkets = () => {
    fetch(address + "/api/Market")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            markets: result
          })
        },
        (error) => {
            this.setState({
              error
            })
        }
      )
  }

  changeTrader = () => {
    fetch(address + "/api/Trader/1")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            trader: result
          })
        },
        (error) => {
            this.setState({
              error
            })
        }
      )
  }

  render() {
    const { error, isLoaded, markets, trader } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      let list = markets.map(entry => {
        if (entry.isResolved == false) {
          return (
            <Market
              trader={this.state.trader}
              yesShares={entry.yesShares}
              noShares={entry.noShares}
              question={entry.question}
              ID={entry.marketId}
              resolved={entry.isResolved}
              changeMarkets={this.changeMarkets}
            />
          )
        }
      })
      return (
        <div>
        <Header />
        <div className="center">
        <div className="card">
        <p>User balance: ${Math.round(this.state.trader.balance*100)/100}</p>
        </div>
        {list}
        </div>
        </div>
      )
    }
  }
}

export default App;
