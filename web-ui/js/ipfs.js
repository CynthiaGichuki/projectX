document.getElementById('upload-button').addEventListener('click', uploadFile);
document.getElementById('download-button').addEventListener('click', downloadFile);
document.getElementById('check-button').addEventListener('click', checkFile);

async function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file to upload');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:5001/api/v0/add', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        document.getElementById('upload-result').textContent = `File uploaded: ${data.Hash}`;
    } catch (error) {
        console.error('Error uploading file:', error);
        document.getElementById('upload-result').textContent = 'Error uploading file';
    }
}

async function downloadFile() {
    const fileHash = document.getElementById('file-hash').value;
    if (!fileHash) {
        alert('Please enter an IPFS hash');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/ipfs/${fileHash}`);
        if (!response.ok) throw new Error('File not found');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileHash;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        document.getElementById('download-result').textContent = 'File downloaded';
    } catch (error) {
        console.error('Error downloading file:', error);
        document.getElementById('download-result').textContent = 'Error downloading file';
    }
}

async function checkFile() {
    const fileHash = document.getElementById('check-hash').value;
    if (!fileHash) {
        alert('Please enter an IPFS hash');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/ipfs/${fileHash}`);
        if (response.ok) {
            document.getElementById('check-result').textContent = 'File is available on IPFS';
        } else {
            document.getElementById('check-result').textContent = 'File not found on IPFS';
        }
    } catch (error) {
        console.error('Error checking file:', error);
        document.getElementById('check-result').textContent = 'Error checking file';
    }
}
