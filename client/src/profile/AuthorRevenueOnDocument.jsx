import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import ContentList from "contents/ContentList";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';
const style = {

};

class AuthorRevenueOnDocument extends React.Component {

  state = {

    author3DayRewardOnDocumentDataKey: null,
    author3DayRewardOnDocument: 0
  };



  handleRequestAuthor3DayRewardOnDocument = () => {
    const {drizzleApis, document} = this.props;

    if(this.state.author3DayRewardOnDocumentDataKey) return;

    const dataKey = drizzleApis.requestAuthor3DayRewardOnDocument(document.documentId);
    if(dataKey){
      //console.log("handleRequestBalance", dataKey);
      this.setState({author3DayRewardOnDocumentDataKey: dataKey});
    }

  }

  printAuthor3DayRewardOnDocument = () => {
    const {drizzleApis, document, handleRevenueOnDocuments} = this.props;
    //console.log("printBalance", this.state.totalBalanceDataKey);
    if(this.state.author3DayRewardOnDocumentDataKey) {

      const v = drizzleApis.getAuthor3DayRewardOnDocument(this.state.author3DayRewardOnDocumentDataKey);

      if(!isNaN(v)){
        //console.log("printAuthor3DayRewardOnDocument", document.documentId, v)
        const returnValue = Math.round(drizzleApis.fromWei(v)* 100) /100;
        if(handleRevenueOnDocuments){
          handleRevenueOnDocuments(document.documentId, returnValue);
        }

        return v;

      }

    }

    return 0;
  }



  shouldComponentUpdate(nextProps, nextState) {
    const {classes, drizzleApis} = this.props;
    if(drizzleApis.isAuthenticated()){
      this.handleRequestAuthor3DayRewardOnDocument();
    }


    return true;
  }


  render() {
    const {classes, drizzleApis, drizzleState} = this.props;

    const author3DayRewardOnDocument = this.printAuthor3DayRewardOnDocument();
    return (

     <Badge color="success">Reward 
       <span>
           $ {drizzleApis.toDollar(author3DayRewardOnDocument?author3DayRewardOnDocument:0)}
       </span>
     </Badge>


    );
  }
}

export default withStyles(style)(AuthorRevenueOnDocument);
