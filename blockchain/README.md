
# SplitMate — Shared Expense Management

SplitMate is a shared expense management application designed to help college students, roommates, friends, and working professionals organize group expenses, track payments, and simplify expense sharing.

The goal of SplitMate is to make shared spending more transparent by combining a modern web interface, persistent data storage, and blockchain-based settlement capabilities.

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Blockchain Integration](#blockchain-integration)
- [Deployment](#deployment)
- [Security](#security)
- [Current Development Status](#current-development-status)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

## Overview

Imagine four students sharing a flat in Pune. They need to divide rent, electricity, Wi-Fi, groceries, and other household expenses.

SplitMate aims to let users record these expenses, associate them with groups, calculate individual shares, and understand who owes money to whom.

The project combines a React frontend, an Express backend, MongoDB storage, and a planned Solidity smart contract for blockchain settlements.

## Problem Statement

Managing shared expenses manually can lead to calculation errors, confusion about payments, and disagreements among group members.

SplitMate aims to address these challenges by providing:

- Centralized expense records.
- Group-based expense organization.
- Transparent expense-sharing calculations.
- A clear view of balances and payments.
- Blockchain-based settlement records as a future capability.

## Key Features

### Expense Management
- Add shared expenses with a name and amount.
- Record who paid for an expense.
- Associate expenses with a group.
- Store and retrieve expenses through the backend API.

### Group Management
- Organize expenses around groups such as flatmates, college friends, and trips.
- Provide a foundation for persistent group and member management.

### Dashboard
- View expense summaries and recent expenses.
- Explore groups and settlement information.
- Use a responsive, modern interface.

### MetaMask Integration
- Connect a MetaMask wallet from the frontend.
- Prepare the application for blockchain-based payment workflows.

### Blockchain Settlement
- Develop a Solidity smart contract for direct wallet-to-wallet settlements.
- Record settlement details on-chain.
- Prepare for testnet deployment and transaction verification.

**Note:** Features described as planned or in development are not necessarily fully integrated into the application yet.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| TypeScript | Type-safe application development |
| Vite | Frontend development and build tooling |
| CSS | Dashboard styling and responsive layout |
| Node.js | Backend JavaScript runtime |
| Express.js | REST API |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| MetaMask | Wallet connection |
| Solidity | Smart contract development |
| Hardhat | Smart contract compilation and testing |
| Git and GitHub | Version control and source code hosting |
| Vercel | Frontend hosting |
| Render | Planned backend hosting |

## Project Structure

```text
Split_mate/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── models/
│   │   │   ├── Expense.ts
│   │   │   ├── Group.ts
│   │   │   ├── Settlement.ts
│   │   │   └── User.ts
│   │   ├── routes/
│   │   │   ├── expenseRoutes.ts
│   │   │   └── groupRoutes.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── blockchain/
│   ├── contracts/
│   │   └── SplitMateSettlement.sol
│   ├── scripts/
│   │   └── deploy.ts
│   └── test/
├── frontend-temp/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── frontend/
│   └── src/
├── .gitignore
└── README.md
```

The `frontend-temp` directory contains the dashboard currently used for the Vercel frontend deployment. The separate `frontend` directory contains additional frontend components and utilities.

## Getting Started

### Prerequisites

Install the following tools:

- Node.js and npm
- Git
- A MongoDB Atlas account
- MetaMask browser extension for wallet testing

### 1. Clone the Repository

```bash
git clone https://github.com/TechPradnya/SplitMate.git
cd SplitMate
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Replace the placeholder with your own MongoDB Atlas connection string. Never commit your actual `.env` file.

### 3. Start the Backend

```bash
npm run dev
```

The backend should run at:

`http://localhost:5000`

Check the health endpoint:

`http://localhost:5000/api/health`

Expected response:

```json
{
  "success": true,
  "message": "SplitMate backend is working!"
}
```

### 4. Start the Frontend

Open a second terminal:

```bash
cd frontend-temp
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal, typically:

`http://localhost:5173`

The frontend must be configured to use the correct backend API URL.

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Port used by the backend server |
| `MONGODB_URI` | MongoDB Atlas connection string |

### Frontend

For production, configure a Vite environment variable such as:

```env
VITE_API_URL=https://your-backend-service.onrender.com
```

Replace the example URL with the actual deployed backend URL. The frontend API calls must use this variable instead of hardcoded `localhost` URLs.

Do not expose database credentials, private keys, or wallet secrets in frontend environment variables.

## API Endpoints

The backend currently provides the following endpoints.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Check the API root |
| GET | `/api/health` | Check backend health |
| GET | `/api/expenses` | Retrieve expenses |
| POST | `/api/expenses` | Create an expense |
| GET | `/api/groups` | Retrieve groups |
| POST | `/api/groups` | Create a group |

### Example: Create an Expense

Request:

```http
POST /api/expenses
Content-Type: application/json
```

Body:

```json
{
  "name": "Internet Bill",
  "amount": 800,
  "paid": "You",
  "icon": "🧾",
  "groupId": "Pune Flatmates"
}
```

The backend validates the input and saves the expense to MongoDB.

These endpoints represent the current API implementation; additional validation, authorization, and functionality may be required before public production use.

## Blockchain Integration

SplitMate includes a Solidity contract named `SplitMateSettlement.sol`.

The intended settlement workflow is:

1. Connect a user's wallet through MetaMask.
2. Identify the payer and recipient.
3. Submit a settlement transaction.
4. Record settlement information on the blockchain.
5. Display the transaction details in the application.

The contract must be compiled, tested, deployed to a test network, and integrated with the frontend before this workflow can be considered complete.

Blockchain transactions may be irreversible. Use testnet funds while developing and testing.

## Deployment

### Frontend — Vercel

The frontend deployment uses the `frontend-temp` directory.

Configure the project with:

- Framework preset: Vite
- Root directory: `frontend-temp`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL` set to the deployed backend URL

### Backend — Render

The backend can be deployed as a Node.js web service.

Configure:

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables: `MONGODB_URI` and `PORT`, according to the hosting provider's requirements

After deployment, verify `/api/health` and `/api/expenses`, then confirm that the frontend can access the API.

### Database — MongoDB Atlas

Use MongoDB Atlas for persistent cloud storage. Configure database access and network permissions securely for the deployed backend.

### Smart Contract

Deploy the Solidity contract to a compatible test network after compilation and tests pass. Configure the frontend with the deployed contract address and network settings before enabling settlement interactions.

## Security

- Keep `.env` files out of Git.
- Never publish MongoDB credentials, private keys, or seed phrases.
- Validate user input on the backend.
- Restrict database network access appropriately.
- Configure production CORS rules.
- Never trust frontend-calculated balances as authoritative.
- Test smart contracts before deploying them.
- Do not use real funds while the application is under development.

## Current Development Status

| Component | Status |
|---|---|
| Dashboard UI | Implemented |
| MetaMask connection | Implemented at the frontend level |
| Express backend | Running locally |
| MongoDB Atlas connection | Verified locally |
| Expense create and retrieve APIs | Verified locally |
| Group persistence and frontend integration | In progress |
| Accurate expense splitting | Requires completion and verification |
| Smart contract compilation and tests | In progress |
| Blockchain settlement integration | Pending verification |
| Frontend hosting | Deployed to Vercel |
| Backend production deployment | Requires completion and verification |

## Future Enhancements

- User registration and authentication.
- Group invitations and member management.
- Equal and custom expense splitting.
- Accurate debt calculation and settlement suggestions.
- Expense editing and deletion.
- Transaction history and settlement status.
- Smart contract deployment and event tracking.
- Automated tests and CI/CD.
- Improved mobile accessibility and responsive design.

## Author

**Pradnya Ghodke**

B.Sc. Blockchain Technology student

GitHub: https://github.com/TechPradnya

LinkedIn: https://www.linkedin.com/in/pradnya-ghodke/

---

# Sample Hardhat 3 Project (minimal)

This project has a minimal setup of Hardhat 3, without any plugins.

## What's included?

The project includes native support for TypeScript, Hardhat scripts, tasks, and support for Solidity compilation and tests.
*SplitMate is an educational project under active development. Features involving financial balances and blockchain settlements should be treated as experimental until fully implemented, tested, and verified.*
