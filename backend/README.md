# Real Estate Marketplace Backend

This is the backend service for the Real Estate Marketplace application, built using Spring Boot. It provides RESTful APIs to manage property listings.

## Project Structure

- `src/main/java/com/marketplace/`: Contains the main application code.
  - `RealEstateMarketplaceApplication.java`: The entry point of the Spring Boot application.
  - `controller/PropertyController.java`: Handles HTTP requests related to properties.
  - `model/Property.java`: Represents the property entity.
  - `repository/PropertyRepository.java`: Interface for CRUD operations on properties.
- `src/main/resources/application.properties`: Configuration properties for the application.
- `pom.xml`: Maven configuration file for managing dependencies.

## Getting Started

### Prerequisites

- Java 11 or higher
- Maven

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Build the project:
   ```
   mvn clean install
   ```

### Running the Application

To run the application, execute the following command:
```
mvn spring-boot:run
```

The application will start on `http://localhost:8080`.

### API Endpoints

- `GET /api/properties`: Fetches a list of properties.
- `POST /api/properties`: Creates a new property.
- `GET /api/properties/{id}`: Fetches a property by ID.
- `PUT /api/properties/{id}`: Updates a property by ID.
- `DELETE /api/properties/{id}`: Deletes a property by ID.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.