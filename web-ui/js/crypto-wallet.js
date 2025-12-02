

document.addEventListener('DOMContentLoaded', (event) => {
    loadInitialAddresses();
    loadAddresses();
    loadContracts();
});


function loadAddresses() {
    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    const addressSelect = document.getElementById('address-select');
    const transferFromSelect = document.getElementById('transfer-from');
    addressSelect.innerHTML = '';
    transferFromSelect.innerHTML = '';

    addresses.forEach((addressObj, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = addressObj.address;
        addressSelect.add(option);

        const transferOption = document.createElement('option');
        transferOption.value = index;
        transferOption.text = addressObj.address;
        transferFromSelect.add(transferOption);
    });

    addressSelect.addEventListener('change', (event) => {
        const selectedIndex = event.target.value;
        const addressObj = addresses[selectedIndex];
        document.getElementById('view-address').value = addressObj.address;
        document.getElementById('view-privateKey').value = addressObj.privateKey;
        displayBalance();
    });

    // Select the last used address if it exists
    const lastUsedAddressIndex = localStorage.getItem('lastUsedAddressIndex');
    if (lastUsedAddressIndex !== null && addresses.length > 0) {
        addressSelect.value = lastUsedAddressIndex;
        const event = new Event('change');
        addressSelect.dispatchEvent(event);
    } else {
        displayBalance();
    }
}

function deleteAddress() {
    const addressSelect = document.getElementById('address-select');
    const selectedIndex = addressSelect.value;
    if (selectedIndex === '') return;

    let addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    addresses.splice(selectedIndex, 1);
    localStorage.setItem('addresses', JSON.stringify(addresses));

    loadAddresses();
    clearAddressDetails();
}

function clearAddressDetails() {
    document.getElementById('view-address').value = '';
    document.getElementById('view-privateKey').value = '';
}

async function displayBalance() {
    const addressSelect = document.getElementById('address-select');
    const selectedIndex = addressSelect.value;

    if (selectedIndex === '') {
        document.getElementById('view-balance').value = '';
        return;
    }

    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    const addressObj = addresses[selectedIndex];
    const address = addressObj.address;

    try {
        const etherBalance = await getBalance(address);
        document.getElementById('view-balance').value = etherBalance + ' ETH';
    } catch (error) {
        console.error('Error fetching balance:', error);
        document.getElementById('view-balance').value = 'Error';
    }
}



async function transferEther() {
    const fromSelect = document.getElementById('transfer-from');
    const toInput = document.getElementById('transfer-to');
    const amountInput = document.getElementById('transfer-amount');

    const fromIndex = fromSelect.value;
    const toAddress = toInput.value;
    const amount = amountInput.value;

    if (fromIndex === '' || toAddress === '' || amount === '') {
        alert('Please fill in all fields');
        return;
    }

    transferETH(fromIndex, toAddress, amount);
}



