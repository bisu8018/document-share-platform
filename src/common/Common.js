import { APP_PROPERTIES } from "../properties/app.properties";

const imgDomain = APP_PROPERTIES.domain().image;
//const apiDomain = APP_PROPERTIES.domain().api;

export default ({
    timestampToDateTime: (timestamp) => {
      let date = new Date(timestamp);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let year = date.getFullYear();
      let month = months[date.getMonth()];
      let day = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();
      let sec = date.getSeconds();
      let time = day + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;

      return time;
    },
    timestampToDate: (timestamp) => {
      let date = new Date(timestamp);
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let year = date.getFullYear();
      let month = months[date.getMonth()];
      let day = date.getDate();
      let _date = month + " " + day + ", " + year;

      return _date;
    },
    timestampToTime: (timestamp) => {
      let date = new Date(timestamp);
      let hour = date.getHours();
      let min = date.getMinutes();
      let sec = date.getSeconds();
      let time = (hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;

      return time;
    },
    dateAgo: (timestamp) => {
      let currentDate = new Date();
      let lastDate = new Date(timestamp);
      let restDate = Math.floor((currentDate - lastDate) / (60 * 60 * 24 * 1000));


      return restDate;
    },
    handleOnClick: () => {
      window.scrollTo(0, 0);
    },
    convertTimestampToString: (timestamp) => {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      };
      return (new Date(timestamp)).toLocaleString("en-US", options);
    },
    getThumbnail: (documentId, pageNo, documentName) => {
      let imageUrl = imgDomain + "/THUMBNAIL/" + documentId + "/300X300/"  + pageNo;
      if(documentName){
        if(documentName.lastIndexOf(".dotx")>0 || documentName.lastIndexOf(".dot")>0 || documentName.lastIndexOf(".docx")>0){
          imageUrl = this.getPageView(documentId, 1);
        }
      }
      return imageUrl;
    },
    getText: (documentId, pageNo, callback) => {
      let textUrl = imgDomain + "/THUMBNAIL/" + documentId + "/text/"  + pageNo;

      fetch(textUrl).then((result)=> {
        result.text().then((_result) => {
          callback(_result);
        });
      });
    },
    getPageView: (documentId, pageNo) => {
      return imgDomain + "/THUMBNAIL/" + documentId + "/1200X1200/"  + pageNo;
    }
  }
);
