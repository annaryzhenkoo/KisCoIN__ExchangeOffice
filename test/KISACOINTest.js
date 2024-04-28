const {expect} = require('chai')
const web3 = require("web3");

describe("KISACOIN contract", function () {
    it("KISACOIN variables should have correct initial values!",
        async function () {
            const contractKisaCoin = await ethers.deployContract("KISACOIN");
            const currencyBuyKISACoin = await contractKisaCoin.readCurrencyBuyKISACOIN();
            const currencySellKISACOIN = await contractKisaCoin.readCurrencySellKISACOIN();
            const KISACOINBalances = await contractKisaCoin.amountKISACOINTBALANCE();

            expect(await currencyBuyKISACoin).to.equal(10)
            expect(await currencySellKISACOIN).to.equal(9)
            expect(await KISACOINBalances).to.equal(333)
        })
    it ("Only owner can change the KISACOIN balances!",
        async function() {
            const [owner, otherUser] = await ethers.getSigners();
            const contractKisaCoin = await ethers.deployContract("KISACOIN");
            const amountKisaCoins = 1000;

            await contractKisaCoin.refill(amountKisaCoins, {from: owner});
            expect(await contractKisaCoin.amountKISACOINTBALANCE()).to.equal(1333);
            await expect(contractKisaCoin.connect(otherUser).refill(amountKisaCoins)).to.be.revertedWith('Only the owner can refill.');
        }
    )
    it ("Buying KISACOINs should increase user's wallet!",
        async function() {
            const [owner] = await ethers.getSigners();
            const contractKisaCoin = await ethers.deployContract("KISACOIN");

            const amount = web3.utils.toWei("61", "ether");
            const options = { value: amount}
            await contractKisaCoin.buyKISACOIN(options);
            expect(await contractKisaCoin.amountofYourKISACOINTBALANCE()).to.equal(6);
        })
    it ("Selling KISACOINs should decrease user's wallet!", async function() {
        const [owner] = await ethers.getSigners();
        const contractKisaCoin = await ethers.deployContract("KISACOIN");

        const amount = web3.utils.toWei("101", "ether");
        const options = { value: amount}
        await contractKisaCoin.buyKISACOIN(options);
        await contractKisaCoin.sellKISACOIN(4)
        expect(await contractKisaCoin.amountofYourKISACOINTBALANCE()).to.equal(6);
    })
    it ("Only owner can know KISACOINs balance!", async function(){
        const [owner, otherUser] = await ethers.getSigners();
        const contractKisaCoin = await ethers.deployContract("KISACOIN");

        expect(await contractKisaCoin.amountKISACOINTBALANCE()).to.equal(333);
        await expect(contractKisaCoin.connect(otherUser).amountKISACOINTBALANCE()).to.be.revertedWith('Only owner can know KISACOINs amount on smart contract!');
    })
    it ("User must buy at least 3 KISACOINs!", async function(){
        const [owner] = await ethers.getSigners();
        const contractKisaCoin = await ethers.deployContract("KISACOIN");

        const amount = web3.utils.toWei("9", "ether");
        const options = { value: amount}
        await expect(contractKisaCoin.buyKISACOIN(options)).to.be.revertedWith('You must buy at least 3 KISACOIN!');
    })
    it ("User can't buy KISACOINs if it is not enough KISACOINs in smart contract!", async function(){
        const [owner] = await ethers.getSigners();
        const contractKisaCoin = await ethers.deployContract("KISACOIN");

        await contractKisaCoin.refill(5, {from: owner});
        const amount = web3.utils.toWei("9000", "ether");
        const options = { value: amount}
        await expect(contractKisaCoin.buyKISACOIN(options)).to.be.revertedWith('Not enough KISACOINs in stock to complete this purchase');
    })
    it ("User must sell at least 3 KISACOINs!", async function(){
        const [owner] = await ethers.getSigners();
        const contractKisaCoin = await ethers.deployContract("KISACOIN");

        const amount = web3.utils.toWei("61", "ether");
        const options = { value: amount}
        await contractKisaCoin.buyKISACOIN(options);
        await expect(contractKisaCoin.sellKISACOIN(2)).to.be.revertedWith('Minimum value per transaction is 3 KISACOINs!');
    })
    it ("User can't sell KISACOINs if it is not enough KISACOINs in user's wallet!", async function(){
        const [owner] = await ethers.getSigners();
        const contractKisaCoin = await ethers.deployContract("KISACOIN");

        const amount = web3.utils.toWei("61", "ether");
        const options = { value: amount}
        await contractKisaCoin.buyKISACOIN(options);
        await expect(contractKisaCoin.sellKISACOIN(8)).to.be.revertedWith('Not enough KISACOINs to sell');
    })
    it ("Only owner of smart contract can withdraw!", async function(){
        const [owner, otherUser] = await ethers.getSigners();
        const contractKisaCoin = await ethers.deployContract("KISACOIN");

        await expect(contractKisaCoin.connect(otherUser).withdrawAll()).to.be.revertedWith('Only owner can perform this operation!');
    })
})
