/*eslint-disable*/
import React from "react";

import Slide from "@material-ui/core/Slide";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Web3Apis from "apis/Web3Apis";
import Dialog from "@material-ui/core/Dialog";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class Bounty extends React.Component {
  state = {
    available: 0,
    isAuthenticated: false,
    fullWidth: true,
    classicModal: false,
    openLeft: false,
    openTop: false,
    openBottom: false,
    openRight: false,
    placement: "bottom"
  };

  web3Apis = new Web3Apis();

  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
  };

  handleClickOpen = (modal) => {
    const { auth } = this.props;

    if (!auth.isAuthenticated()) {
      auth.login(true);
      return "Loading";
    } else {
      const x = [];
      x[modal] = true;
      this.setState(x);
    }
  };

  handleClickAgree = () => {
    const { drizzleApis } = this.props;
    this.handleClose("classicModal");
    drizzleApis.bounty();
  };

  componentDidUpdate = () => {
    const { drizzleApis } = this.props;
    let isAuthenticated = drizzleApis.isAuthenticated();
    if (isAuthenticated && !this.state.isAuthenticated) {
      this.web3Apis.getBountyAvailable(drizzleApis.getLoggedInAccount()).then((data) => {
        this.setState({ isAuthenticated: true });
        this.setState({ available: data });
      }).catch((err) => {
        console.error(err);
      });
    } else if (!isAuthenticated && this.state.isAuthenticated) {
      this.setState({ isAuthenticated: false });
    }
  };

  render = () => {
    const { classes } = this.props;

    if (this.state.available > 0) {
      return (
        <span>
             <div className="bounty-btn" onClick={() => this.handleClickOpen("classicModal")} title="Get Free Deck">
                 GET<br/>FREE DECK !!
            </div>


            <Dialog
              fullWidth={this.state.fullWidth}
              open={this.state.classicModal}
              TransitionComponent={Transition}
              keepMounted
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description">

                <DialogTitle
                  id="classic-modal-slide-title"
                  disableTypography
                  className={classes.modalHeader}>
                  <i className="material-icons modal-close-btn" onClick={() => this.handleClose("classicModal")}>close</i>
                  <h3 className={classes.modalTitle}>Do you need DECK?</h3>
                </DialogTitle>


                <DialogContent id="classic-modal-slide-description" className={classes.modalBody}>
                  <div className="dialog-subject">New users can get 5000 DECK for free. (Gas fee is required)</div>
                  <div className="dialog-subject">You can vote for good docs with DECK and get rewarded.</div>
                </DialogContent>


                <DialogActions className="modal-footer">
                  <div onClick={() => this.handleClose("classicModal")} className="cancel-btn">Cancel</div>
                  <div onClick={() => this.handleClickAgree()} className="ok-btn">Upload</div>
                </DialogActions>

            </Dialog>
        </span>

      );
    } else {
      return null;
    }
  };
}

export default Bounty;
