

 const SHA256    =    require("crypto-js/sha256");
 const hex2ascii = require("hex2ascii");
 class Block{
         constructor(data){
           this.hash = null;                                           
           this.height = null;
           this.body =Buffer.from(JSON.stringify(data)).toString('hex') ;
           this.time = 0;
           this.previousBlockHash = null;                                                                                                                                                                                                                     
     }
     validate(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
               let self = this;
               return new Promise((resolve, reject) => {
                try {
                const currentHash = self.hash;
                self.hash = null;
                const newHash = SHA256(JSON.stringify(self)).toString();
                self.hash = currentHash;
                resolve(currentHash  === newHash);
                } catch ( error) {
                reject(new Error(err));
                }
         
        });
     }

     getBData() { 
        let self = this;
        return new Promise( async ( resolve,reject) => {
            let enc_data = this.body;
            let dec_data = hex2ascii(enc_data);
            let decdata_in_JSON = JSON.parse(dec_data);
            if ( this.height ==0) {
                resolve("This is the Genesis block ");

            } else {
                resolve(decdata_in_JSON);
            }

        });
     }
}
 module.exports.Block = Block; 
