import Web3 from 'web3';
import contract from 'truffle-contract';
//var artifacts_path = '../../build/contracts/';
import Receipt_artifacts from './build/contracts/ReceiptSystem.json';

//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var web3;

function web3versionFix(abstract) {
	//Fix truffle compatibility issue with web3 v1.0.0
	if (typeof abstract.currentProvider.sendAsync !== "function") {
			console.log("Fixing");
		  abstract.currentProvider.sendAsync = function() {
		    return abstract.currentProvider.send.apply(
		      abstract.currentProvider, arguments
		    );
		};
	}
}

class Controller {
	constructor() {
		this.ReceiptSystem = contract(Receipt_artifacts);
	}

	initialize(_web3) { //Initialize the global web3 object
		web3 = _web3;
		this.ReceiptSystem.setProvider(web3.currentProvider);
		web3versionFix(this.ReceiptSystem);
		web3.eth.getAccounts()
			.then( accounts => {
				this.account = accounts[0];
				console.log("Account: ", this.account);
				return this.account;
			})
			.then( acc => {
				this.deployReceiptSystem();
			});
	}

	async deployReceiptSystem() {
		try {
			//this.coinbase = await web3.eth.getCoinbase();
			console.log("Deploying Receipt System...");
			var instance = await this.ReceiptSystem.new(
				{from: this.account, gas: 4000000});
			console.log("Receipt system deployed at: ", instance.address);
			this.ReceiptSystemAddress = instance.address;
	        return instance.address;
		} catch(e) {
			throw e;
		}
	}

}

var controller = new Controller();

export default controller;