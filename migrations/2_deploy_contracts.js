const bus_safe = artifacts.require("bus_safe");

module.exports = function (deployer) {
  deployer.deploy(bus_safe);
};