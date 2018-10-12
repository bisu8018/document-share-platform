const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const CuratorPool = artifacts.require("./CuratorPool.sol");

contract("CuratorPool", accounts => {

  it("adding a vote", async () => {
    // prepare
    const docId = "1234567890abcdefghijklmnopqrstuv";

    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const curatorPool = await CuratorPool.deployed();

    var _token = deck.address;
    var _utility = utility.address;

    await curatorPool.init(_token, _utility, { from: accounts[0] });

    // logic
    var reference = await curatorPool.getVoteCount(accounts[0]);
    await curatorPool.addVote(docId, 10, { from: accounts[0] });

    // assert
    var sample = await curatorPool.getVoteCount(accounts[0]);
    assert.equal((reference *= 1) + 1, (sample *= 1), "failed to add a vote");
  });

});
