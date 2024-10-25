# Rule Engine Application

A full-stack web application built with Node.js/Express backend and React/Vite frontend for managing business rules.

## 📸 Screenshots


### Rule Creation Interface
![Rule Creation]![Screenshot (264)](https://github.com/user-attachments/assets/d0a0a1cd-0e4b-40de-9d16-28e497aaa1a7)
*Interface for creating and configuring new rules*

### Rule Management
![Rule Management]![Screenshot (263)](https://github.com/user-attachments/assets/d6d5fb94-ca2e-4904-9f58-10b214601115)

*List view of existing rules with management options*

### Rule Execution Results
![Rule Execution]![Screenshot (262)](https://github.com/user-attachments/assets/540747fa-5b4d-4545-bf3a-67f31671b3f7)

*Results view showing rule execution outcomes*

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm/yarn
- MongoDB (local installation or MongoDB Atlas account)

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rule-engine.git
cd rule-engine
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

4. Start the backend server:
```bash
node app.js
```

The server should now be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd rule-engine-frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application should now be running on `http://localhost:5173`

## 🛠️ Tech Stack

### Backend
- **Express.js**: Web application framework
- **Mongoose**: MongoDB object modeling
- **Body Parser**: Request body parsing middleware
- **Cookie Parser**: Cookie parsing middleware
- **CORS**: Cross-Origin Resource Sharing middleware

### Frontend
- **React**: UI library
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: React component library
- **Radix UI**: Primitives for building accessible components
- **Lucide React**: Icon library

## 📁 Project Structure

```
rule-engine/
├── app.js
├── package.json
├── node_modules/
├── rule-engine-frontend/
│   ├── src/
│   ├── package.json
│   ├── node_modules/
│   └── ...
└── ...
```

## 🎯 Design Choices

1. **Backend Architecture**
   - RESTful API design for clear and maintainable endpoints
   - MongoDB for flexible document storage and schema evolution
   - Middleware-based approach for cross-cutting concerns (CORS, parsing)
   - Root-level backend for simplified deployment and management

2. **Frontend Architecture**
   - Vite for faster development and optimized builds
   - Component-based architecture using React
   - Tailwind CSS for utility-first styling approach
   - shadcn/ui for consistent and accessible components

3. **Security Considerations**
   - CORS configuration for secure cross-origin requests
   - Cookie-based authentication support
   - Environment variable usage for sensitive configuration

## 📦 Dependencies

### Backend Dependencies
```json
{
  "dependencies": {
    "@radix-ui/react-alert-dialog": "^1.1.2",
    "body-parser": "^1.20.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "express": "^4.21.1",
    "lucide-react": "^0.453.0",
    "mongoose": "^8.7.2"
  }
}
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "@radix-ui/react-alert-dialog": "^1.1.2",
    "lucide-react": "^0.453.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "shadcn-ui": "^0.9.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.13.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "vite": "^5.4.9"
  }
}
```

## 🔧 Configuration

### Backend Configuration
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

### Frontend Configuration
The frontend configuration is managed through Vite's configuration file (`vite.config.js`):
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

## 🚀 Deployment

1. Build the frontend:
```bash
cd rule-engine-frontend
npm run build
```

2. Start the production server:
```bash
cd ..
NODE_ENV=production node app.js
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
