#!/bin/sh

# Initialize IPFS repository if it doesn't exist
if [ ! -d "/root/.ipfs" ]; then
  ipfs init
fi

# Copy the swarm key to the IPFS configuration directory
cp /data/ipfs/swarm.key /root/.ipfs/swarm.key

# Update IPFS config to listen on all network interfaces
ipfs config --json Addresses.API '["/ip4/0.0.0.0/tcp/5001"]'
ipfs config --json Addresses.Gateway '["/ip4/0.0.0.0/tcp/8080"]'

# Allow CORS for IPFS API
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET", "POST", "PUT"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers '["Authorization"]'

# Start the IPFS daemon
exec ipfs daemon --enable-pubsub-experiment
