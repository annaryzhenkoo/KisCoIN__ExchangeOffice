// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract KISACOIN {
    //Default exchange rate: 1 KISACOIN vs 10 ETH
    address owner;
    uint public currencyBuyKISACOIN = 10;
    uint public currencySellKISACOIN = 9;
    mapping (address => uint) KISACOINBalances;

    constructor(){
        owner = msg.sender;
        KISACOINBalances[address(this)] = 333;
    }
    //Allow to the users get currencyBuyKISACOIN
    function readCurrencyBuyKISACOIN() public view returns(uint){
        return currencyBuyKISACOIN;
    }

    //Allow to the users get currencySellKISACOIN
    function readCurrencySellKISACOIN() public view returns(uint){
        return currencySellKISACOIN;
    }

    //Allow to the users get KISACOIN balance
    function amountKISACOINTBALANCE() public view returns(uint){
        require(msg.sender == owner, "Only owner can know KISACOINs amount on smart contract!");
        return KISACOINBalances[address(this)];
    }

    //Allow to the users get their KISACOIN balance
    function amountofYourKISACOINTBALANCE() public view returns(uint){
        return  KISACOINBalances[msg.sender];
    }

    //Allow the owner to increase the smart contract's KISACOIN balance
    function refill(uint amount) public {
        require(msg.sender == owner, "Only the owner can refill.");
        KISACOINBalances[address(this)] += amount;
    }

    //Allow to anyone buy KISACOINs
    function buyKISACOIN () public payable {
        uint amountOfKISACOINS = (msg.value) / (currencyBuyKISACOIN * 1 ether);
        require(amountOfKISACOINS >= 3, "You must buy at least 3 KISACOIN!");
        require(KISACOINBalances[address(this)] >= amountOfKISACOINS, "Not enough KISACOINs in stock to complete this purchase");

        KISACOINBalances[address(this)] -= amountOfKISACOINS;
        KISACOINBalances[msg.sender] += amountOfKISACOINS;
    }

    //Allow to anyone sell KISACOINs
    function sellKISACOIN(uint amountOfKISACOINS) public{
        require(amountOfKISACOINS >= 3, "Minimum value per transaction is 3 KISACOINs!");
        require(KISACOINBalances[msg.sender] >= amountOfKISACOINS, "Not enough KISACOINs to sell");
        require(address(this).balance >= amountOfKISACOINS * currencySellKISACOIN * 1 ether, "Not enough ETH");

        address payable _to = payable (msg.sender);
        _to.transfer(amountOfKISACOINS * currencySellKISACOIN * 1 ether);

        KISACOINBalances[msg.sender] -= amountOfKISACOINS;
        KISACOINBalances[address(this)] += amountOfKISACOINS;
    }

    //Allow to owner send ETH
    function withdrawAll() public{
        require(msg.sender == owner, "Only owner can perform this operation!");
        address payable _to = payable(owner);
        address _thisContract = address(this);
        _to.transfer(_thisContract.balance);
    }
}