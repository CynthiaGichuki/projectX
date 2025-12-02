const axios = require('axios');

const issuerUrl = 'http://localhost:9001/issue-credential';
const verifierUrl = 'http://localhost:9002/verify-credential';

// Predefined Ethereum addresses
const ethAddresses = [
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
  '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
  '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
  '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
  '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
  '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
  '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
  '0x71bE63f3384f5fb98995898A86B02Fb2426c5788',
  '0xFABB0ac9d68B0B445fB7357272Ff202C5651694a',
  '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
  '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
  '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
  '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
  '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
  '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
  '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'
];

async function issueCredential(issuer, did, type, name, course, registry) {
  try {
    const response = await axios.post(issuerUrl, {
      issuer: issuer,
      did: did,
      credential: { type, name, course },
      registry: registry
    });
    return response.data;
  } catch (error) {
    console.error('Error issuing credential:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function verifyCredential(credential) {
  try {
    const response = await axios.post(verifierUrl, { credential });
    return response.data;
  } catch (error) {
    console.error('Error verifying credential:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Function to generate a unique DID for the specified registry
function generateDID(index, registry) {
  if (registry === 'blockchain') {
    // Ensure the index is within the bounds of the predefined Ethereum addresses
    if (index >= ethAddresses.length) {
      throw new Error('Index out of bounds for Ethereum addresses');
    }
    const address = ethAddresses[index];
    return `did:eth:${address}`;
  } else {
    const uniqueNumber = Math.floor(Math.random() * 1000000) + 1;
    return `did:db:${uniqueNumber}`;
  }
}

async function runTests() {
  const issuer = 'issuer1';
  const type = 'StudentID';
  const course = 'ssi';

  const registries = ['db', 'blockchain'];

  // Create and verify 10 valid credentials for both registries
  for (const registry of registries) {
    console.log(`\nTesting with registry: ${registry}\n`);
    for (let i = 0; i < 10; i++) {
      const did = generateDID(i, registry);
      const name = `Student${i + 1}`;
      try {
        const credential = await issueCredential(issuer, did, type, name, course, registry);
        const verificationResult = await verifyCredential(credential);
        console.log(`Test ${i + 1} (${registry}): ${verificationResult.valid ? 'PASS' : 'FAIL'}`);
      } catch (error) {
        console.log(`Test ${i + 1} (${registry}): FAIL (Error issuing or verifying credential)`);
      }
    }

    // Negative test 1: Tampered signature
    try {
      const did = generateDID(10, registry);
      const tamperedCredential = await issueCredential(issuer, did, type, 'TamperedStudent', course, registry);
      tamperedCredential.signature = 'tamperedSignature';
      const tamperedResult = await verifyCredential(tamperedCredential);
      console.log(`Negative Test 1 (Tampered Signature) (${registry}): ${!tamperedResult.valid ? 'PASS' : 'FAIL'}`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error === 'Invalid credential signature') {
        console.log(`Negative Test 1 (Tampered Signature) (${registry}): PASS`);
      } else {
        console.log(`Negative Test 1 (Tampered Signature) (${registry}): FAIL (Unexpected error)`);
      }
    }

  }
}

runTests().catch(err => console.error('Error running tests:', err));
