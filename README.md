# 🏞️ Virtual Land Registry

A decentralized virtual land registry and marketplace built on the Internet Computer Protocol (ICP). This application allows users to mint virtual land NFTs, manage their properties, and trade them in a peer-to-peer marketplace with a modern, responsive interface.

![Virtual Land Registry](https://img.shields.io/badge/Built%20on-Internet%20Computer-29ABE2?style=for-the-badge&logo=internet-computer&logoColor=white)
![Rust](https://img.shields.io/badge/Backend-Rust-000000?style=for-the-badge&logo=rust&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)



## ✨ Features

### 🎯 Core Functionality
- **🏗️ Land Minting**: Create unique virtual land NFTs with custom coordinates, names, and images
- **🖼️ On-Chain Image Storage**: Upload and store land images directly on-chain as byte arrays
- **👤 Internet Identity**: Secure authentication using DFINITY's Internet Identity
- **🏠 Portfolio Management**: View and manage all your minted lands in one centralized location
- **🔐 Principal-based Ownership**: Secure land ownership tied to your ICP identity

### 🛒 Marketplace Features
- **📋 Listing System**: List your lands for sale with custom pricing in ICP
- **💰 Direct Trading**: Buy lands directly from other users with instant ownership transfer
- **🔄 Real-time Updates**: Dynamic marketplace updates and inventory management
- **❌ Listing Management**: Remove listings and manage your marketplace presence

### 🎨 User Experience
- **📱 Responsive Design**: Mobile-first design with modern CSS Grid and Flexbox layouts
- **🌙 Modern UI/UX**: Clean, professional interface with smooth animations and transitions
- **⚡ Performance Optimized**: Fast loading with efficient data fetching and state management
- **🔔 Real-time Feedback**: Instant status updates and notifications for all user actions
- **🎭 Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **🎨 Custom Cursor**: Interactive magnetic cursor for enhanced user experience

## 🏗️ Architecture

### Backend (Rust + IC-CDK)
```
📦 Backend Canister
├── 🗄️ Land Storage (Vec<LandNFT>)
├── 🏪 Marketplace (HashMap<u64, Listing>)
├── 🔢 ID Management (Auto-incrementing)
├── 🔐 Authentication (Principal-based)
└── 🖼️ Image Storage (Vec<u8> byte arrays)
```

### Frontend (React + Vite + TypeScript)
```
📦 Frontend Application
├── 🔐 Authentication (Internet Identity)
├── 🎨 Component Library (Mint, Portfolio, Marketplace)
├── 🎯 Actor Management (Candid Interface)
├── 📱 Responsive UI (SCSS + Tailwind)
├── 🎭 Animation System (Framer Motion + GSAP)
└── 🎨 Custom UI Components (Button, Modal, Card, etc.)
```

## 🚀 Quick Start

### Prerequisites
- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (Internet Computer SDK)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://rustup.rs/) (for backend development)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/basedanurag/kshetra.git
   cd KSHETRA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the local Internet Computer replica**
   ```bash
   dfx start --background
   ```

4. **Deploy the canisters**
   ```bash
   dfx deploy
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Access the application**
   - **Development**: `http://localhost:3000`
   - **Production**: `http://localhost:4943?canisterId={asset_canister_id}`

## 🎮 Usage Guide

### 1. Authentication
- Click "Get Started" to authenticate using Internet Identity
- Your Principal ID will be displayed in the navigation bar
- All land ownership is tied to your authenticated identity

### 2. Minting Land
- Navigate to "Mint Land" tab
- Fill in land details:
  - **Name**: Descriptive name for your land
  - **Coordinates**: X,Y position on the virtual map
  - **Size**: Dimensions (e.g., "10x10 meters")
  - **Image**: Upload a representative image (stored on-chain)
- Click "Mint Land" to create your NFT

### 3. Managing Your Portfolio
- Visit "My Lands" to view all your minted properties
- Each land displays:
  - Unique ID and name
  - Coordinates and size
  - Uploaded image
  - Current ownership status

### 4. Trading in the Marketplace
- Go to "Marketplace" to access trading features
- **Listing**: Set a price in ICP for any of your unlisted lands
- **Buying**: Purchase lands listed by other users
- **Management**: Remove your listings or update prices

## 🛠️ Technical Implementation

### Smart Contract (Rust)
```rust
// Core data structures
struct LandNFT {
    id: u64,
    name: String,
    coordinates: Coordinates,
    size: String,
    image_data: Vec<u8>,
    owner: Principal,
    timestamp: u64,
}

struct Listing {
    land_id: u64,
    price: u64,
    seller: Principal,
    listed_at: u64,
}
```

### Key Backend Functions
- `mint_land()` - Create new land NFTs
- `get_my_land()` - Retrieve user's lands
- `list_land_for_sale()` - Create marketplace listings
- `buy_land()` - Execute land purchases
- `get_marketplace_listings()` - Fetch all active listings

### Frontend Architecture
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development experience
- **Vite**: Fast build tool and development server
- **Framer Motion**: Smooth animations and transitions
- **SCSS**: Advanced CSS with variables and mixins
- **Actor Pattern**: Direct canister communication via Candid interface

## 📁 Project Structure

```
KSHETRA/
├── src/
│   ├── backend/                    # Rust backend canister
│   │   ├── src/lib.rs              # Main canister logic
│   │   ├── Cargo.toml              # Rust dependencies
│   │   └── backend.did             # Candid interface
│   ├── frontend/                   # React frontend application
│   │   ├── src/
│   │   │   ├── components/         # React components
│   │   │   │   ├── ui/             # Reusable UI components
│   │   │   │   ├── sections/       # Page sections
│   │   │   │   ├── MintLandForm.jsx
│   │   │   │   ├── MyLands.jsx
│   │   │   │   ├── Marketplace.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   ├── animations/         # Animation utilities
│   │   │   ├── types/              # TypeScript type definitions
│   │   │   ├── App.jsx             # Main application
│   │   │   ├── main.jsx            # Entry point
│   │   │   ├── index.scss          # Global styles
│   │   │   ├── actor.js            # Canister interaction
│   │   │   └── identity.js         # Authentication logic
│   │   ├── public/                 # Static assets
│   │   ├── index.html              # HTML template
│   │   ├── package.json            # Dependencies
│   │   ├── tsconfig.json           # TypeScript config
│   │   └── vite.config.js          # Build configuration
│   └── declarations/               # Auto-generated Candid bindings
├── dfx.json                        # DFX configuration
├── package.json                    # Root package configuration
└── README.md                       # This file
```

## 🔧 Development Commands

```bash
# Backend Development
dfx deploy backend                  # Deploy only backend canister
dfx canister call backend mint_land # Test backend functions

# Frontend Development
npm start                          # Start development server
npm run build                     # Build for production
npm run format                    # Format code with Prettier

# Full Deployment
dfx deploy                        # Deploy all canisters
dfx deploy --network ic           # Deploy to mainnet
```

## 🧪 Testing

### Manual Testing Workflow
1. **Authentication Test**: Login/logout functionality
2. **Minting Test**: Create lands with various data types
3. **Portfolio Test**: Verify land display and data integrity
4. **Marketplace Test**: List, buy, and unlist lands
5. **Edge Cases**: Test with large images, special characters, etc.

### Backend Testing
```bash
# Test canister functions directly
dfx canister call backend get_all_land
dfx canister call backend get_marketplace_listings
```

## 🚀 Deployment

### Local Testing
```bash
dfx start --background
dfx deploy
npm start
```

### Production Deployment
```bash
dfx deploy --network ic --with-cycles 1000000000000
```

## 🔐 Security Features

- **Principal-based Authentication**: Secure identity management via Internet Identity
- **Ownership Verification**: Strict land ownership checks and validation
- **Input Validation**: Comprehensive data validation and sanitization
- **Error Handling**: Graceful error management and user feedback
- **Immutable Records**: Blockchain-based data integrity and transparency
- **Secure Image Storage**: On-chain image storage with byte array validation

## 🎯 Future Enhancements

- [ ] **Land Categories**: Different types of virtual properties (residential, commercial, etc.)
- [ ] **Auction System**: Time-based bidding for premium lands
- [ ] **Land History**: Complete ownership and transaction history tracking
- [ ] **Geographic Features**: Advanced coordinate system with regions and zones
- [ ] **Mobile App**: Native mobile application for iOS and Android
- [ ] **Integration**: Connect with other ICP ecosystems and DeFi protocols
- [ ] **Land Development**: Building and improvement systems for virtual properties
- [ ] **Social Features**: Community features and land showcase galleries

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Add TypeScript types for new features
- Include proper error handling and validation
- Test your changes thoroughly
- Update documentation as needed

## 📞 Support & Resources

- **Documentation**: [Internet Computer Docs](https://internetcomputer.org/docs/)
- **Community**: [DFINITY Developer Forum](https://forum.dfinity.org/)
- **Issues**: [GitHub Issues](../../issues)
- **Discord**: Join our community for real-time support

## 🏆 Project Achievements

- ✅ Full-stack decentralized application on ICP
- ✅ On-chain image storage and management
- ✅ Real-time marketplace functionality
- ✅ Responsive modern UI/UX with animations
- ✅ Production-ready architecture and security
- ✅ TypeScript integration for type safety
- ✅ Comprehensive component library
- ✅ Smooth animations and micro-interactions

## 🌟 Tech Stack Highlights

- **Backend**: Rust + IC-CDK for high-performance smart contracts
- **Frontend**: React 18 + TypeScript + Vite for modern development
- **Styling**: SCSS + Tailwind CSS for responsive design
- **Animations**: Framer Motion + GSAP for smooth interactions
- **Authentication**: Internet Identity for secure user management
- **Storage**: On-chain data storage for decentralization

---

**Built with ❤️ on the [Internet Computer](https://dfinity.org/)**

_Empowering the future of decentralized virtual real estate and digital asset ownership_
