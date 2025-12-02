// IPFS Web UI http://localhost:5001/webui


const { create } = require('ipfs-http-client');
const fs = require('fs');
const path = require('path');

// Connect to the IPFS node
const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' });

async function storeFile(filePath) {
  try {
    const file = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const { cid } = await ipfs.add({ path: fileName, content: file });
    console.log(`File stored successfully. CID: ${cid.toString()}`);

    return cid.toString();
  } catch (error) {
    console.error('Error storing file:', error);
  }
}

async function getFile(cid, outputPath) {
  try {
    console.log(`Fetching file with CID: ${cid}`);
    const stream = ipfs.cat(cid);

    const content = [];
    for await (const chunk of stream) {
      content.push(chunk);
      console.log('Chunk received:', chunk.toString());
    }

    if (content.length > 0) {
      fs.writeFileSync(outputPath, Buffer.concat(content));
      console.log(`File retrieved successfully. Saved to: ${outputPath}`);
    } else {
      console.log('No content to save.');
    }
  } catch (error) {
    console.error('Error retrieving file:', error);
  }
  console.log('end getFile');
}

async function main() {
  const filePath = './file.txt'; // Change this to your file path
  const outputPath = './outfile.txt'; // Change this to desired output path

  console.log('Try to store file');
  const cid = await storeFile(filePath);
  if (cid) {
    console.log('Try to get file');
    await getFile(cid, outputPath);
  }
}

main();
