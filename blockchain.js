


 const SHA256 =  require('crypto-js/sha256');
 const BlockClass = require('./block.js');
 const bitcoinMessage = require('bitcoinjs-message');

 
 class Blockchain {
 
     constructor() {
         this.chain = [];
         this.height = -1;
         this.initializeChain();
     }
 
    
     async initializeChain() {
         if( this.height === -1){
             let block = new BlockClass.Block({data: 'Genesis Block'});
             await this._addBlock(block);
         }
     }
 
    
     getChainHeight() {
         return new Promise((resolve, reject) => {
             resolve(this.height);
         });
     }

    
     _addBlock(block) {
         let self = this;
         return new Promise(async (resolve, reject) => {
            block.height = self.chain.length;
            block.time = new Date().getTime().toString().slice(0,-3);
            block.height = self.chain.length;
            block.time   = new Date().getTime().toString().slice(0,-3);
            if(self.chain.length > 0){
                
                block.previousBlockHash = self.chain[self.chain.length-1].hash;
            }
            
            block.hash = SHA256(JSON.stringify(block)).toString();
            console.debug('validation of chain starts');
            
            let errors = await self.validateChain();
            console.log(errors);
            console.debug('validation of Chain ends');
            if ( errors.length === 0){
                self.chain.push(block);
                self.height++ ;
                resolve(block)
            
            
            }else{
                reject(errors);
            }
        });
    

            
         
     }
 
     requestMessageOwnershipVerification(address) {
         return new Promise((resolve) => {
            const OwnershipMessage  = `${address}:new Date().getTime().toString().slice(0,-3)}:starRegistry`;
                   resolve(OwnershipMessage  );

             
         });
    }
     submitStar(address, message, signature, star) {
         let self = this;
         return new Promise(async (resolve, reject) => {
            let temps = parseInt(message.split(':')[1]);
            let currentTime = parseInt(new Date().getTime().toString().slice(0,-3));
            
            if((currentTime - temps) <  ( 60*60)) {
            
                if(bitcoinMessage.verify(message,address,signature)){
                    let block = new BlockClass.Block({"owner": address,"star":star});
                    self._addBlock(block);
                    resolve(block);
                } else {
                    reject ( Error('Message is not verified'))
                    
                }

            } else {
                reject(Error('too much time has passed, stay below 60 minutes'))
            } 
           
       });
     }
 
     
     getBlockByHash(hash) {
         let self = this;
         return new Promise((resolve, reject) => {
            const block = self.chain.filter(block => block.hash ===hash);
        
            if ( typeof block !=  'undefined'){
                resolve(block);
            
            }else{
                reject(Error("No block with this hash"))
            }
        
    });
     }
 
     
    
     getBlockByHeight(height) {
         let self = this;
         return new Promise((resolve, reject) => {
             let block = self.chain.filter(p => p.height === height)[0];
             if(block){
                 resolve(block);
             } else {
                 resolve(null);
             }
         });
     }
 
     
     getStarsByWalletAddress (address) {
         let self = this;
         let stars = [];
         return new Promise((resolve, reject) => {
            self.chain.forEach(async(b) =>{
            let data = await b.getBData();
            if(data){
                if(data.owner === address){
                    stars.push(data);

                }

            }

         })
         resolve(stars);


             
        });
     }
 
     
     validateChain() {
         let self = this;
         let errorLog = [];
         return new Promise( (resolve) => {
            let validatePromises = [];
            self.chain.forEach((block,index) => {
                if (block.height  > 0){
                    const previousBlock = self.chain[index-1];
                    if (block.previousBlockHash !== previousBlock.hash){
                        const errorMessage  =  `Block ${index}previousBlockHash set  to ${ block.previousBlockHash},but actual previous block was {previousBlock.hash}`;
                        errorLog.push(errorMessage);
                    
                    }

                }
            validatePromises.push(block.validate());

             
         
        });

        Promise.all(validatePromises)
             .then(validatedBlocks  =>  {
                validatedBlocks.forEach((valid,index) => {
                    if(!valid){
                        const invalidBlock = self.chain[index];
                        const  errorMessage = `Block ${index}hash (${invalidBlock.hash})is invalid`;
                        errorLog.push(errorMessage);
                    }
                    
                });
                resolve(errorLog);
             });
         });
    }
}

module.exports.Blockchain = Blockchain;   
