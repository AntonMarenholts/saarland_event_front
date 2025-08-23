```markdown
# Saarland Events - Client Application

## About The Project

This is the frontend for the **"Saarland Events"** web application, built with **React** and **TypeScript**. The application provides a user-friendly interface for discovering events and a powerful dashboard for administrators to manage all content.

### ✨ **Live Demo Link:** [https://www.saarland-events-new.de/](https://www.saarland-events-new.de/) ✨

## Screenshots

*(You can insert 2-3 screenshots of your application here)*

![Main Page](https://i.imgur.com/your-screenshot-1.png)
_The main page with event filters_

![Event Detail Page](https://i.imgur.com/your-screenshot-2.png)
_The event detail page with an interactive map_

## Key Features

* **Search and Filtering:** A powerful system to filter events by city, category, date, and keywords.
* **Responsive Design:** The interface looks and works great on all devices, from desktops to mobile phones.
* **Authentication:** Secure registration and login, including social login with Google (OAuth2) and password recovery.
* **Interactive Experience:** Users can add events to their favorites, leave reviews, and set email reminders.
* **Multi-language Support:** The interface is available in German, English, and Russian, with on-the-fly language switching.
* **Admin Dashboard:** A full-featured dashboard for managing all aspects of the site, including moderating user-submitted events.

## Tech Stack

* **Framework:** React 19 (with Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Routing:** React Router
* **API Communication:** Axios
* **Internationalization:** i18next
* **Maps:** Leaflet & React-Leaflet

## Getting Started

### Prerequisites

* Node.js & npm
* A running instance of the backend (API)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd events-client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    You need to create two files in the root of the project:

    * `.env.development` (for local development)
    * `.env.production` (for the production build)

    **Contents of `.env.development`:**
    ```
    VITE_API_BASE_URL=http://localhost:8080/api
    VITE_GOOGLE_LOGIN_URL=http://localhost:8080/oauth2/authorization/google
    ```

    **Contents of `.env.production`:**
    ```
    VITE_API_BASE_URL=[https://api.saarland-events-new.de/api](https://api.saarland-events-new.de/api)
    VITE_GOOGLE_LOGIN_URL=[https://api.saarland-events-new.de/oauth2/authorization/google](https://api.saarland-events-new.de/oauth2/authorization/google)
    ```

### Running the Application

To run the app in development mode, execute:
```bash
npm run dev