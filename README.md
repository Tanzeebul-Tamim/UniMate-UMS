# 🎓 UniMate - University Management System (UMS)

UniMate is a robust and scalable university management backend system designed to manage academic and administrative functionalities for students, faculty, and admin users. It is built with TypeScript, Express.js, MongoDB, and other modern tools, featuring proper error handling, validation, and modular architecture.

<br>

## 📚 Table of Contents

-   [Features](#-features)
-   [Technologies Used](#-technologies-used)
-   [Project Structure](#-project-structure)
-   [Requirement Analysis](#-requirement-analysis)
-   [Database Schema Overview](#-database-schema-overview)
-   [API Endpoints](#-api-endpoints)
-   [Sample API Testing](#-sample-api-testing)
-   [Common Advanced Query Features](#-common-advanced-query-features)
-   [Sample Data](#-sample-data)
-   [Prerequisites](#-prerequisites)
-   [Installation and Running Locally](#-installation-and-running-locally)
-   [Live Deployment](#-live-deployment)
-   [License](#-license)

<br>

## 🚀 Features

-   Full CRUD operations for students, faculty, and admin profiles.
-   Dynamic semester and department management.
-   Comprehensive ID validation and naming conventions.
-   Middleware-driven error handling and async wrapper.
-   Zod-based schema validation for clean and type-safe API requests.
-   Global error handler with specific error mappers (Zod, Mongoose, duplicate, cast).
-   Custom logic like middle name removal and ID formatting checks.
-   Role-based restrictions and utility logic for request validation.
-   Well-structured modular folder architecture.

<br>

## 🧰 Technologies Used

-   **Node.js**: JavaScript runtime environment for building scalable server-side applications
-   **Express.js**: Web framework for Node.js to handle routing and middleware
-   **TypeScript** – Strong typing & clean code structure
-   **MongoDB**: NoSQL database for storing application data
-   **Mongoose** – Schema modeling
-   **Zod** – Runtime validation
-   **ESLint** – Linting
-   **Prettier** – Formatting
-   **dotenv** – Environment variable management
-   **HTTP Status** – Clean status messaging
-   **ts-node-dev** – TypeScript development server
-   **bcrypt** – Password hashing
-   **validator** – Data validation
-   **CORS** – Cross-Origin Resource Sharing
-   **Vercel** – Cloud deployment

<br>

## 📁 Project Structure

```
UniMate-UMS/
├── .gitignore                                      # Specifies files and folders to be ignored by Git
├── LICENSE                                         # Project license information (MIT)
├── README.md                                       # Project documentation (this file)
├── analysis-requirements/
│   ├── UniMate-Course-Syllabus.pdf                 # Project syllabus document
│   ├── UniMate-UMS-Database-Schema.png             # Visual ER diagram showing database collections and relationships
│   └── UniMate-UMS-Requirement-Analysis.pdf        # Documents functional requirements, database models, and API endpoints
└── server/
    ├── sample/                                     # sample request payloads (student.json, faculty.json, admin.json)
    ├── src/
    │   ├── app/
    │   │   ├── builder/                            # QueryBuilder.ts – builds mongoose queries (filter, sort, paginate)
    │   │   ├── config/                             # index.ts – loads environment config
    │   │   ├── constant/                           # common.ts – shared enums and schemas
    │   │   ├── errors/                             # AppError & handlers for Zod, Mongoose, etc.
    │   │   ├── interface/                          # common.ts, error.ts – TypeScript types/interfaces
    │   │   ├── middlewares/                        # globalErrorHandler.ts, validateRequest.ts, notFound.ts
    │   │   ├── modules/                            # feature modules (academicFaculty, student, semesterRegistration, etc.)
    │   │   │   ├── moduleName/
    │   │   │   │   ├── moduleName.constant.ts      # Module-specific constants (roles, statuses, default values)
    │   │   │   │   ├── moduleName.controller.ts    # Handles HTTP request/response logic
    │   │   │   │   ├── moduleName.interface.ts     # Module-specific TypeScript types and interfaces
    │   │   │   │   ├── moduleName.model.ts         # Mongoose schema/model definition for the module
    │   │   │   │   ├── moduleName.route.ts         # Express route definitions and API endpoints
    │   │   │   │   ├── moduleName.service.ts       # Core business logic, DB interactions
    │   │   │   │   ├── moduleName.utils.ts         # Utility/helper functions for the module (Optional)
    │   │   │   │   └── moduleName.validation.ts    # Zod schema for validating incoming request bodies
    │   │   │   │
    │   │   │   └── ...                             # Other similar module directories
    │   │   │
    │   │   ├── routes/                             # index.ts – central router
    │   │   └── utils/                              # Utilities - catchAsync.ts, sendResponse.ts, idValidator.ts, etc.
    │   ├── app.ts                                  # Express app setup (parsers, routes, error middleware)
    │   └── server.ts                               # Server entry point & MongoDB connection logic
    ├── .env.example                                # Template Environment variables for local development
    ├── .eslintignore                               # Specifies files and folders to be ignored by ESLint
    ├── .eslintrc.json                              # ESLint configuration for code linting and style enforcement
    ├── .prettierrc.json                            # Prettier configuration for consistent code formatting
    ├── package-lock.json                           # Automatically generated lockfile for reproducible installs
    ├── package.json                                # npm dependencies, devDependencies & useful scripts
    ├── tsconfig.json                               # TypeScript compiler options and project settings
    └── vercel.json                                 # Vercel deployment configuration

```

<br>

## 📋 Requirement Analysis

**MVP Scope (MERN‑style web app)**

| Entity                  | Student                                           | Faculty                          | Admin                                       |
| ----------------------- | ------------------------------------------------- | -------------------------------- | ------------------------------------------- |
| **Authentication**      | Login, logout, change password                    | Login, logout, change password   | Login, logout, change password              |
| **Profile Mgmt**        | Edit permitted fields                             | Edit permitted fields            | Edit permitted fields                       |
| **Academic Procedures** | Enroll in courses, view schedule, grades, notices | Manage grades, view student info | Manage semesters, courses, offerings, rooms |
| **User Mgmt**           | —                                                 | —                                | Create/block/unblock users, reset passwords |

_Full API spec and data structure details provided below._

<br>

## 🗂 Database Schema Overview

A visual representation of the core database models and relationships:

![Database Schema](./analysis-requirements/UniMate-UMS-Database-Schema.png)

> **_Legend:_**
>
> -   **GREEN**: Primary entities (Student, Faculty, Admin)
> -   **PINK**: User & academic structure entities (e.g., Academic Semester, Academic Department etc.)
> -   **YELLOW**: Embedded objects (e.g., Name, Guardian etc.)
> -   **CYAN**: Payloads from client (Offered Course, Semester Registration)

> ⚠️ **Note:**  
> Entities shown under **_Cyan_** have the same names as their database counterparts but differ slightly in structure because they represent client payloads, not direct database models.

<br>

## 📡 API Endpoints

For a complete list of API specifications, including all endpoints and HTTP methods, refer to the **_API Endpoints and CRUD Operation Methods_** section in the [**Requirement-Analysis**](./analysis-requirements/UniMate-UMS-Requirement-Analysis.pdf) document.

<br>

## 🧪 Sample API Testing

Use tools like [**Postman**](https://www.postman.com/) or [**Insomnia**](https://insomnia.rest/) to test APIs.

> ⚠️ **Note:**
>
> 1. Don't forget to prefix all endpoints with **`/api/v1/`**. Refer to the [Requirement Analysis Document](./analysis-requirements/UniMate-UMS-Requirement-Analysis.pdf) for the full list of API routes.
> 2. For all **user-related operations** (admin, faculty, student), the `id` in the API must be the **application-generated user ID**, **not** the MongoDB ObjectId.  
>    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- The user ID starts with a letter indicating user type (`S`, `A`, or `F` for student, admin, and faculty respectively), followed by a 10-digit number.  
>    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Example: `S-2021010001` → 2021 = admission year, `01`/`02`/`03` = semester (spring/summer/fall), and the last 4 digits = serial number.
> 3. For all **other entities** such as Academic Faculty, Academic Department, Management Department, Course, Academic Semester, Semester Registration, Offered Course, etc., use the **MongoDB ObjectId (`_id`)** in the API.

**Sample endpoints:**

-   **Create a student:** `users/create-student` (POST)
-   **Get all students:** `students` (GET)
-   **Get a specific student:** `student/:id` (GET)
-   **Update a specific student:** `student/:id` (PATCH)
-   **Delete a specific student:** `student/:id` (DELETE)  
    <br>

Example:

```
POST    /api/v1/users/create-student
GET     /api/v1/students
GET     /api/v1/students/S-2021010001
PATCH   /api/v1/students/S-2021010001
DELETE  /api/v1/students/S-2021010001
```

<br>

## **🔍 Common Advanced Query Features**

Most GET endpoints (especially those returning lists like students, faculties, departments, courses, etc.) support:

-   **`searchTerm=<keyword>`** — for partial name/code searches
-   **`limit=<number>`** — to limit results per page
-   **`page=<number>`** — to paginate results
-   **`sort=<field>`** — for sorting
-   **Field-based filters** - (e.g., **`gender=male&bloodGroup=B+`**)

Example:

```http
GET   /api/v1/faculties?searchTerm=john&gender=male&page=2&limit=10&sort=name.firstName
```

## 📦 Sample Data

Sample `.json` data files for Student, Faculty, Admin available in [**`sample`**](./server/sample) folder for testing payloads.

<br>

## ✅ Prerequisites

- [**Node.js**](https://nodejs.org/) (v18 or higher recommended)
- [**npm**](https://www.npmjs.com/) (comes with Node.js)
- [**MongoDB**](https://www.mongodb.com/try/download/community) (running locally or accessible remotely)
- A [`.env`](./server/.env.example) file with required environment variables  
  _(See the detailed guide in the [Installation, Configuration and Running Locally](#-installation-configuration-and-running-locally) section below)_

<br>

## 🔧 Installation and Running Locally

### Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/UniMate-UMS.git
    cd UniMate-UMS/server
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    - **_Rename the [`.env.example`](./server/.env.example) file in the `server` folder to `.env`_:**
    
      This file contains the following fields:

        ```env
        NODE_ENV=development
        PORT=5000
        DATABASE_URL=yourDatabaseUser
        BCRYPT_SALT_ROUNDS=12
        DEFAULT_PASS=ChangeMeToASecurePassword!
        ```

    - **_Guide & Configuration Details_:**

        - **`NODE_ENV` (Application Environment):**

            - **_For local testing_**: `development`
            - **_For deployed builds_**: `production`
        
        <br>

        - **`PORT` (Server Port):**

            The port your Express app will listen on
        
        <br>

        - **`DATABASE_URL` (MongoDB Connection String):**

            - **_For a local MongoDB server:_** `mongodb://localhost:27017/unimate`

            - **_For MongoDB Atlas:_** `mongodb+srv://<user>:<pass>@<cluster-url>/<dbname>?retryWrites=true&w=majority&appName=<cluster>` 

                Replace `<user>`, `<pass>`, `<cluster-url>`, `<dbname>` & `<cluster>` with your actual values
        
        <br>

        - **`BCRYPT_SALT_ROUNDS` (Password Hashing Complexity):**
            
            Number of hashing rounds for passwords

            - (integer ≥ 4)            
            - (higher = more secure but slower)
        
        <br>

        - **`DEFAULT_PASS` (Default Admin Password):**
            
            Used only for initial setup—change immediately after first login

        <br>

        > ⚠️ **Caution:** Never commit your `.env` file to version control (GitHub, Git, etc.) as it contains sensitive credentials. Always keep this file private and add `.env` to your [`.gitignore`](./.gitignore).
      

4. **Run the development server:**

    ```bash
    npm run dev
    ```

5. **Build for production:**
    ```bash
    npm run build
    npm run prod
    ```

<br>

## 🌐 Live Deployment

The API is deployed at vercel and can be accessed through [**_this following URL_**](https://unimate-ums-backend.vercel.app/)

<br>

## 📄 License

This project is licensed under the **MIT License** - see the [**_LICENSE_**](LICENSE) file for details.
