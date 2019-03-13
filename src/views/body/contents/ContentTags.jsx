import React from "react";
import { Link, NavLink } from "react-router-dom";
import Common from "../../../common/Common";
import AutoSuggestInput from "../../../components/common/AutoSuggestInput";

class ContentTags extends React.Component {
  state = {
    selectedTag: null
  };

  onSuggestionSelected = (tag) => {
    this.setState({selectedTag : tag._id});
  };

  render() {
    const { tagList, path } = this.props;
    return (

      <div className="u__left d-none d-lg-block">
        <div className="tags_menu_search_container">
          <div className="tags_menu_search_wrapper">
            <AutoSuggestInput dataList={tagList} search={this.onSuggestionSelected} type={"tag"}/>
            <Link to={path + "/" + (this.state.selectedTag ? this.state.selectedTag : "")}><div className="search-btn"><i className="material-icons">search</i></div></Link>
          </div>

        </div>
        <ul className="tags_menu">
          <li className="tags_menu_all_tags">
            <NavLink exact to={path + "/"} activeClassName="on" onClick={Common.scrollTop}>All Tags</NavLink>
          </li>
          {tagList.length > 0 && tagList.map((rst, idx) => {
            return (
              <li key={idx}>
                <NavLink to={path + "/" + rst._id} activeClassName="on"
                         onClick={Common.scrollTop}>{rst._id}</NavLink>
              </li>
            );
          })
          }
        </ul>
      </div>

    );
  }
}

export default ContentTags;
