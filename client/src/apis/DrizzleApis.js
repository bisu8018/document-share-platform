// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";
import DocumentReg from "contracts-rinkeby/DocumentReg.json";
import Deck from "contracts-rinkeby/Deck.json";
// import drizzle functions and contract artifact
export default class DrizzleApis {

  callbackFuncs = [];

  // let drizzle know what contracts we want
  // let drizzle know what contracts we want
  options = { contracts: [DocumentReg, Deck] };
  // setup the drizzle store and drizzle
  drizzleStore = generateStore(this.options);
  drizzle = new Drizzle(this.options, this.drizzleStore);

  constructor(callback){


      this.unsubscribe = this.drizzle.store.subscribe(() => {

        // every time the store updates, grab the state from drizzle
        this.drizzleState = this.drizzle.store.getState();
        //console.log("DrizzleApis subscribe", this.drizzleState);
        // check to see if it's ready, if so, update local component state
        if(callback) callback(this, this.drizzle, this.drizzleState);

        if (this.drizzleState.drizzleStatus.initialized) {
          //console.log("DrizzleApis", "drizzleStatus initialized", this.drizzleState);
          //this.setState({ loading: false, this.drizzleState });

          for(const idx in this.callbackFuncs){
            const callbackFunc = this.callbackFuncs[idx];
            if(callbackFunc){
              callbackFunc(this.drizzle, this.drizzleState);
            }
          }
        }

      });

  }

  isInitialized = () => {
    if(!this.drizzleState) return;

    return this.drizzleState.drizzleStatus.initialized;
  }

  isAuthenticated = () => {

    if(!this.drizzle) return;

    //console.log(this.drizzleState);

    if(!this.drizzleState) return;

    if(this.drizzleState.accounts && this.drizzleState.accounts[0]) return this.isInitialized() && true;

    return false;
  }

  getLoggedInAccount = () => {
    if(!this.isAuthenticated()) return;

    return this.drizzleState.accounts[0];
  }

  fromAscii = (str) => {
    return this.drizzle.web3.utils.fromAscii(str);
  }

  fromWei = (str) => {
    return this.drizzle.web3.utils.fromWei(str, "ether");
  }

  toNumber = (str) => {
    return str*1;
  }

  toBigNumber = (str) => {
    const v = this.drizzle.web3.utils.toWei(str, 'ether');
    //console.log(str, "to bignumber ", v);
    return v;
  }

  requestIsExistDocument = (documentId) => {

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    const ethAccount = this.drizzleState.accounts[0]

    const contract = this.drizzle.contracts.DocumentReg;

    const dataKey = contract.methods["contains"].cacheCall(this.fromAscii(documentId), {
      from: ethAccount
    });
    console.log(dataKey);
    return dataKey;

  }

  isExistDocument = (dataKey) => {

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    if(this.drizzleState.contracts.DocumentReg.contains[dataKey]){
      const isExistInBlockChain = this.drizzleState.contracts.DocumentReg.contains[dataKey].value
      //this.setState({isExistInBlockChain});
      return isExistInBlockChain;
//      this.setState({isExistInBlockChain: isExistDocument});
    }
    return false;
  }



  approve = (deposit) => {


    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    if(deposit<=0){
      console.log("Deposit must be greater than zero.");
      return;
    }

    const ethAccount = this.drizzleState.accounts[0];

    const DocumentReg = this.drizzle.contracts.DocumentReg;

    if(!DocumentReg){
      console.error("DocumentReg Contract is invaild");
      return;
    }

    const bigNumberDeposit = this.toBigNumber(deposit);
    const stackId = this.drizzle.contracts.Deck.methods["approve"].cacheSend(DocumentReg.address, bigNumberDeposit, {
      from: ethAccount
    });

    console.log("approve stackId", stackId);
    return stackId;
  };

  voteOnDocument = (documentId, deposit) => {

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }


    if(!documentId){
      alert("documentId is nothing");
      return;
    }

    if(deposit<=0){
      alert("Deposit must be greater than zero.");
      return;
    }

    const ethAccount = this.drizzleState.accounts[0];

    if(!ethAccount){
      alert("Metamast Account is invaild");
      return;
    }

