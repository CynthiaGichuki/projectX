const issuerUrl = 'http://localhost:9001/issue-credential';

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
        document.getElementById('issued-credential').textContent = JSON.stringify(credential, null, 2);
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
