# 🔗 SmartFalcon Hyperledger Fabric Assignment

This project demonstrates how to build a full-stack blockchain application using **Hyperledger Fabric**, **TypeScript-based **, and a **Dockerized REST API backend** to interact with the network.

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
git clone https://github.com/karthiksriramoju/SmartFalcon-Assignment.git
cd SmartFalcon-Assignment
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
CONNECTION_PROFILE=./fabric/connection-org1.json
WALLET_PATH=./dist/wallet
USER_ID=Admin
AS_LOCALHOST=false
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

## Sucessful Output After Testing 

### 1. Using Peer CLI
<img width="1178" alt="Screenshot 2025-06-28 at 4 35 57 PM" src="https://github.com/user-attachments/assets/21fbfea0-ec15-48fb-aa26-3e9c0eb71cef" />

### 1. Using API calls
<img width="1330" alt="Screenshot 2025-06-28 at 5 11 55 PM" src="https://github.com/user-attachments/assets/eb03902b-37f2-4e69-85ee-790b4848937a" />



