import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeBounce } from "better-react-spinkit";

import MainRepository from "../../../../redux/MainRepository";
import NoDataIcon from "../../../common/NoDataIcon";
import CreatorTabItemContainer from "../../../../container/body/profile/creator/CreatorTabItemContainer";
import { psString } from "../../../../config/localization";
import log from "../../../../config/log";
import common_view from "../../../../common/common_view";

class CreatorUploadTab extends React.Component {
  state = {
    resultList: [],
    pageNo: null,
    isEndPage: false,
    moreDataFlag: false,
    totalViewCountInfo: null,
    loading: false
  };


  // 초기화
  init = () => {
    log.CreatorUploadTab.init();
    this.fetchDocuments();
  };


  //URL 파라미터 유저 identification GET
  getParam = () => {
    let pathArr = window.location.pathname.split("/");
    return decodeURI(pathArr[1]);
  };


  // 타임아웃 설정
  setTimeOut = params => {
    this.setTimeout = setTimeout(() => {
      this.fetchDocuments(params);
      clearTimeout(this.setTimeout);
    }, 8000);
  };


  // 무한 스크롤 데이터 추가 GET (임시 주석처리)
  fetchMoreData = () => {
    /*const { pageNo, moreDataFlag } = this.state;
    if (moreDataFlag) this.fetchDocuments({ pageNo: pageNo + 1 });*/
  };


  // 데이터 GET
  fetchDocuments = params => {
    const { userInfo, getMyInfo } = this.props;

    let param = this.getParam(),
      _params = {
        pageNo: (!params || isNaN(params.pageNo)) ? 1 : Number(params.pageNo),
        username: userInfo.username || "",
        email: userInfo.email,
        pageSize: 10000   // 임시 사용
      };

    return Promise.resolve()
      .then(() => this.setState({ loading: true }))
      .then(() => (param === getMyInfo.username || param === getMyInfo.email || param === common_view.getMySub()) ?
        MainRepository.Account.getDocuments(_params) :
        MainRepository.Document.getDocumentList(_params))
      .then(res => this.handleData(res))
      .catch(err => {
        console.error(err);
        this.setTimeOut(params);
      });
  };


  // GET 데이터 관리
  handleData = res => {
    const { getDocumentList } = this.props;
    const { resultList } = this.state;

    if (!res || !res.resultList) return Promise.reject();

    this.setState({
      loading: false,
      resultList: (resultList.length > 0) ? resultList.concat(res.resultList) : res.resultList,
      pageNo: res.pageNo,
      moreDataFlag: true,
      isEndPage: (res.count === 0 || res.resultList.length < 10),
      totalViewCountInfo: (res && res.totalViewCountInfo && !this.state.totalViewCountInfo) ? res.totalViewCountInfo : null
    }, () => {
      if (resultList.length <= 0) getDocumentList(res);
      return Promise.resolve();
    });
  };


  // 클릭 이벤트 리스너 종료
  handleResizeEnd = (e) => {
    log.ContentMain.handleResizeEnd();
    window.removeEventListener("click", () => {
    });
  };


  componentWillMount() {
    this.init();
  }


  render() {
    const { resultList, isEndPage, totalViewCountInfo, loading } = this.state;
    const { userInfo } = this.props;

    return (

      <div className="col-12">
        <div className="document-total-num">
          {psString("profile-total-documents")} <span className="font-weight-bold">{resultList.length}</span>
        </div>


        {resultList.length > 0 ?
          <InfiniteScroll
            className="overflow-hidden"
            dataLength={resultList.length}
            next={this.fetchMoreData}
            hasMore={!isEndPage}
            loader={<div className="spinner"><ThreeBounce color="#3681fe" name="ball-pulse-sync"/></div>}>
            {resultList.length > 0 && resultList.map((result, idx) => (
              <CreatorTabItemContainer document={result} userInfo={userInfo} idx={idx} key={idx}
                                       totalViewCountInfo={totalViewCountInfo}/>
            ))}</InfiniteScroll>
          :
          loading ?
            <div className="spinner"><ThreeBounce color="#3681fe" name="ball-pulse-sync"/></div>
            : <NoDataIcon className="no-data">No data</NoDataIcon>
        }
      </div>

    );
  }
}

export default CreatorUploadTab;
