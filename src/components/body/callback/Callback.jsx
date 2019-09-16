import React, { Component } from "react";
import MainRepository from "../../../redux/MainRepository";
import history from "apis/history/history";
import LoadingModal from "../../common/modal/LoadingModal";

class Callback extends Component {

  // 초기화
  init = () => {
    const { setAlertCode, setMyInfo } = this.props;
    // 최초 로그인 시 redux 에 myInfo 저장 필요. callback.jsx 는 Main.jsx 에 route 되기 때문에,  Main.jsx 의 init 함수가 끝난 뒤에 호출됨.

    if (MainRepository.Account.isAuthenticated()) return false;

    MainRepository.Account.handleAuthentication(this.props)
      .then((sub) => {
        MainRepository.Account.getAccountInfo(sub).then(result => {
          let res = result.user;
          if (!res.username || !res.username === "") res.username = res.email;
          res.privateDocumentCount = result.privateDocumentCount;
          if (!res.picture) res.picture = localStorage.getItem("user_info").picture;

          // 로그인 성공시, 유사 로그인 정보 삭제
          setMyInfo(res);
          history.push("/@" + res.username);
        });
      }).catch( err => {
        console.error(err);
        setAlertCode(2004);
        history.push("/");
      });
  };


  componentWillMount(): void {
    this.init();
  }


  render() {
    return (<LoadingModal/>);
  }
}

export default Callback;
