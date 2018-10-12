pragma solidity ^0.4.24;

import "./Deck.sol";
import "./Utility.sol";
import "./AuthorPool.sol";
import "./CuratorPool.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract DocumentReg is Ownable{

  event _InitializeDocumentReg(uint timestamp, address token);
  event _RegisterNewDocument(bytes32 docId, uint timestamp, address applicant, uint count);
  event _ConfirmPageView(bytes32 docId, uint timestamp, uint pageView);
  event _ConfirmTotalPageView(uint timestamp, uint pageView, uint pageViewSquare);
  //event _DetermineReward(bytes32 indexed docId, uint timestamp, uint pageView, uint totalPageView, uint dailyReward);

  struct Document {
    address author;
    uint createTime;
    mapping (uint => uint) pageViews; // date => page views
  }

  // maps document id to associated document data
  mapping (bytes32 => Document) internal map;

  // key list for iteration
  bytes32[] private docList;

  // store total page view square for reward calculation
  //  : timestamp(yyyy-mm-dd) => daily total page view square
  mapping (uint => uint) private totalPageView;
  mapping (uint => uint) private totalPageViewSquare;

  // private variables
  Deck private token;
  Utility private util;
  AuthorPool private authorPool;
  CuratorPool private curatorPool;

  // public variables
  uint public createTime;

  function init(address _token, address _author, address _curator, address _utility) public {

    require(_token != 0 && address(token) == 0);
    require(_author != 0 && address(authorPool) == 0);
    require(_curator != 0 && address(curatorPool) == 0);
    require(_utility != 0 && address(util) == 0);

    token = Deck(_token);
    util = Utility(_utility);

    // init author pool
    authorPool = AuthorPool(_author);
    authorPool.init(token, util);

    // init curator pool
    curatorPool = CuratorPool(_curator);
    curatorPool.init(token, util);

    createTime = util.getTimeMillis();
    emit _InitializeDocumentReg(createTime, _token);
  }

  // -------------------------------
  // Document Registry Functions
  // -------------------------------

  // register a new document
  function register(bytes32 _docId) public {

    require(map[_docId].createTime == 0); // register once

    uint tMillis = util.getDateMillis();

    // adding to document registry
    map[_docId] = Document(msg.sender, tMillis);
    uint index = docList.push(_docId);

    // creating user document mapping
    authorPool.registerUserDocument(_docId, msg.sender);
    assert(authorPool.containsUserDocument(msg.sender, _docId));

    emit _RegisterNewDocument(_docId, tMillis, msg.sender, index);
  }

  function contains(bytes32 _docId) public view returns (bool) {
    return map[_docId].createTime != 0;
  }

  function getAuthorByKey(bytes32 _docId) public view returns (address) {
    require(map[_docId].createTime != 0);
    return map[_docId].author;
  }

  function getCreateTimeByKey(bytes32 _docId) public view returns (uint) {
    require(map[_docId].createTime != 0);
    return map[_docId].createTime;
  }

  function count() public view returns (uint) {
    return uint(docList.length);
  }

  // document list for iteration
  function getDocuments() public view returns (bytes32[]) {
    return docList;
  }

  // -------------------------------
  // Total Page View Square Functions
  // -------------------------------

  function confirmTotalPageView(uint _date, uint _totalPageView, uint _totalPageViewSquare) public
    onlyOwner()
  {
    require(_date != 0);
    require(_totalPageView != 0);
    require(_totalPageViewSquare != 0);
    totalPageView[_date] = _totalPageView;
    totalPageViewSquare[_date] = _totalPageViewSquare;
    emit _ConfirmTotalPageView(_date, _totalPageView, _totalPageViewSquare);
  }

  function getTotalPageView(uint _date) public view returns (uint) {
    require(_date != 0);
    return totalPageView[_date];
  }

  function getTotalPageViewSquare(uint _date) public view returns (uint) {
    require(_date != 0);
    return totalPageViewSquare[_date];
  }

  // -------------------------------
  // Daily Page View Functions
  // -------------------------------

  function confirmPageView(bytes32 _docId, uint _date, uint _pageView) public
    onlyOwner()
  {
    require(map[_docId].createTime != 0);
    Document storage doc = map[_docId];
    doc.pageViews[_date] = _pageView;
    emit _ConfirmPageView(_docId, _date, _pageView);
  }

  function getPageView(bytes32 _docId, uint _date) public view returns (uint) {
    require(map[_docId].createTime != 0);
    return map[_docId].pageViews[_date];
  }

  // -------------------------------
  // Determine reward after last claim
  // -------------------------------

  function determineDeco(address _addr, bytes32 _docId) public view returns (uint) {
    require(_addr != 0);
    require(authorPool.createTime() != 0);
    int idx = authorPool.getUserDocumentIndex(_addr, _docId);
    if (idx < 0) {
      return uint(0);
    }

    uint claimDate = authorPool.getUserDocumentLastClaimedDate(_addr, idx);
    uint dateMillis = util.getDateMillis();

    uint sumDeco = 0;
    while (claimDate < dateMillis) {
      if (claimDate == 0) {
        claimDate = authorPool.getUserDocumentListedDate(_addr, idx);
      }
      assert(claimDate <= dateMillis);

      uint tpv = getTotalPageView(claimDate);
      uint pv = getPageView(_docId, claimDate);
      sumDeco += authorPool.determineUserDocumentDeco(pv, tpv);

      uint nextDate = claimDate + util.getOneDayMillis();
      assert(claimDate < nextDate);
      claimDate = nextDate;

      //emit _DetermineReward(_docId, lastClaimedDate, pv, tpv, dailyRewardPool);
    }
    return sumDeco;
  }

}
