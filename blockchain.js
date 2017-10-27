var http = require('http');

http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type': 'text/plain'});

		const SHA256 = require('crypto-js/sha256') ;
		class Block{
			constructor(index , timestamp, location , prevLocation , donor,recipient ,bloodGroup, previousHash=''){
					this.index = index ;
					this.timestamp= timestamp ;

					this.location= location ;
					this.prevLocation= prevLocation;
					this.donor= donor ;
					this.recipient = recipient ;
					this.bloodGroup= bloodGroup;

					this.previousHash=previousHash;
					this.hash= this.calculateHash() ;
					this.nonce =0 ;

			}

			calculateHash(){
				return SHA256(this.index + this.previousHash + this.timestamp+ JSON.stringify(this.location + this.prevLocation + this.donor + this.recipient + this.bloodGroup  ) + this.nonce).toString();
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
				return new Block(0 , "01/01/2017" , "-", "-" , "-" , "-", "-", "0") ;

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

		//res.end("Mining BLock 1...\n") ;

		myBlockChain.addBlock(new Block(1, "10/10/2017", "LAJPAT NAGAR", "OKHLA", "Mr. Akshay Sharma", "Ms. Sanjini Gupta", "B+"  )) ;

		//res.end("MINING BLOCK 2...\n") ;

		myBlockChain.addBlock(new Block(1, "10/10/2017", "GAGAN VIHAR", "LAJPAT NAGAR", "Mr. Rahul Sharma", "Ms. Sanjay Gupta", "O+"  )) ;

		//res.end("MINING BLOCK 3... \n")
		myBlockChain.addBlock(new Block(1, "10/10/2017", "SWASTHA VIHAR", "OKHLA", "Mr. Ajay Sharma", "Ms. Neha", "A-"  )) ;
		res.end("MINING BLOCK 3... \n") ;

		console.log(JSON.stringify(myBlockChain, null,3)) ;


}).listen(8081, '192.168.137.155');
console.log('Server running at http://192.168.137.155:80/');



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

//console.log(JSON.stringify(myBlockChain, null,3)) ;
