import { connect } from "react-redux";
import Bounty from "../../components/header/Bounty";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis,
  getMyInfo: state.main.myInfo,
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({})
)(Bounty);