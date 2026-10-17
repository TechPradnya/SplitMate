# SplitMate — Shared Expense Management

**SplitMate** is a shared expense management web application designed for college students, roommates, friends, and working professionals who want to organize group expenses and track shared spending.

The project combines a React frontend, an Express backend, MongoDB storage, and Solidity smart contract development for blockchain-based settlements.

## Features

- **Expense management:** Record shared expenses with names, amounts, and payer information.
- **Group organization:** Organize expenses into groups such as flatmates, college friends, and trips.
- **Dashboard:** View expense summaries, groups, and recent spending.
- **MongoDB integration:** Store and retrieve expenses through the backend API.
- **MetaMask integration:** Connect a cryptocurrency wallet through the browser.
- **Blockchain settlement development:** Build and test Solidity smart contracts for recording shared-expense settlements.

> Note: The application is under active development. Group persistence, accurate balance calculations, and complete blockchain settlement integration still require implementation and verification.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend interface |
| TypeScript | Type-safe development |
| Vite | Frontend build tool |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB Atlas | Database |
| Mongoose | Database modeling |
| MetaMask | Wallet connection |
| Solidity | Smart contracts |
| Hardhat | Contract development and testing |
| GitHub | Version control |
| Vercel | Frontend hosting |
| Render | Planned backend hosting |

## Project Structure

```text
SplitMate/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── blockchain/
│   ├── contracts/
│   │   └── SplitMateSettlement.sol
│   ├── scripts/
│   └── test/
├── frontend-temp/
│   ├── src/
│   └── package.json
├── frontend/
├── .gitignore
└── README.md
```

The `frontend-temp` folder contains the dashboard currently deployed on Vercel.

## Live Demo

**Frontend:** https://split-mate-liard.vercel.app/

The frontend is deployed. Backend connectivity and production expense functionality must be verified separately.

## Getting Started

### Prerequisites

Install Node.js, npm, and Git. You will also need a MongoDB Atlas database to run the backend.

### 1. Clone the repository

```bash
git clone https://github.com/TechPradnya/SplitMate.git
cd SplitMate
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `backend/.env` file with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Replace the placeholder with your own MongoDB Atlas connection string. Never commit the real `.env` file to GitHub.

Start the backend:

```bash
npm run dev
```

The API should be available at `http://localhost:5000`.

Health check: `http://localhost:5000/api/health`

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend-temp
npm install
npm run dev
```

Open the local URL shown by Vite in your terminal.

The frontend must be configured to call the correct backend API URL. The production frontend must not rely on `localhost:5000`.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API root |
| GET | `/api/health` | Backend health check |
| GET | `/api/expenses` | Retrieve expenses |
| POST | `/api/expenses` | Create an expense |
| GET | `/api/groups` | Retrieve groups |
| POST | `/api/groups` | Create a group |

### Example expense request

```json
{
  "name": "Internet Bill",
  "amount": 800,
  "paid": "You",
  "icon": "🧾",
  "groupId": "Pune Flatmates"
}
```

Send this JSON to `POST /api/expenses` with the `Content-Type: application/json` header.

## Blockchain Development

The project includes `blockchain/contracts/SplitMateSettlement.sol`.

The intended workflow is to connect a wallet, submit a settlement transaction, and record settlement information on a blockchain.

The contract must be compiled, tested, and deployed before blockchain settlement functionality can be considered production-ready. Use testnet funds while developing.

## Deployment

### Frontend — Vercel

- Root directory: `frontend-temp`
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

Configure a frontend environment variable such as `VITE_API_URL` with the deployed backend URL when the backend is ready.

### Backend — Render

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm start`

Configure `MONGODB_URI` through Render's private environment variable settings.

### Database — MongoDB Atlas

Use MongoDB Atlas for cloud database storage and configure secure network access for the deployed backend.

## Security

- Never upload `.env` files, database credentials, wallet seed phrases, or private keys.
- Validate data on the backend.
- Configure CORS for the deployed frontend.
- Restrict database network access.
- Test smart contracts before deployment.
- Treat blockchain transactions as irreversible.

## Development Status

- Dashboard UI: implemented.
- MetaMask connection: implemented at the frontend level.
- Expense API and MongoDB connection: verified locally.
- Group persistence and integration: in progress.
- Accurate expense splitting and balances: in progress.
- Smart contract compilation, testing, and deployment: in progress.
- Frontend deployment: deployed to Vercel.
- Backend production deployment: pending verification.

## Future Enhancements

- User authentication and group invitations.
- Group member management.
- Equal and custom expense splitting.
- Accurate balances and settlement suggestions.
- Expense editing and deletion.
- Blockchain transaction history.
- Automated testing and continuous deployment.

## Author

**Pradnya Ghodke**

B.Sc. Blockchain Technology

- GitHub: https://github.com/TechPradnya
- LinkedIn: https://www.linkedin.com/in/pradnya-ghodke/

---

*SplitMate is an educational project under active development. Financial calculations and blockchain settlement features must be tested and verified before real-world use.*
