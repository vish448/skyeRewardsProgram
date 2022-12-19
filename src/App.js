import React, { useState, useEffect, Fragment } from 'react'
import './App.css'
import data from './api/dataSet'

function App() {
  const [loadData, setloadData] = useState({})
  const [customerRewards, setCalculateRewards] = useState({})
  const [customerTransactions, setCustomerTransactions] = useState([])
  const [customers, setCustomers] = useState([])
  const [currentCustomer, setCurrentCustomer] = useState("")

  useEffect(() => {
    setloadData({ ...data })
    setCustomers([...Object.keys(data)])
  }, []);

  const selectCustomer = (value) => {
    setCurrentCustomer(value)
      let customerData = loadData[value]

    let monthT = {
      10: {
        amounts: [],
        rewards: 0,
      },
      11: {
        amounts: [],
        rewards: 0,
      },
      12: {
        amounts: [],
        rewards: 0,
      },
    };

    customerData.map(cd => {
      let month = new Date(cd['date'])
      if (month.getMonth() + 1 === 10 || month.getMonth() + 1 === 11 || month.getMonth() + 1 === 12) {
        monthT[month.getMonth() + 1]['amounts'].push(cd['amount']);
      }
    })

    for (let key in monthT) {
      let total_month_rewards = 0;
      for (let i = 0; i < monthT[key]['amounts'].length; i++) {
        let price = monthT[key]['amounts'][i]
        total_month_rewards = total_month_rewards + rewardsCalculation(price)
      }
      monthT[key]['rewards'] = total_month_rewards
    }
    setCalculateRewards({ ...monthT })
    setCustomerTransactions([...customerData])
  };

  return (
    <div style={{
      marginTop: "20px",
      marginBottom: "50px",
      fontSize: "20px",
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: '70%',
      textAlign:'center'
    }}>
      <h2>🚀 Skye Rewards Program</h2>
      <div className="select-customer" >
        <select onChange={e => selectCustomer(e.target.value)} value={currentCustomer} >
          <option value="" disabled>Select Customer</option>
          {customers.map((item, index) => {
            return (
              <option key={index} value={item}> {item.toUpperCase()} </option>
            );
          })}
        </select>
      </div>
      {Object.keys(customerRewards).length > 0 &&
        <Fragment>
          <h3>Last 3 Months Rewards 💳</h3>
          <table className="customers">
            <thead>
              <tr>
                <th>Month</th>
                <th>Rewards</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1st Month</td>
                <td>{customerRewards[10]["rewards"]}</td>
              </tr>
              <tr>
                <td>2nd Month</td>
                <td>{customerRewards[11]["rewards"]}</td>
              </tr>
              <tr>
                <td>3rd Month</td>
                <td>{customerRewards[12]["rewards"]}</td>
              </tr>
              <tr>
                <td>Total Reward</td>
                <td>{customerRewards[10]["rewards"] + customerRewards[11]["rewards"] + customerRewards[12]["rewards"]}</td>
              </tr>
            </tbody>
          </table>
          <h3>Customer Transactions 📝</h3>
          {customerTransactions.length > 0 ?
            <table className="customers">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Rewards</th>
                </tr>
              </thead>
              <tbody>
                {customerTransactions.map((item, index) => {
                  return <tr key={index}>
                    <td>{item["date"]}</td>
                    <td>{item["amount"]}</td>
                    <td>{rewardsCalculation(item["amount"])}</td>
                  </tr>
                })}
              </tbody>
            </table>
                      : <div>No Transactions Found</div>
                  }

        </Fragment>
      }


    </ div >
  )
}

export default App;

function rewardsCalculation(transaction) {
  let rewards = 0;
  let transactionOver100  = transaction - 100; //125-100 = 25

      if (transaction > 50) {
          rewards += 50 //50
      }

      if (transactionOver100 > 0) {
          rewards += transactionOver100 * 2 
      }
  return rewards;
}