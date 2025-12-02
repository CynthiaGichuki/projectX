const issuerUrl = 'http://localhost:9001/issue-credential';
const verifierUrl = 'http://localhost:9002/verify-credential';

document.getElementById('issue-credential').addEventListener('click', async () => {
    const registry = document.getElementById('registry').value;
    const issuer = document.getElementById('issuer').value;
    const did = document.getElementById('did').value;
    const name = document.getElementById('name').value;
    const course = document.getElementById('course').value;

    if (!registry || !issuer || !did || !name || !course) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(issuerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                registry: registry,
                issuer: issuer,
                did: did,
                credential: { type: 'StudentID', name, course }
            })
        });

        const credential = await response.json();
        storeCredential(credential);
        addCredentialToSelect(credential);
    } catch (error) {
        console.error('Error issuing credential:', error);
        alert('Error issuing credential');
    }
});

function storeCredential(credential) {
    const storedCredentials = JSON.parse(localStorage.getItem('credentials')) || [];
    storedCredentials.push(credential);
    localStorage.setItem('credentials', JSON.stringify(storedCredentials));
}

function addCredentialToSelect(credential) {
    const option = document.createElement('option');
    option.value = JSON.stringify(credential);
    option.text = `${credential.issuedTo} - ${credential.issuedAt}`;
    document.getElementById('credential-select').appendChild(option);
}

document.getElementById('credential-select').addEventListener('change', (event) => {
    const selectedCredential = JSON.parse(event.target.value);
    document.getElementById('verify-did').value = selectedCredential.issuedTo;
    document.getElementById('verify-name').value = selectedCredential.name;
    document.getElementById('verify-course').value = selectedCredential.course;
    document.getElementById('verify-issuedAt').value = selectedCredential.issuedAt;
    document.getElementById('verify-registry').value = selectedCredential.registry;
});

document.getElementById('verify-credential').addEventListener('click', async () => {
    const did = document.getElementById('verify-did').value;
    const name = document.getElementById('verify-name').value;
    const course = document.getElementById('verify-course').value;
    const issuedAt = document.getElementById('verify-issuedAt').value;
    const storedCredentials = JSON.parse(localStorage.getItem('credentials')) || [];
    const selectedCredential = storedCredentials.find(c => c.issuedTo === did && c.issuedAt === issuedAt);

    if (!selectedCredential) {
        alert('Credential not found');
        return;
    }

    selectedCredential.name = name;
    selectedCredential.course = course;

    try {
        const response = await fetch(verifierUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ credential: selectedCredential })
        });

        const result = await response.json();
        document.getElementById('verification-result').textContent = result.valid ? 'Credential is valid' : 'Credential is invalid';
    } catch (error) {
        console.error('Error verifying credential:', error);
        alert('Error verifying credential');
    }
});

// Load stored credentials on page load
window.onload = () => {
    const storedCredentials = JSON.parse(localStorage.getItem('credentials')) || [];
    storedCredentials.forEach(addCredentialToSelect);
};
