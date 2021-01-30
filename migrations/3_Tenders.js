var TendersApp = artifacts.require("./TendersApp.sol");

module.exports = function(deployer) {
  deployer.deploy(TendersApp);
};
