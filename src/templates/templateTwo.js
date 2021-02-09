import React, { Component } from 'react';
import axios from 'axios';
import { DataGrid } from '@material-ui/data-grid';
import { withStyles } from "@material-ui/core/styles";

const base_amount = 18159.1691;
const columns = [
    { field: 'id', headerName: ' ', width: 80},
    { field: 'weBuy', headerName: 'WE BUY', description: 'Buy price', width: 120, type: 'number',
      valueGetter: (params) => ((params.getValue('rates') || 0) * 1.02 * base_amount).toFixed(4)
    },
    { field: 'excRates', headerName: 'EXCHANGE RATE', width: 195, type: 'number',
      valueGetter: (params) => ((params.getValue('rates') || 0) * base_amount).toFixed(4)},
    {
      field: 'weSell', description: 'Sell price', headerName: 'WE SELL', type: 'number', width: 135,
      valueGetter: (params) => ((params.getValue('rates') || 0) * 0.98 * base_amount).toFixed(4)
    },
  ];

  const styles = theme => ({
    root: {
      padding: '20px', width: 550, height: 450, display: 'flex', justifyContent: 'center'
    },
    grid: {
      color: 'white', fontWeight: 'bold', fontSize: 16
    }
  });

class TemplateTwo extends Component {
    _isMounted = false;
    constructor() {
        super();
        this.state = { 
            base_url: 'https://api.exchangeratesapi.io/latest?base=IDR&symbols=IDR,USD,JPY,CAD,CHF,EUR',
            result: {
                base: 'IDR',
                date: null,
                rates: null
            },
            last_sync: null,
            data_rows: []
         }
    }
    
  getData = (url) => {
    axios.get(url)
      .then(response => {
        console.log('response', response.data)
        if(this._isMounted) {
          this.setState({
            result: response.data,
            last_sync: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
            data_rows: this.setDataRows(response.data.rates)
          });
        }
      })
  }
  
  setDataRows = (data) => {
    const data_rows = [];
    Object.entries(data).forEach(([id, rates]) => {
      data_rows.push({id, rates})
    });
    return data_rows;
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
      const { classes } = this.props;
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
                            <tr key={key}><td>{key}</td>
                                <td>{(this.state.result.rates[key] * 1.02 * base_amount).toFixed(4)}</td>
                                <td>{(this.state.result.rates[key] * base_amount).toFixed(4)}</td>
                                <td>{(this.state.result.rates[key] * 0.98 * base_amount).toFixed(4)}</td>
                            </tr>)
                    })
                }</tbody>
                </table>
                <div>Last sync : {this.state.last_sync}</div>
                <div className={classes.root} >
                  <DataGrid rows={this.state.data_rows} columns={columns} pageSize={10} className={classes.grid} />
                </div>
                <div>base currency is {this.state.result.base}</div>
            </>  
        );
    }
}
export default withStyles(styles, { withTheme: true })(TemplateTwo);