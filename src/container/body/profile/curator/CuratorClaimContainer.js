import { connect } from "react-redux";
import CuratorClaim from "../../../../components/body/profile/curator/CuratorClaim";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({})
)(CuratorClaim);