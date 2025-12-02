document.addEventListener('DOMContentLoaded', (event) => {
    loadCredentials();
});

function loadCredentials() {
    const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
    const credentialSelect = document.getElementById('credential-select');
    credentialSelect.innerHTML = '';

    credentials.forEach((credential, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = `${credential.content.name} - ${credential.issuedTo}`;
        credentialSelect.add(option);
    });

    credentialSelect.addEventListener('change', (event) => {
        const selectedIndex = event.target.value;
        const credential = credentials[selectedIndex];
        document.getElementById('view-did').value = credential.issuedTo;
        document.getElementById('view-name').value = credential.content.name;
        document.getElementById('view-course').value = credential.content.course;
        document.getElementById('view-issuedAt').value = credential.issuedAt;
        document.getElementById('view-registry').value = credential.registry;

    });
}

function deleteCredential() {
    const credentialSelect = document.getElementById('credential-select');
    const selectedIndex = credentialSelect.value;
    if (selectedIndex === '') return;

    let credentials = JSON.parse(localStorage.getItem('credentials')) || [];
    credentials.splice(selectedIndex, 1);
    localStorage.setItem('credentials', JSON.stringify(credentials));

    loadCredentials();
    clearCredentialDetails();
}

function deleteCredentialAndDid() {
    const credentialSelect = document.getElementById('credential-select');
    const selectedIndex = credentialSelect.value;
    if (selectedIndex === '') return;

    let credentials = JSON.parse(localStorage.getItem('credentials')) || [];
    const credential = credentials[selectedIndex];

    if (credential) {
        if (credential.registry == "db") {
            fetch(`http://localhost:9003/dids/db/${credential.issuedTo}`, {
            method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    credentials.splice(selectedIndex, 1);
                    localStorage.setItem('credentials', JSON.stringify(credentials));
                    loadCredentials();
                    clearCredentialDetails();
                    alert('Credential and DID deleted successfully');
                } else {
                    alert('Error deleting DID from registry');
                }
            })
            .catch(error => {
                console.error('Error deleting DID:', error);
                alert('Error deleting DID from registry');
            });
        }
        else if (credential.registry == "blockchain") {
            fetch(`http://localhost:9003/dids/blockchain/${credential.issuedTo}`, {
            method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    credentials.splice(selectedIndex, 1);
                    localStorage.setItem('credentials', JSON.stringify(credentials));
                    loadCredentials();
                    clearCredentialDetails();
                    alert('Credential and DID deleted successfully');
                } else {
                    alert('Error deleting DID from registry');
                }
            })
            .catch(error => {
                console.error('Error deleting DID:', error);
                alert('Error deleting DID from registry');
            });
        }
        else {
            alert('Registry does not exist!');
        }
    }
}

function clearCredentialDetails() {
    document.getElementById('view-did').value = '';
    document.getElementById('view-name').value = '';
    document.getElementById('view-course').value = '';
    document.getElementById('view-issuedAt').value = '';
    document.getElementById('view-registry').value = '';
}

document.getElementById('delete-credential').addEventListener('click', deleteCredential);
document.getElementById('delete-credential-did').addEventListener('click', deleteCredentialAndDid);
