# Use an official Golang image as the base image
FROM golang:1.22 as builder

# Set the working directory inside the container
WORKDIR /go/src/github.com/ipfs/kubo

# Clone the kubo (go-ipfs) source code
RUN git clone https://github.com/ipfs/kubo.git .

# Checkout the latest stable release
RUN git checkout $(git describe --tags $(git rev-list --tags --max-count=1))

# Build kubo (go-ipfs) from source
RUN make build

# Create a minimal image for running IPFS
FROM ubuntu:22.04

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/local/bin

# Copy the kubo (go-ipfs) binary from the builder stage
COPY --from=builder /go/src/github.com/ipfs/kubo/cmd/ipfs/ipfs .

# Copy the swarm key
COPY swarm.key /data/ipfs/swarm.key

# Copy the entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose the IPFS ports
EXPOSE 4001 5001 8080

# Set the entrypoint to the script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
