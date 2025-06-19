# NERO-Pay Mini

Welcome to **NERO-Pay Mini**, a cutting-edge decentralized application (dApp) designed to revolutionize peer-to-peer (P2P) payments using **NERO Chain's Account Abstraction (AA)** and **Paymaster** capabilities.

Inspired by Stripe's simplicity, NERO-Pay Mini enables seamless token transfers via just a **phone number or email**, eliminating wallet friction for everyday users. With a polished UI, social login support, and gasless transactions, it’s a powerful gateway to mainstream DeFi adoption.

---

## ✨ What It Does

* 🌐 Enables **walletless P2P payments** using social login (e.g., Web3Auth)
* 🔋 Supports **gas-free** (Type 0) transactions with Paymaster, and token-based prepay/postpay (Types 1 & 2)
* 📱 Allows payments via **phone number or email**, mimicking the Web2 experience
* 🧠 Offers **dynamic token selection** and animated feedback through a modern interface

---

## 🔧 The Problem It Solves

* **Barrier to Entry**: Traditional Web3 requires wallets & gas, deterring new users
* **Complexity**: Private key management and token approval workflows confuse users
* **Friction**: No intuitive P2P method like Venmo or CashApp exists in Web3
  → **NERO-Pay Mini** solves this with familiar, fast, and gasless payments on-chain.

---

## 🧩 Features

* 🔑 **Walletless Onboarding** via Web3Auth
* 💸 **Three Payment Modes**: Sponsored (free), Prepay, and Postpay
* 💱 **Token Flexibility**: Dynamic ERC-20 token detection and selection
* 🎨 **Animated UI**: Built with Framer Motion for delightful UX
* 🔔 **Live Feedback**: Real-time transaction statuses and toasts
* 📲 **Responsive** across mobile and desktop

---

## 🛠️ Technologies Used

| Category         | Tools and Libraries                                  |
| ---------------- | ---------------------------------------------------- |
| **Frontend**     | React, TypeScript, Tailwind CSS, Framer Motion       |
| **Blockchain**   | NERO Chain (Testnet), ethers.js, Paymaster API, viem |
| **Auth**         | Web3Auth                                             |
| **Build Tools**  | Vite (recommended), react-scripts (legacy)           |
| **UX Utilities** | react-toastify                                       |

---

## 📦 Installation

### 🔑 Prerequisites

* Node.js (v16.x or v18.x)
* npm (v8.x or v9.x)
* Git

### 📁 Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/Chidal/NERO-Pay-Mini.git
cd nero-pay-mini
```

2. **Clean and Install Dependencies**

```bash
npm uninstall tailwindcss react-scripts typescript @web3auth/modal viem ethers --save
npm cache clean --force
rm -rf node_modules package-lock.json

npm install typescript@4.9.5 --save-dev
npm install --save-dev tailwindcss@3.4.17 postcss@latest autoprefixer@latest
npm install react-scripts@5.0.1
npm install ethers@6.13.4 @web3auth/modal@latest viem@2.31.3
```

3. **Configure Environment Variables**
   Create a `.env` file:

```
REACT_APP_PAYMASTER_API_KEY=your_api_key_from_aa_platform
REACT_APP_NERO_RPC_URL=https://rpc-testnet.nerochain.io
REACT_APP_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
```

4. **Initialize Tailwind CSS**

```bash
npx tailwindcss init -p
```

Then update `tailwind.config.js` (see `src/tailwind.config.js` for reference).

5. **Start the App**

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

---

## ⚡ Optional: Switch to Vite (Recommended)

```bash
npm create vite@latest nero-pay-mini -- --template react-ts
cd nero-pay-mini
npm install
# Move your `src`, `public`, `.env` files here
npm run dev
```

---

## 🏗️ How We Built It

* Bootstrapped with React + TypeScript, styled using TailwindCSS + Framer Motion
* Integrated **Account Abstraction** with gasless Paymaster logic using ethers.js
* Connected Web3Auth for instant wallet generation & social login
* Deployed and tested contracts on **NERO Testnet**
* UI design was iteratively tested for animation, UX, and performance

---

## 🧠 Challenges We Faced

* TypeScript conflicts with `react-scripts@5.0.1`
* Compatibility issues with specific `@web3auth/modal` versions
* Troubleshooting gasless Paymaster transactions
* Ensuring mobile responsiveness with animations

---

## 📚 What We Learned

* **Account Abstraction** is key to onboarding non-crypto users
* Dynamic token flows require robust error handling
* **Social login** drastically improves UX
* **Vite** is faster, leaner, and more maintainable than legacy setups

---

## 🚀 What's Next

### 🧑‍🤝‍🧑 Wave 6 – SocialFi/Gamification

* Social payment feed (à la Venmo)
* Referral system & reward NFTs
* In-app minigames and NFT badges

### 💸 Wave 7 – DeFi Expansion

* Token staking
* Integrated swaps (Uniswap-style)
* Cross-chain payment support

### 🔮 Future Goals

* Backend for phone/email → wallet mapping
* Mobile app (iOS/Android)
* AI assistant for smart payment routing and prediction

---

## 📝 License

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for details.

---
