const verifierUrl = 'http://localhost:9002/verify-credential';

function loadCredentials() {
    const storedCredentials = JSON.parse(localStorage.getItem('credentials')) || [];
    const select = document.getElementById('credential-select');
    select.innerHTML = '';
    storedCredentials.forEach(credential => {
        const option = document.createElement('option');
        option.value = JSON.stringify(credential);
        option.text = `${credential.content.name} - ${credential.issuedTo}`;
        select.appendChild(option);
    });
}

document.getElementById('credential-select').addEventListener('change', (event) => {
    const selectedCredential = JSON.parse(event.target.value);
    document.getElementById('verify-did').value = selectedCredential.issuedTo;
    document.getElementById('verify-name').value = selectedCredential.content.name;
    document.getElementById('verify-course').value = selectedCredential.content.course;
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

    selectedCredential.content.name = name;
    selectedCredential.content.course = course;

    try {
        const response = await fetch(verifierUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ credential: selectedCredential })
        });

        const result = await response.json();
        console.log("RESUTL", result.valid);
        document.getElementById('verification-result').textContent = result.valid ? 'Credential is valid' : 'Credential is invalid';
    } catch (error) {
        console.error('Error verifying credential:', error);
        alert('Error verifying credential');
    }
});

window.onload = loadCredentials;
