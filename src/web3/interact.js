/*import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import Web3 from "web3";
import {createAndLoginUser} from '../networking/user'

const config = require('../config/config')[process.env.NODE_ENV || 'development'];

let web3auth;
const clientId = config.clientId;
 const init = async () => {
          try {   
             web3auth = new Web3Auth({
                // type uiConfig
               uiConfig: {
               appLogo: config.appLogo,
               theme: "dark",
               loginMethodsOrder: ["google", "facebook"],
               defaultLanguage: "en",
             },
               clientId,
               chainConfig: { // this is ethereum chain config, change if other chain(Solana, Polygon)
                   chainNamespace: CHAIN_NAMESPACES.EIP155,
                   chainId: config.chainId,
                   rpcTarget: config.rpcTarget,
               }
             });
    
            await web3auth.initModal();
            if (web3auth.provider) {
            };
          } catch (error) {
            console.error(error);
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
*/
  
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
//import RPC from "./web3RPC"; // for using web3.js
//import RPC from "./ethersRPC"; // for using ethers.js

// Plugins
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";

// Adapters

//import { WalletConnectV1Adapter } from "@web3auth/wallet-connect-v1-adapter";
import { WalletConnectV2Adapter, getWalletConnectV2Settings } from "@web3auth/wallet-connect-v2-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";
import Web3 from "web3";
import {createAndLoginUser} from '../networking/user'

const config = require('../config/config')[process.env.NODE_ENV || 'development'];

const clientId =config.clientId;// get from https://dashboard.web3auth.io
 let web3auth;
 let torusPlugin;
 let provider;


 const init = async () => {
  try {
       web3auth = new Web3Auth({
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: config.chainId,
        rpcTarget: config.rpcTarget, // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
      uiConfig: {
        theme: "dark",
        loginMethodsOrder: ["github", "google"],
        defaultLanguage: "en",
        appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
      },
      web3AuthNetwork: "cyan",
    });

    const openloginAdapter = new OpenloginAdapter({
      loginSettings: {
        mfaLevel: "default",
      },
      adapterSettings: {
        whiteLabel: {
          name: "Your app Name",
          logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
          logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
          defaultLanguage: "en",
          dark: true, // whether to enable dark mode. defaultValue: false
        },
      },
    });
    web3auth.configureAdapter(openloginAdapter);

    // plugins and adapters are optional and can be added as per your requirement
    // read more about plugins here: https://web3auth.io/docs/sdk/web/plugins/

    // adding torus wallet connector plugin

     torusPlugin = new TorusWalletConnectorPlugin({
      torusWalletOpts: {},
      walletInitOptions: {
        whiteLabel: {
          theme: { isDark: true, colors: { primary: "#00a8ff" } },
          logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
          logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
        },
        useWalletConnect: true,
        enableLogging: true,
      },
    });

    await web3auth.addPlugin(torusPlugin);

    // read more about adapters here: https://web3auth.io/docs/sdk/web/adapters/

    // adding wallet connect v1 adapter
    // const walletConnectV1Adapter = new WalletConnectV1Adapter({
    //   adapterSettings: {
    //     bridge: "https://bridge.walletconnect.org",
    //   },
    //   clientId,
    // });

    // web3auth.configureAdapter(walletConnectV1Adapter);

    // adding wallet connect v2 adapter
    const defaultWcSettings = await getWalletConnectV2Settings("eip155", [1, 137, 5], "04309ed1007e77d1f119b85205bb779d")
    const walletConnectV2Adapter = new WalletConnectV2Adapter({
      adapterSettings: { ...defaultWcSettings.adapterSettings },
      loginSettings: { ...defaultWcSettings.loginSettings },
    });

    web3auth.configureAdapter(walletConnectV2Adapter);

    // adding metamask adapter
    const metamaskAdapter = new MetamaskAdapter({
      clientId,
      sessionTime: 3600, // 1 hour in seconds
      web3AuthNetwork: "cyan",
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: config.chainId,
        rpcTarget: config.rpcTarget, // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
    });
    // we can change the above settings using this function
    metamaskAdapter.setAdapterSettings({
      sessionTime: 86400, // 1 day in seconds
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: config.chainId,
        rpcTarget: config.rpcTarget, // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
      web3AuthNetwork: "cyan",
    });

    // it will add/update  the metamask adapter in to web3auth class
    web3auth.configureAdapter(metamaskAdapter);

    const torusWalletAdapter = new TorusWalletAdapter({
      clientId,
    });

    // it will add/update  the torus-evm adapter in to web3auth class
    web3auth.configureAdapter(torusWalletAdapter);


    await web3auth.initModal();
    if (web3auth.provider) {
        provider = web3auth.provider
    }
  } catch (error) {
    console.error(error);
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
  };

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

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return null;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
    return user;
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
     provider = null;
  };

  const showWCM = async () => {
    if (!torusPlugin) {
      uiConsole("torus plugin not initialized yet");
      return;
    }
    torusPlugin.showWalletConnectScanner();
    uiConsole();
  };

  const initiateTopUp = async () => {
    if (!torusPlugin) {
      uiConsole("torus plugin not initialized yet");
      return;
    }
    torusPlugin.initiateTopup("moonpay", {
      selectedAddress: "0x8cFa648eBfD5736127BbaBd1d3cAe221B45AB9AF",
      selectedCurrency: "USD",
      fiatValue: 100,
      selectedCryptoCurrency: "ETH",
      chainNetwork: "mainnet",
    });
  };

  // const changeNetwork = async () => {
  //   if (!provider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const privateKey = await rpc.getPrivateKey();
  //   uiConsole(privateKey);
  // };

  function uiConsole(mess) {
    console.log(mess)
  }
