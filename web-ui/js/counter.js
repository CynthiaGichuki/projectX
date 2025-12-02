const contractAddress = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1"; // Replace with the deployed contract address
const abi = [
	{
		"inputs": [],
		"name": "decrement",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "increment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

let selectedWallet = null;

// Show the popup to select wallet
function showWalletPopup() {
    const popup = document.getElementById('wallet-popup');
    popup.style.display = 'block';

    // Populate the wallet selection
    const walletSelect = document.getElementById('wallet-select');
    walletSelect.innerHTML = '';
    const wallets = getAddresses();
    wallets.forEach(wallet => {
        const option = document.createElement('option');
        option.value = wallet.address;
        option.textContent = wallet.address;
        walletSelect.appendChild(option);
    });
}

// Hide the popup
function hideWalletPopup() {
    const popup = document.getElementById('wallet-popup');
    popup.style.display = 'none';
}

// Get the selected wallet
function getSelectedWallet() {
    const walletSelect = document.getElementById('wallet-select');
    selectedWallet = walletSelect.value;
    hideWalletPopup();
}

// Update the count display
async function updateCount() {
    const countElement = document.getElementById('count');
    const count = await callContractMethod(contractAddress, abi, 'getCounter', []);
    countElement.textContent = count;
}

// Perform the transaction
async function performTransaction(method) {
    if (!selectedWallet) {
        showWalletPopup();
        document.getElementById('select-wallet').onclick = async () => {
            getSelectedWallet();
            await performTransaction(method);
        };
        return;
    }

    try {
        await sendTransaction(contractAddress, abi, method, [], selectedWallet);
        await updateCount();
    } catch (error) {
        console.error(`Error performing ${method}:`, error);
    }
}

// Perform the transaction
async function changeAddress() {
    showWalletPopup();
    document.getElementById('select-wallet').onclick = async () => {
        getSelectedWallet();
    };
    return;
}



document.getElementById('increment').onclick = () => performTransaction('increment');
document.getElementById('decrement').onclick = () => performTransaction('decrement');
document.getElementById('change_address').onclick = () => changeAddress();

window.onload = async () => {
    await updateCount();
};
