# Photobook App

## Overview

Photobook is a modern, React-based web application that allows users to create and manage digital photobooks. Users can upload photos, add metadata, and organize their memories in a sleek, user-friendly interface.



## Features

- Google Authentication
- Create up to 10 photobooks per user
- Add up to 20 photos per photobook
- Add metadata to photos (title, film stock, people, location, caption, event)
- View photobooks in a carousel layout

## Architecture

The Photobook app is built using React for the frontend and Firebase for backend services. Here's a high-level overview of the architecture :

```mermaid
graph TD
    subgraph Frontend
        A[App.js] --> B[AuthProvider]
        A --> C[ThemeProvider]
        A --> D[Router]
        D --> E[Authentication]
        D --> F[Home]
        D --> G[CreatePhotobook]
        D --> H[ViewPhotobooks]
        B --> I[useAuth Hook]
        G --> J[Firebase Storage]
        G --> K[Firestore]
        H --> K
    end

    subgraph Backend
        L[Firebase Authentication]
        M[Firebase Cloud Storage]
        N[Firebase Firestore]
    end

    subgraph Components
        E --> I
        F --> I
        G --> I
        H --> I
    end

    subgraph Styling
        C --> O[styled-components]
        O --> P[Global Styles]
        O --> Q[Theme]
    end

    I -.-> L
    J -.-> M
    K -.-> N

    subgraph Legend
        Z1[React Components]
        Z2[Providers/Hooks]
        Z3[Backend Services]
        Z4[Styling]
    end

    classDef component fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef provider fill:#fff9c4,stroke:#f57f17,stroke-width:2px;
    classDef backend fill:#c8e6c9,stroke:#1b5e20,stroke-width:2px;
    classDef styling fill:#f8bbd0,stroke:#880e4f,stroke-width:2px;

    class A,E,F,G,H,Z1 component;
    class B,C,I,Z2 provider;
    class L,M,N,Z3 backend;
    class O,P,Q,Z4 styling;

    style Frontend fill:#f5f5f5,stroke:#616161,stroke-width:2px;
    style Backend fill:#f5f5f5,stroke:#616161,stroke-width:2px;
    style Components fill:#f5f5f5,stroke:#616161,stroke-width:2px;
    style Styling fill:#f5f5f5,stroke:#616161,stroke-width:2px;
    style Legend fill:#ffffff,stroke:#333,stroke-width:2px;
```

## Component Structure

The app is composed of several key components:

```mermaid
graph TD
    A[App] --> B[AuthProvider]
    A --> C[Router]
    C --> D[Authentication]
    C --> E[Home]
    C --> F[CreatePhotobook]
    C --> G[ViewPhotobooks]
    F --> H[LoadingSpinner]
    G --> H
```

## User Flow

The typical user flow in the Photobook app is as follows:

```mermaid
graph TD
    A[User Login] --> B{Authenticated?}
    B -->|Yes| C[View Photobooks]
    B -->|No| A
    C --> D{Create New?}
    D -->|Yes| E[Create Photobook]
    D -->|No| F[View Existing]
    E --> G{Add Photos}
    G -->|Yes| H[Add Metadata]
    G -->|No| I[Save Photobook]
    H --> I
    I --> C
    F --> C
```

## Setup and Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/photobook-app.git
   ```

2. Install dependencies:

   ```
   cd photobook-app
   npm install
   ```

3. Set up Firebase:

   - Create a new Firebase project
   - Enable Authentication, Firestore, and Storage
   - Add your Firebase configuration to `.env` file:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

4. Run the app:
   ```
   npm start
   ```

## Key Components

### CreatePhotobook

The CreatePhotobook component allows users to create a new photobook. It includes features like:

- Photo upload (max 20 photos)
- Metadata input for each photo
- Loading spinner during photobook creation

![CreatePhotobook Component](https://via.placeholder.com/600x400.png?text=CreatePhotobook+Component)

### ViewPhotobooks

The ViewPhotobooks component displays all photobooks created by the user. It includes:

- Carousel display of photos in each photobook
- Metadata display for each photo
- Create new photobook button (disabled if limit reached)

![ViewPhotobooks Component](https://via.placeholder.com/600x400.png?text=ViewPhotobooks+Component)

## Limitations and Future Enhancements

- Current limit: 10 photobooks per user, 20 photos per photobook
- Future enhancements may include:
  - Sharing photobooks with other users
  - Exporting photobooks as PDFs
  - Adding video support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
