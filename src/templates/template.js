import React, { Component } from 'react';
import axios from 'axios';

class Template extends Component {
    _isMounted = false;
    constructor() {
        super();
        this.state = { 
            base_url: 'https://api.exchangeratesapi.io/latest?base=IDR&symbols=IDR,USD,JPY,CAD,CHF,EUR',
            base_amount: 18159.1691,
            result: {
                base: 'IDR',
                date: null,
                rates: null
            },
            last_sync: null
         }
    }
    
  getData = (url) => {
    axios.get(url)
      .then(response => {
        console.log('response', response.data)
        if(this._isMounted) {
          this.setState({
            result: response.data,
            last_sync: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
          })
        }
      })
  }
  
  componentDidMount() {
      console.log('Component Did Mount')
      this._isMounted = true;
      this.getData(this.state.base_url);
  }
  
  componentDidUpdate(prevProps, prevState) {
    if(this.state.result !== prevState.result) {
        console.log('Component Did Update')
        setTimeout(()=> 
            this.getData(this.state.base_url), prevState.result === null ? 1000 : 60000)
    }
  }

  componentWillUnmount() {
    console.log('Component Will UnMount')
    this._isMounted = false;
  }

    render() { 
        return ( 
            <>
                {!this.state.result.rates &&
                    <div>LOADING...</div> 
                }
                <div style={{marginTop: '25px'}}>Exchange Rate Date : {this.state.result.date}</div>
                <table>
                    <thead><tr><th></th><th>WE BUY</th><th>EXCHANGE RATE</th><th>WE SELL</th></tr></thead>
                    <tbody>
                    {this.state.result.rates && 
                        Object.keys(this.state.result.rates).map((key) => {
                            return (
                                <tr><td>{key}</td>
                                    <td>{(this.state.result.rates[key] * 1.02 * this.state.base_amount).toFixed(4)}</td>
                                    <td>{(this.state.result.rates[key] * this.state.base_amount).toFixed(4)}</td>
                                    <td>{(this.state.result.rates[key] * 0.98 * this.state.base_amount).toFixed(4)}</td>
                                </tr>)
                        })
                    }</tbody>
                </table>
                <div>Last sync : {this.state.last_sync}</div>
                <div>base currency is {this.state.result.base}</div>
            </>  
        );
    }
}
export default Template;