import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import DrizzleApis from 'apis/DrizzleApis';
import Web3Apis from 'apis/Web3Apis';
import Tooltip from '@material-ui/core/Tooltip';
const styles = theme => ({
  dollar: {
    margin: theme.spacing.unit * 0,
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
  },
});

class CuratorDepositOnDocument extends React.Component {

  web3Apis = new Web3Apis();

  state = {
    curatorDepositOnDocument: 0,
    anchorEl: null,
    open: false
  };

  componentWillMount () {
    const { document, loggedInAccount } = this.props;

    //console.log(document);
    this.web3Apis.getCuratorDepositOnUserDocument(loggedInAccount, document.documentId).then((data) => {
      this.setState({curatorDepositOnDocument:data});
    });
  }

  render() {
    const { classes, drizzleApis, deposit } = this.props;
    const { anchorEl, open } = this.state;

    const curatorDepositOnDocument = this.state.curatorDepositOnDocument;
    const textDeck = drizzleApis.toEther(curatorDepositOnDocument?curatorDepositOnDocument:0) + " DECK";

    return (
     <span>
       <Tooltip title={textDeck} placement="bottom">
        <span className={classes.dollar}>
          ${this.web3Apis.toDollar(curatorDepositOnDocument)}
        </span>
      </Tooltip>
    </span>
    );
  }
}

export default withStyles(styles)(CuratorDepositOnDocument);