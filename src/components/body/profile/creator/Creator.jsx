import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import MainRepository from "../../../../redux/MainRepository";
import Common from "../../../../config/common";
import { ThreeBounce } from "better-react-spinkit";
import NotFoundPage from "../../../common/NotFoundPage";
import CuratorAnalyticsTabContainer from "../../../../container/body/profile/curator/CuratorAnalyticsTabContainer";
import CreatorSummaryContainer from "../../../../container/body/profile/creator/CreatorSummaryContainer";
import CuratorVoteTabContainer from "../../../../container/body/profile/curator/CuratorVoteTabContainer";
import CuratorUploadTabContainer from "../../../../container/body/profile/curator/CuratorUploadTabContainer";
import { psString } from "../../../../config/localization";


class Creator extends React.Component {
  state = {
    userInfo: null,
    errMessage: null,
    uploadDocumentList: [],
    voteDocumentList: []
  };


  //URL 파라미터 유저 identificatin GET
  getParam = () => {
    let pathArr = window.location.pathname.split("/");
    return decodeURI(pathArr[1]);
  };

  // 프로필 정보 GET
  getProfileInfo = (params: any) => {
    MainRepository.Account.getProfileInfo(params, result => {
      this.setState({ userInfo: result, errMessage: null });
    }, err => {
      this.setState({ userInfo: null, errMessage: err });
      console.error(err);
      setTimeout(() => {
        this.getProfileInfo(params);
      }, 8000);
    });
  };

  //업로드 탭에서 문서 목록 GET, AuthorSummary에서 계산 위해 사용
  getUploadDocumentList = (result: any) => {
    this.setState({ uploadDocumentList: result });
  };

  //투표 탭에서 문서 목록 GET, AuthorSummary에서 계산 위해 사용
  getVoteDocumentList = (result: any) => {
    this.setState({ voteDocumentList: result });
  };

  componentWillMount(): void {
    const { getMyInfo } = this.props;
    let presentValue = this.getParam();
    let params = {};

    if (getMyInfo.username !== presentValue && getMyInfo.email !== presentValue && getMyInfo.sub !== presentValue) {
      if (Common.checkEmailForm(presentValue)) params = { email: presentValue };
      else params = { username: presentValue };
      this.getProfileInfo(params);
    } else {
      this.setState({ userInfo: getMyInfo, errMessage: null });
    }
  }

  render() {
    const { getMyInfo } = this.props;
    const { userInfo, errMessage, uploadDocumentList, voteDocumentList } = this.state;

    let param = this.getParam();
    return (

      <div className="row mb-5">
        <div className="col-12 u__center">

          {userInfo &&
          <CreatorSummaryContainer
            uploadDocumentList={uploadDocumentList.resultList}
            uploadTotalViewCountInfo={uploadDocumentList.totalViewCountInfo}
            voteDocumentList={voteDocumentList.resultList}
            voteTotalViewCountInfo={voteDocumentList.totalViewCountInfo}
            latestRewardVoteList={voteDocumentList.latestRewardVoteList}
            userInfo={userInfo}/>
          }

          {!userInfo && !errMessage && <div className="spinner"><ThreeBounce name="ball-pulse-sync"/></div>}

          {errMessage && <NotFoundPage errMessage={errMessage}/>}

          {userInfo &&
          <Tabs forceRenderTabPanel={true}>
            <TabList>
              <Tab>{psString("Uploaded")}</Tab>
              <Tab>{psString("Voted")}</Tab>
              {(param === getMyInfo.username || param === getMyInfo.email || param === Common.getMySub()) &&
              <Tab>{psString("Analytics")}</Tab>}
            </TabList>

            <TabPanel>
              <CuratorUploadTabContainer
                userInfo={userInfo}
                getDocumentList={this.getUploadDocumentList.bind(this)}
              />
            </TabPanel>

            <TabPanel>
              <CuratorVoteTabContainer
                userInfo={userInfo}
                getDocumentList={this.getVoteDocumentList.bind(this)}
              />
            </TabPanel>

            {(param === getMyInfo.username || param === getMyInfo.email || param === Common.getMySub()) &&
            <TabPanel>
              <CuratorAnalyticsTabContainer userInfo={userInfo}/>
            </TabPanel>
            }

          </Tabs>
          }
        </div>
      </div>

    );
  }
}

export default Creator;
