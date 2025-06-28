# 🔗 Web3 Hyperledger Fabric Assignment

This project demonstrates how to build a full-stack blockchain application using **Hyperledger Fabric**, **TypeScript-based chaincode**, and a **Dockerized REST API backend** to interact with the network.

## Project Structure

```
.
├── chaincode-typescript/        # Chaincode written in TypeScript
│   ├── src/
│   └── package.json
├── fabric-rest-api/             # Node.js REST API to interact with the blockchain
│   ├── src/
│   ├── fabric/                  # Holds connection profile and crypto materials
│   ├── wallet/                  # Wallet for identity storage
│   ├── Dockerfile
│   └── .env
```

---

## ⚙️ Prerequisites

* Docker
* Node.js (for initial development)
* Hyperledger Fabric binaries (`fabric-samples`)
* TypeScript installed globally (`npm install -g typescript`)

---

## 🔧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/karthiksriramoju/hyperledger-assignment.git
cd hyperledger-assignment
```

---

### 2. Set Up the Fabric Network

> 💠 Requires `fabric-samples/test-network`

```bash
cd fabric-samples/test-network

# Tear down any existing network
./network.sh down

# Bring up the CA-based network and create channel
./network.sh up createChannel -ca

# Deploy the chaincode from chaincode-typescript
./network.sh deployCC -ccn assetTransfer -ccp ../../chaincode-typescript -ccl typescript
```

---

### 3. Build the REST API Docker Image

```bash
cd fabric-rest-api
docker build -t fabric-rest-api .
```

---

### 4. Run the REST API

Make sure the `.env` file is present in the `fabric-rest-api/` directory with the following content:

```env
PORT=3000
CONNECTION_PROFILE=../fabric/connection-org1.json
WALLET_PATH=../wallet
USER_ID=Admin
MSP_ID=Org1MSP
CHANNEL_NAME=mychannel
CHAINCODE_NAME=assetTransfer
```

Then run:

```bash
docker run -p 3000:3000 \
  --env-file .env \
  -v $(pwd)/wallet:/app/dist/wallet \
  fabric-rest-api
```

---

## 📡 API Endpoints

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| GET    | `/api/assets/:id`    | Get asset by ID    |
| POST   | `/api/assets/create` | Create a new asset |
| PUT    | `/api/assets/:id`    | Update asset by ID    |
| GET   | `/api/assets/:id/history` | Transaction History |

---

## 📖 Notes

* The wallet is populated using certs from the `fabric/crypto/org1/admin/msp` directory.
* Chaincode should be deployed before starting the REST API.
* `asLocalhost` must be `true` in your code since you're using local Fabric setup.

---
