import React, { Component } from "react";
import TendersApp from "./contracts/TendersApp.json";
import getWeb3 from "./getWeb3";
import "./App.css";

import bootstrap from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import parse from 'html-react-parser';
class App extends Component {
  state = { bids_html:'',select_html: '', web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TendersApp.networks[networkId];
      const instance = new web3.eth.Contract(
        TendersApp.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      console.log(instance);
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleBidsFormSubmit = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    await contract.methods.placeBid(
      this.state.tenderid,
      this.state.bidid,
      this.state.quotationclause,
      this.state.numofdays,
      this.state.amount

    ).send({ from: accounts[0] });
  }
  handleFormSubmit = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    await contract.methods.createTender(
      this.state.tendername,
      this.state.tenderid,
      this.state.closingdate,
      this.state.openingdate,
      this.state.tasks,
      this.state.constraints,
      25000//to be changed

    ).send({ from: accounts[0] });

  }
  handleTenderInputChange= async (event) => {
    let name = event.target.name;
    let val= event.target.value;
    this.setState({tenderid:val});
    const { accounts, contract } = this.state;
    
    let res = await contract.methods.getTenderBids(val).call();

    let bidsOptions='<option value="0">Select a Bid</option><option value="'+res[0]+'">'+res[2]+'</option>';
    this.setState({bids_html:bidsOptions});
    console.log(res);

  }
  completeTender= async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    console.log("tender"+this.state.tenderid+"bid"+
      this.state.bidid);
    await contract.methods.completeTender(
      this.state.tenderid,
      this.state.bidid
    ).send({ from: accounts[0] });
    
  }
  handleInputChange = async (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({
      [nam]: val
    });
  }
  runExample = async () => {
    const { accounts, contract } = this.state;
    console.log(contract);
    let selectOptions = '';
    // Stores a given value, 5 by default.
    let tendercount = await contract.methods.tenderCounter().call();
    for (let i = 1; i <= tendercount; i++) {
      let res = await contract.methods.tenders(i).call();
      selectOptions = selectOptions + '<option value="' + res[1] + '" >' + res[0] + '</option>';
    }
    this.setState({ select_html: selectOptions });
    console.log(selectOptions);


    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // Update state with the result.
    //this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1>Welcome to the third usecase session TENDERS APP</h1>
              <h2>Fill the tender information</h2>

              <form onSubmit={this.handleFormSubmit}>

                <label htmlFor="tenderid">Tender ID</label>
                <input className="form-control" name="tenderid" placeholder="Tender ID" onChange={this.handleInputChange}  ></input>

                <label htmlFor="tendername">Tender Name</label>
                <input className="form-control" name="tendername" placeholder="Tender Name" onChange={this.handleInputChange} ></input>

                <label htmlFor="closingdate">Closing Date</label>
                <input className="form-control" name="closingdate" placeholder="Closing Date" onChange={this.handleInputChange} ></input>

                <label htmlFor="openingdate">Opening Date</label>
                <input className="form-control" name="openingdate" placeholder="Opening Date" onChange={this.handleInputChange}  ></input>

                <label htmlFor="tasks">Tasks</label>
                <input className="form-control" name="tasks" placeholder="Tasks" onChange={this.handleInputChange} ></input>

                <label htmlFor="constraints">Constraints</label>
                <input className="form-control" name="constraints" placeholder="Constraints" onChange={this.handleInputChange}   ></input>

                <input type="submit" className="btn btn-primary"></input>



              </form>
            </div>
          </div>
        </div>


        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2>Place a Bid</h2>

              <form onSubmit={this.handleBidsFormSubmit}>

                <label htmlFor="tenderid">Tender ID</label>
                <select className="form-control" name="tenderid" onChange={this.handleInputChange}>

                  {parse(this.state.select_html)}
                </select>

                <label htmlFor="bidid">Bid ID</label>
                <input className="form-control" name="bidid" placeholder="Bid ID" onChange={this.handleInputChange}  ></input>

                <label htmlFor="quotationclause">Quotation Clause</label>
                <input className="form-control" name="quotationclause" placeholder=" Quotation Clause" onChange={this.handleInputChange}  ></input>

                <label htmlFor="numofdays">Number Of Working Days</label>
                <input className="form-control" name="numofdays" placeholder=" Number of Working Days" onChange={this.handleInputChange}  ></input>
                <label htmlFor="amount">Proposal Amount</label>
                <input className="form-control" name="amount" placeholder=" Proposal Amount" onChange={this.handleInputChange}  ></input>

                <input type="submit" className="btn btn-primary"></input>


              </form>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2>Choose Bids And Close the Tender</h2>

              <form onSubmit={this.completeTender}>

                <label htmlFor="tenderid">Tender ID</label>
                <select className="form-control" name="tenderid" onChange={this.handleTenderInputChange}>

                  {parse(this.state.select_html)}
                </select>

                <label htmlFor="bidid">Bids</label>
                <select className="form-control" name="bidid" onChange={this.handleInputChange}>

                  {parse(this.state.bids_html)}
                </select>

                <input type="submit" className="btn btn-primary"></input>


              </form>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
