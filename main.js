const SHA256 = require('crypto-js/sha256') ;
class Block{
	constructor(index , timestamp, data , previousHash=''){
			this.index = index ;
			this.timestamp= timestamp ;
			this.data =data ;
			this.previousHash=previousHash;
			
			this.hash= this.calculateHash() ;
			this.nonce =0 ;

	}

	calculateHash(){
		return SHA256(this.index + this.previousHash + this.timestamp+ JSON.stringify(this.data) + this.nonce).toString();
	}

	mineBlock(difficulty){
		while(this.hash.substring(0 , difficulty) !== Array(difficulty + 1).join("0")){
			this.nonce++;
			this.hash = this.calculateHash() ;

		}
		console.log("Block Mined : " + this.hash) ;
	}
}

class Blockchain{
	constructor(){
		this.chain=[this.createGenesisBlock()] ;
		this.difficulty = 4;




	}

	createGenesisBlock(){
		return new Block(0 , "01/01/2017" , "GenesisBlock", "0") ;

	}

	getLatestBlock(){
		return this.chain[this.chain.length -1] ;
	}

	addBlock(newBlock){
		newBlock.previousHash= this.getLatestBlock().hash ;
		//newBlock.hash = newBlock.calculateHash() ;
		newBlock.mineBlock(this.difficulty) ;
		this.chain.push(newBlock) ;

	}

	isChainValid(){
		for(let i=1 ; i< this.chain.length ; i++){
			const currentBlock = this.chain[i] ;
			const previousBlock = this.chain[i-1] ;
			if(currentBlock.has !== currentBlock.calculateHash()){
				return false ;
			}
			if(currentBlock.previousHash!== previousBlock.hash){
				return false ;
			}

		}
		return true ;
	}

}

let myBlockChain = new Blockchain() ;

console.log('MINING BLOCK 1...') ;

myBlockChain.addBlock(new Block(1, "10/10/2017", {amount:4})) ;

console.log('MINING BLOCK 2...') ;

myBlockChain.addBlock(new Block(2, "14/10/2017", {amount:40})) ;

console.log('MINING BLOCK 3... ')
myBlockChain.addBlock(new Block(3, "10/10/2017", {amount:10})) ;



/*
//lets modift block 1 data

myBlockChain.chain[1].data={amount : 400} ;

// recalulate hash to make it a valid chain

myBlockChain.chain[1].hash = myBlockChain.chain[1].calculateHash() ; // still it will give false  becausr the ra;tionship with the previous  block is broken .
// this  mean that block chain are meant to add blocks to it but never delete a block or modify the block again . If we detech a block is change or something wrong has happened with the chain , it will have a mechanism to roll back the block chain to its previous state ,
// now again checking it >>
console.log("Is my chain valid ? " + myBlockChain.isChainValid()) ;

//console.log(JSON.stringify(myBlockChain, null,4)) ;

*/

console.log(JSON.stringify(myBlockChain, null,3)) ;
