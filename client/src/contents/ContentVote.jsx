import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { NavigateBefore, NavigateNext, Face } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Badge from "components/Badge/Badge.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';

const style = {

};

class ContentVote extends React.Component {

  drizzleApis = new DrizzleApis(this.props.drizzle);

  state = {
    loading: true,
    buttonText: "Commit",
    approve: {stackId: -1, done: false, voteOpening: false},
    vote: {stackId:-1, done: false, complete: false}
  }

  componentWillMount() {

  }

  compomentWillUnmount() {

  }

  componentDidMount() {

  }



  getDeposit = () => {
    const deposit = document.getElementById("deposit").value;
    return deposit;
  }

  clearVoteInfo = () => {

    this.setState({
      approve: {stackId: -1, done: false, voteOpening: false},
      vote: {stackId:-1, done: false, complete: false}
    })

    document.getElementById("deposit").value = null;

  }
  onClickVoteStep2=()=> {
    this.handleVoteOnDocument();
    console.log("onclickvotestep2");
  }
  onClickVote = () => {
    //this.subscribeDrizzle();
    //console.log("subscribeDrizzle start");
    this.handleApprove();
    //this.handleVoteOnDocument();

    console.log("handleApprove start");
  }

  handleApprove = () => {

    const { document, drizzle } = this.props;

    if(!document) return;

    const deposit = this.getDeposit();

    if(deposit<=0){
      alert("Deposit must be greater than zero.");
      return;
    }

      this.unsubscribeApprove = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.getTxApproveStatus();

        if(this.state.approve.done){
          this.unsubscribeApprove();
          if(!this.state.approve.error) {
            this.handleVoteOnDocument();
          }
        }
      } else {
        console.error("drizzleState does not initialized");
      }

    });

    const stackId = this.drizzleApis.approve(deposit);
    this.setState({approve:{stackId:stackId}});
  }

  getTxApproveStatus = () => {

    if(this.state.approve.done) return;

    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.approve.stackId];

    // if transaction hash does not exist, don't display anything
    if(!txHash) return;

    const txState = transactions[txHash].status;
    const txReceipt = transactions[txHash].receipt;
    const confirmations = transactions[txHash].confirmations;

    this.setState({buttonText: "Approve " + txState});

    if(txState=="success") {
      this.setState({
        approve: {done: true}
      });
    } else if(txState=="error") {
      this.setState({
        approve: {done: true, error:"error"}
      });
    }

    console.log("getTxApproveStatus", txState, txReceipt, transactions[txHash]);
    // otherwise, return the transaction status
    //return `Transaction status: ${transactions[txHash].status}`;
  };

  handleVoteOnDocument = () => {

    const { document, drizzle } = this.props;

    if(!document) return;

    const deposit = this.getDeposit();

    if(deposit<=0){
      alert("Deposit must be greater than zero.");
      return;
    }

    this.setState({
      approve: {voteOpening: true}
    });

    this.unsubscribeVote = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.getTxVoteStatus();

        if(this.state.vote.done){
          this.unsubscribeVote();
          this.clearVoteInfo();
        }
      } else {
        console.error("drizzleState does not initialized");
      }

    });

    const stackId = this.drizzleApis.voteOnDocument(document.documentId, deposit);
    this.setState({vote:{stackId:stackId}});
  }



  getTxVoteStatus = () => {

    if(this.state.vote.done) return;

    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.vote.stackId];

    // if transaction hash does not exist, don't display anything
    if(!txHash) return;

    const txState = transactions[txHash].status;
    const txReceipt = transactions[txHash].receipt;

    this.setState({buttonText: "Voting " + txState});

    if(txState=="success"){
      this.setState({
        vote: {done: true, complete: true}
      });
    } else if(txState=="error"){
      this.setState({
        vote: {done: true, error:"error", complete:false}
      });
    }

    console.log("getTxVoteStatus", txState, txReceipt);
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <h3>Voting</h3>

        <h4>1. Total amount of tokens voted</h4>
        <ul className="voteList">
            <li><strong>You : </strong> <span>0.00 DECK</span></li>
            <li><strong>Total : </strong> <span>0.00 DECK</span></li>
        </ul>

        <h4>2. Total amount of tokens earned</h4>
        <ul className="voteList">
            <li><strong>You : </strong> <span>0.00 DECK</span></li>
            <li><strong>Total : </strong> <span>0.00 DECK</span></li>
        </ul>

        <h4>3. Amount of available tokens</h4>
        <ul className="voteList">
            <li><strong></strong><span>13.00 DECK</span></li>
        </ul>


        <h4>4. Estimated daily earning</h4>
        <ul className="voteList">
            <li>0.00 ~ 0.00 DECK / 1day</li>
            <li>0.00 ~ 0.00 dollor($) / 1day</li>
        </ul>

        <h4>5. Enter the number of votes to commit</h4>
        <div className="deckInput">
            <CustomInput
              labelText="DECK"
              error
              id="deposit"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "text"
              }}
            />
        </div>

        <p className="notiTxt">Note: The token used for voting can be withdrawn after 40 days.</p>

        <div>
            <Button sz="large" color="rose" fullWidth onClick={this.onClickVote} >{this.state.buttonText}</Button>
            <Button sz="large" color="rose" fullWidth onClick={this.onClickVoteStep2} >Vote</Button>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(ContentVote);