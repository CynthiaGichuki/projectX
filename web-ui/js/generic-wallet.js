let web3;

if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
} else if (typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

const initialAddresses = [
    {
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    },
    {
        address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
        privateKey: '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'
    },
    {
        address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        privateKey: '0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0'
    },
    {
        address: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
        privateKey: '0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd'
    },
    {
        address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
        privateKey: '0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0'
    },
    {
        address: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
        privateKey: '0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61'
    }
    // Add more addresses as needed
];

function loadInitialAddresses() {
    /*const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    if (addresses.length === 0) {
        localStorage.setItem('addresses', JSON.stringify(initialAddresses));
    }*/
    localStorage.setItem('addresses', JSON.stringify(initialAddresses));
}

function getAddresses() {
    return JSON.parse(localStorage.getItem('addresses')) || [];
}

async function getBalance(address) {
    try {
        const balance = await web3.eth.getBalance(address);
        const etherBalance = web3.utils.fromWei(balance, 'ether');
        return etherBalance;
    } catch (error) {
        console.error('Error fetching balance:', error);
        throw new Error('Error fetching balance:', error);
    }
}

async function transferETH(fromIndex, toAddress, amount) { 
    const addresses = getAddresses();
    const fromAddressObj = addresses[fromIndex];
    const privateKey = fromAddressObj.privateKey;

    try {
        const nonce = await web3.eth.getTransactionCount(fromAddressObj.address);
        const tx = {
            from: fromAddressObj.address,
            to: toAddress,
            value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
            gas: 21000,
            nonce: nonce
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        
        alert('Transaction successful: ' + receipt.transactionHash);
    } catch (error) {
        console.error('Error transferring ether:', error);
        alert('Error transferring ether: ' + error.message);
    }
}

async function callContractMethod(contractAddress, abi, method, params) {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    const contract = new web3.eth.Contract(abi, contractAddress);
    
    //console.log("Call :", contractAddress, "ABI: ", abi, "Method:", method,"Param:", params);
    return await contract.methods[method](...params).call();
}

async function sendTransaction(contractAddress, abi, method, params, fromAddress) {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    const contract = new web3.eth.Contract(abi, contractAddress);

    const addresses = getAddresses();
    const address = addresses.find(address => address.address === fromAddress);
    if (!address) throw new Error('Address not found');

    const data = contract.methods[method](...params).encodeABI();
    const tx = {
        from: fromAddress,
        to: contractAddress,
        data,
        gas: 2000000
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, address.privateKey);
    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

// Load initial addresses on startup
loadInitialAddresses();
