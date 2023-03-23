import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import Web3 from "web3";
import {createAndLoginUser} from '../networking/user'


let web3auth;
const clientId = "BDzbYt1CVIUyalELrMFxpDJAEU9RAV3CY78Jm-uX8Ly9L7lNtcLqyWsE-ajhuVn_hqJMJ8zgKGhSHq1iVonTgH0";
 const init = async () => {
          try {   
             web3auth = new Web3Auth({
                clientId: clientId, // get it from Web3Auth Dashboard
              web3AuthNetwork: "cyan",
              chainConfig: {
                chainNamespace: "eip155",
                chainId: "Ox5",
                rpcTarget: "https://rpc.ankr.com/eth_goerli",
                displayName: "Goerli Testnet",
                blockExplorer: "https://goerli.etherscan.io",
                ticker: "ETH",
                tickerName: "Ethereum",
              },
             });
           console.log("--------------------------------------");
            await web3auth.initModal();
            if (web3auth.provider) {
            };
          } catch (error) {
            console.log(error.message);
          }
        };
  init();

   export const connectWallet = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return;
        }
         const provider = await web3auth.connect();
        // if provider is not null then user logged in successfully
        if(provider != null){
            console.log('User logged in successfully.');
         }
          const web3 = new Web3(provider);
          const userAccounts = await web3.eth.getAccounts();
          console.log(userAccounts);
          const user = await web3auth.getUserInfo();
          const address = userAccounts[0];
          user.address=address;
          return await createAndLoginUser(user).then(res => {           
            return res;
          })           
  }

  export const disconnnectWallet = async () => {   
    if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      try{
        await web3auth.logout();
      }catch(error){

      }
  }

  export const signTransaction = async () => {   
    if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
  
      const provider = await web3auth.connect();
      const web3 = new Web3(provider);

      const fromAddress = (await web3.eth.getAccounts())[0];
      const originalMessage = "By signing below, I acknowledge that I have read and understand the content of this agreement";
      return new Promise((resolve, reject) => {
        web3.eth.personal.sign(originalMessage, fromAddress).then(signedMessage => {
         resolve({status: true, message: "Message signed successfully", signedMessage: signedMessage}) 
      }).catch(error => {
        reject({status: false, message: error.message || "Could not sign the message."});
    });
    })  
  }

  
