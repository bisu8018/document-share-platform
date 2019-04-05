import React from "react";

class NoDataIcon extends React.PureComponent {
  render() {
    return (
      <div className="no-data-icon">
        <i className="material-icons">report</i><br/>
        NO DATA
      </div>
    );
  }
}

export default NoDataIcon;