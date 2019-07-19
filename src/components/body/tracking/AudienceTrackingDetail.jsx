import React from "react";
import { Link, withRouter } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";

import MainRepository from "../../../redux/MainRepository";
import Common from "../../../config/common";
import Tooltip from "@material-ui/core/Tooltip";
import { ThreeBounce } from "better-react-spinkit";
import { psString } from "../../../config/localization";

class AudienceTrackingDetail extends React.Component {
  state = {
    resultList: [],
    textList: [],
    loading: false,
    error: null,
    eventId: null
  };

  handleClick = (e) => {
    const parentElement = e.currentTarget.parentElement;
    if (parentElement.children[0].classList.length > 1) {
      parentElement.children[0].classList.remove("on");
      parentElement.children[1].classList.remove("scroll-out");
      parentElement.children[1].classList.add("scroll-up");
    } else {
      parentElement.children[0].classList.add("on");
      parentElement.children[1].classList.remove("scroll-up");
      parentElement.children[1].classList.add("scroll-out");
    }
  };


  // 잘못된 접근, 404 페이지 이동
  wrongAccess = () => {
    const { setAlertCode } = this.props;
    this.props.history.push({
      pathname: "/404",
      state: { errMessage: psString("tracking-list-err-1") }
    });
    setAlertCode(2002);
  };


  // 트랙킹 정보 GET
  getTrackingInfo = () => {
    const { location } = this.props;

    let cid = null;
    if (location.state && location.state.cid) cid = location.state.cid;

    if (!cid) this.wrongAccess();
    else {
      this.setState({ loading: true });

      const params = {
        cid: cid,
        documentId: location.state.document.documentId,
        include: location.state.onePageFlag,
        anonymous: location.state.anonymousFlag
      };

      MainRepository.Tracking.getTrackingInfo(params, (res) => {
        let resData = res;
        this.setState({ loading: false });
        this.setState({ resultList: resData.resultList ? resData.resultList : [] });
      }, err => {
        console.error(err);
        setTimeout(() => {
          this.getTrackingInfo();
        }, 8000);
      });
    }
  };

  getImgUrl = (page) => {
    const { location } = this.props;
    return Common.getThumbnail(location.state.document.documentId, 320, page);
  };

  getSortedTime = (result) => {
    result.viewTracking.sort((a, b) => a.t - b.t);
    return Common.timestampToTime(result.viewTracking[0].t);
  };

  getStayingTime = (result) => {
    result.viewTracking.sort((a, b) => a.t - b.t);
    let nextDt = result.viewTracking[result.viewTracking.length - 1].t;
    let prevDt = result.viewTracking[0].t;

    return Common.timestampToDurationJustTime(nextDt - prevDt);
  };

  componentWillMount() {
    this.getTrackingInfo();
  }

  render() {
    const { history, match, location } = this.props;
    const { loading, resultList } = this.state;

    if (!location.state || !location.state.cid) return false;

    const documentText = location.state.documentText;
    let email = location.state.email;
    let time = Common.timestampToDate(Number(location.state.time));

    return (

      <div className="u__center tracking-detail-container">

        <div className="row tracking_inner">
          <div className="col-sm-12 col-md-12 tracking_top">
            <div className="tracking-detail-title h3 d-inline-block mr-5">
              <span className="mr-3">{email}</span>
              <span className="tracking-time d-block d-sm-inline-block">{time}</span>
              <div className="back-btn-wrapper" onClick={history.goBack}>
                <img src={require("assets/image/icon/i_arrow_back.png")} alt="back"/>
                {psString("tracking-detail-back")}
              </div>
            </div>

            <div className="tracking_fulldown_list">
              {resultList.length > 0 && resultList.map((result, idx) => (
                <ul key={idx}>
                  <li>
                    <div className="tfl_title" onClick={this.handleClick}>
                      <i><img src={require("assets/image/icon/i_faq.png")} alt="dropdown icon"/></i>
                      <div className="font-weight-bold">
                        {this.getSortedTime(result)}
                        <span className="ml-2 font-weight-normal">
                        ( {this.getStayingTime(result)})
                        </span>
                      </div>
                    </div>
                    <div className="tfl_desc ">
                      <dl>
                        {result.viewTracking.sort((a, b) => a.t - b.t).map((_result, idx) => (
                          <dd key={idx}>
                            <div className="d-flex">
                                <span className="time"
                                      title={Common.timestampToTime(_result.t)}> {Common.timestampToTime(_result.t)} </span>

                              {_result.ev === "leave" &&
                              <div className="d-inline-block mr-3">
                                  <span
                                    className="tracking-status">{_result.ev}</span>
                              </div>
                              }
                              {_result.ev !== "leave" &&
                              <div className="d-inline-block mr-3">
                                <Tooltip
                                  title={
                                    <img src={this.getImgUrl(_result.n)} alt="thumbnail" className="w-100"/>
                                  }
                                  disableFocusListener
                                  disableTouchListener
                                  className="tooltip-style"
                                  placement="bottom">
                                  <div className="info-btn"> {_result.n}</div>
                                </Tooltip>
                              </div>
                              }

                              {_result.ev !== "leave" &&
                              <div className="d-flex w-100">
                                {documentText &&
                                <Link
                                  onClick={() => Common.scrollTop()}
                                  to={"/" + match.params.identification + "/" + match.params.seoTitle + "/" + _result.n}
                                  title={"Link to " + _result.n + " page"}>
                                  <LinesEllipsis
                                    text={<span className="tracking-detail-text">{documentText[_result.n - 1]}</span>}
                                    maxLine='1'
                                    ellipsis="..."
                                    trimRight
                                    basedOn='letters'
                                    className="d-none d-sm-block w-100"
                                  />
                                </Link>
                                }
                              </div>
                              }

                            </div>
                          </dd>
                        ))}
                      </dl>
                    </div>
                  </li>
                </ul>
              ))}

              {loading && <div className="spinner"><ThreeBounce color="#3681fe"  name="ball-pulse-sync"/></div>}

            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default withRouter(AudienceTrackingDetail);