    const contract = this.drizzle.contracts.DocumentReg;
    const bigNumberDeposit = this.toBigNumber(deposit);
    console.log("vote on document id", documentId, "deposit", deposit, bigNumberDeposit, "contract address", contract.address);
    const stackId = contract.methods["voteOnDocument"].cacheSend(this.fromAscii(documentId), bigNumberDeposit, {
      from: ethAccount
    });
    console.log("voteOnDocument stackId", stackId);
    // save the `stackId` for later reference
    return stackId;
  };

  determineAuthorToken = (documentId) => {

    const drizzle = this.drizzle;
    console.log("determineAuthorToken", documentId, drizzle);

    const drizzleState = drizzle.store.getState();
    if (!drizzleState.drizzleStatus.initialized) {
      console.error("drizzle state is not initialized!!!");
      return ;
    }
    const ethAccount = drizzleState.accounts[0];
    const contract = drizzle.contracts.DocumentReg;

    const dataKey = contract.methods["determineAuthorToken"].cacheCall(ethAccount, this.fromAscii(documentId), {
      from: ethAccount
    });

    return new Promise(function (resolve, reject) {
      // subscribe to changes in the store
      console.log("dataKey", dataKey);
      const unsubscribe = drizzle.store.subscribe(() => {
        // every time the store updates, grab the state from drizzle
        const drizzleState = drizzle.store.getState();
        // check to see if it's ready, if so, update local component state
        if(drizzleState.contracts.DocumentReg.determineAuthorToken[dataKey]){
          unsubscribe();
          const dataValue = drizzleState.contracts.DocumentReg.determineAuthorToken[dataKey].value
          console.log("subscribe determineAuthorToken", dataValue);
          return resolve(dataValue);
        }

      });
    });
  };

  registDocumentToSmartContract = (documentId) => {
    console.log(documentId, this.drizzle);
    if(!documentId){
      alert("documentId is nothing");
      return;
    }

    const drizzleState = this.drizzle.store.getState();
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;
    const stackId = contract.methods["register"].cacheSend(this.fromAscii(documentId), {
      from: ethAccount
    });
    console.log("registSmartContractAddress stackId", stackId);
    // save the `stackId` for later reference

    return stackId;
  };

  requestTotalBalance = () => {


    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }
    const ethAccount = this.drizzleState.accounts[0];
    const contract = this.drizzle.contracts.Deck;
    console.log("Metamask logged in account", ethAccount);
    const dataKey = contract.methods.balanceOf.cacheCall(ethAccount, {
      from: ethAccount
    });

    return dataKey;
  };

  getTotalBalance = (dataKey) => {
    if(!dataKey) return 0;
    const drizzleState = this.drizzle.store.getState();
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.Deck;

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    //console.log("getTotalBalance", drizzleState.contracts.Deck.balanceOf[dataKey]);

    if(!drizzleState.contracts.Deck.balanceOf[dataKey]) return 0;

    //const isExistInBlockChain = drizzleState.contracts.DocumentReg.contains[this.state.isExistDataKey].value
    //console.log("getTotalBalance", ethAccount, v);
    return this.fromWei(drizzleState.contracts.Deck.balanceOf[dataKey].value);
  };


  requestCalculateAuthorReward = (pageView, totalPageView) => {

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    const ethAccount = this.drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;

    const dataKey = contract.calculateAuthorReward.cacheCall(pageView, totalPageView, {
      from: ethAccount
    });

    return dataKey;
  };

  getCalculateAuthorReward = (dataKey) => {

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    const ethAccount = this.drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;
    const v = contract.methods.calculateAuthorReward[dataKey];

    //console.log("getTotalBalance", ethAccount, v);
    return this. v;
  };

  requestAuthor3DayRewardOnDocument = (documentId) => {
    //contract getAuthor3DayRewardOnDocument

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }


    const ethAccount = this.drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;
    const yesterday = (new Date()).getDate() - 1;
    const blockchainTimestamp = this.getBlockchainTimestamp(yesterday);

    const dataKey = contract.methods.getAuthor3DayRewardOnDocument.cacheCall(ethAccount, this.fromAscii(documentId), blockchainTimestamp, {
      from: ethAccount
    });

    return dataKey;
  }

  getAuthor3DayRewardOnDocument = (dataKey) => {
    //contract getAuthor3DayRewardOnDocument
    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    if(!dataKey) return 0;
    const drizzleState = this.drizzle.store.getState();
    const ethAccount = this.drizzleState.accounts[0];


    const v = this.drizzleState.contracts.DocumentReg.getAuthor3DayRewardOnDocument[dataKey];

    if(!v) return ;
    //console.log("getAuthor3DayRewardOnDocument", v);

    return v.value;
    //return v.value;
  }

  subscribe = (callback) => {
    this.callbackFuncs.push(callback);
    return callback;
  }

  unsubscribe = (callback) => {
    if(this.callbackFuncs.includes(callback)) {
      this.callbackFuncs.remove(callback);
    }
  }

  getBlockchainTimestamp = (date) => {
    // daily YYYY-MM-DD 00:00:00(실행기준에서 전날 일자)
    //let yesterday = new Date(); /* 현재 */
    //yesterday.setDate(yesterday.getDate() - 1);

    /* 날짜 - 1일 */

    const d = Math.floor(date / (60 * 60 *24 * 1000)) * (60 * 60 *24 * 1000);
    //console.log("getBlockchainTimestamp", d, new Date(d));
    return d;
  }

}
