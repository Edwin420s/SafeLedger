# SafeLedger – Secure Lending with Hedera

SafeLedger is a web application that brings trust and transparency to informal lending (chamas, peer-to-peer loans) by anchoring loan agreements on the Hedera network. Built for the Hedera Hello Future Apex Hackathon 2026.

## Features
- User registration and login
- Create loan agreements with borrower, amount, due date, and terms
- Each agreement is hashed and stored immutably on Hedera (simulated via mock API)
- Dashboard to view all your agreements
- Verify an agreement’s integrity against the Hedera record
- Profile page with trust score (based on repayment history)

## Tech Stack
- React (JavaScript)
- Tailwind CSS
- React Router for navigation
- Axios for API calls (mocked for frontend-only demo)
- react-hot-toast for notifications

## How to Run
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000)

## Hedera Integration (Planned)
In a full implementation, the backend would:
- Compute SHA-256 hash of each agreement
- Submit the hash to Hedera Consensus Service (HCS)
- Store the returned transaction ID in the database
- Provide verification by recomputing the hash and comparing with the HCS record

## License
MIT