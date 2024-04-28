const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("KISACOIN", (m) => {
    const lock = m.contract("KISACOIN");

    return { lock };
});