import React from "react";

class Ads extends React.Component {

  render() {
    const { close, getIsMobile } = this.props;

    return (
      <div className="demo-ads-wrapper">
        <img src={require("assets/image/common/demo-thumb.png")} alt="demo"
             className={getIsMobile ? "mr-1 ad-demo-img" : "mr-4"}/>
        Tachyon Demo {getIsMobile ? "" : "Day 2018: Decompany Presentation"}
        <a target="_blank" href="https://www.youtube.com/watch?v=bsfzLW0ncYg" rel="noopener noreferrer"
           title="Link to demonstration video">
          <img src={require("assets/image/common/demo-watchnow.svg")} alt="watch now"
               className={"demo-ads-watch " + (getIsMobile ? "ml-1" : "ml-4")}/>
        </a>
        <i className="material-icons ad-close-btn" onClick={() => close()}>close</i>
      </div>
    );
  }
}

export default Ads;