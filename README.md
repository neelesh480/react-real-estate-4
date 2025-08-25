# Real Estate Marketplace

This project is a Real Estate Marketplace application built with React for the frontend and Spring Boot for the backend. It allows users to browse, search, and view properties available for sale or rent.

## Project Structure

The project is divided into two main parts:

- **Frontend**: The React application that provides the user interface.
- **Backend**: The Spring Boot application that handles data management and API requests.

### Frontend

The frontend is located in the `frontend` directory and includes the following key files:

- `public/index.html`: The main HTML file for the React application.
- `src/App.jsx`: The main component that sets up routing and layout.
- `src/components/PropertyList.jsx`: A component that fetches and displays a list of properties.
- `src/pages/Home.jsx`: The homepage component that renders the `PropertyList`.
- `src/services/api.js`: Functions for making API calls to the backend.
- `src/index.js`: The entry point for the React application.
- `package.json`: Configuration file for npm.

### Backend

The backend is located in the `backend` directory and includes the following key files:

- `src/main/java/com/marketplace/RealEstateMarketplaceApplication.java`: The main entry point for the Spring Boot application.
- `src/main/java/com/marketplace/controller/PropertyController.java`: Handles HTTP requests related to properties.
- `src/main/java/com/marketplace/model/Property.java`: Represents the property entity.
- `src/main/java/com/marketplace/repository/PropertyRepository.java`: Provides methods for CRUD operations on properties.
- `src/main/resources/application.properties`: Configuration properties for the Spring Boot application.
- `pom.xml`: Configuration file for Maven.

## Getting Started

### Prerequisites

- Node.js and npm for the frontend
- Java and Maven for the backend

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the frontend directory and install dependencies:
   ```
   cd frontend
   npm install
   ```

3. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   mvn install
   ```

### Running the Application

- Start the backend server:
  ```
  cd backend
  mvn spring-boot:run
  ```

- Start the frontend application:
  ```
  cd frontend
  npm start
  ```

The application should now be running on `http://localhost:3000` for the frontend and `http://localhost:8080` for the backend.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.