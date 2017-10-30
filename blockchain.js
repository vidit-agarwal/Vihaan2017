var http = require('http');
var mysql = require('mysql') ;
var url = require('url')
var con= mysql.createConnection({
        host: 'localhost' ,
        user : 'root',
        password : '',
        database : 'blood_block'
});

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


http.createServer(function (req, res) {
    
    
    res.writeHead(200, {'Content-Type': 'text/plain'});

		

		

	
        var sql = "INSERT INTO block(id , timestamp,location,prev_location,donor,recipient, blood_group, prev_hash , hash) VALUES ('1', '10/10/2017', 'LAJPAT NAGAR', 'OKHLA', 'Mr. Akshay Sharma', 'Ms. Sanjini Gupta', 'B+' ,'000829183012863','0003724612926')" ;
        con.query(sql, function(err, result){
            if(err) throw err;
            console.log('Success') ;
        }) ;

		res.end("MINING BLOCKS... \n") ;

		console.log(JSON.stringify(myBlockChain, null,3)) ;


}).listen(8081, '192.168.43.132');
http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var requrl = url.parse(req.url,true).query;
    console.log(requrl);
    var donor = requrl.donor_name;
    var blood_group = requrl.blood_group;
    var cur_location = requrl.location;
    var str = "Donor =" + donor + " Blood Group =" + blood_group + " location =" + cur_location;
   
    var time = new Date().toISOString().replace(/T/,' ').replace(/\..+/,'') ;
    
    
    myBlockChain.addBlock(new Block(myBlockChain.chain[myBlockChain.chain.length -1].index+1, time, cur_location, '', donor, '', blood_group )) ;
    
    var myBlock = new Block(myBlockChain.chain[myBlockChain.chain.length -1].index+1 , time , cur_location,'',donor,'',blood_group,'');
    
    
    
    var sql = "INSERT INTO block(id , timestamp , location , prev_location , donor, recipient, blood_group, prev_hash , hash) VALUES ("+(myBlockChain.chain[myBlockChain.chain.length -1].index);
    sql = sql + ",'" +time+"','";
    sql = sql + cur_location + "','";
    sql = sql + "','"+ donor;
    sql = sql + "','','";
    sql = sql + blood_group + "','','";
    sql = sql + myBlock.calculateHash() + "')" ;
      res.write(sql) ;
        con.query(sql, function(err, result){
            if(err) throw err;
            console.log('Success') ;
        }) ;
    
    console.log("\n") ;
    console.log("Block Mined : ") ;
    console.log(JSON.stringify(myBlockChain, null, myBlockChain.chain[myBlockChain.chain.length])) ;
    console.log("\n") ;
    res.write(str);
    res.end();
    
}).listen(8084,'192.168.43.132')  ;

/*http.createServer(function(req, res){
    
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var requrl = url.parse(req.url,true).query;
    
    console.log(requrl);
    
    var donor = requrl.donor_name;
    var blood_group = requrl.blood_group;
    var cur_location = requrl.location;
    var str = "Donor =" + donor + " Blood Group =" + blood_group + " location =" + cur_location;
   
    var time = new Date().toISOString().replace(/T/,' ').replace(/\..+/,'') ;
    
    
    myBlockChain.addBlock(new Block(myBlockChain.chain[myBlockChain.chain.length -1].index+1, time, cur_location, '', donor, '', blood_group )) ;
    
    var myBlock = new Block(myBlockChain.chain[myBlockChain.chain.length -1].index+1 , time , cur_location,'',donor,'',blood_group,'');
    
    
    
    var sql = "INSERT INTO block(id , timestamp , location , prev_location , donor, recipient, blood_group, prev_hash , hash) VALUES ("+(myBlockChain.chain[myBlockChain.chain.length -1].index);
    sql = sql + ",'" +time+"','";
    sql = sql + cur_location + "','";
    sql = sql + "','"+ donor;
    sql = sql + "','','";
    sql = sql + blood_group + "','','";
    sql = sql + myBlock.calculateHash() + "')" ;
      res.write(sql) ;
        con.query(sql, function(err, result){
            if(err) throw err;
            console.log('Success') ;
        }) ;
    
    console.log("\n") ;
    console.log("Block Mined : ") ;
    console.log(JSON.stringify(myBlockChain, null, myBlockChain.chain[myBlockChain.chain.length])) ;
    console.log("\n") ;
    res.write(str);
    res.end();
    
}).listen(8085,'192.168.137.1')  ;*/

console.log('Server running at http://192.168.137.1:8081/');








































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
