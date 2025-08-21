

Saarland Events Application
A full-stack web application designed to be the central hub for discovering and managing events throughout the Saarland region of Germany. The platform allows users to find upcoming events, save favorites, and even submit their own events for review, while providing a comprehensive dashboard for administrators to manage all content.

Features
For Users:
Event Discovery: Browse a comprehensive list of upcoming events with a powerful filtering system. Users can filter by city, category, month, and year.

Detailed Event View: Get all the details for an event, including description, date, time, location on a map (with Leaflet integration), and user reviews.

Search: Quickly find events using a keyword search that looks through titles and descriptions.

User Authentication: Secure registration and login system, including social login with Google (OAuth2).

Password Reset: Users can securely reset their password via an email link.

Favorite Events: Registered users can save events to their personal "Favorites" list for easy access.

Event Submission: Users can submit their own events through a dedicated form, which then go into a moderation queue for admin approval.

Event Reviews: After an event has passed, logged-in users can leave a star rating and a comment.

Reminders: Users can set email reminders for upcoming events.

Multilingual Support: The interface is available in German, English, and Russian, with on-the-fly translation support for event content powered by the DeepL API.

For Admins:
Admin Dashboard: A central dashboard showing key statistics like total events, pending events, total users, and more.

Content Management: Full CRUD (Create, Read, Update, Delete) functionality for events, cities, and categories.

Event Moderation: Admins can approve or reject user-submitted events from a dedicated moderation queue.

User Management: Admins can view a list of all registered users and delete user accounts.

Image Uploads: A secure image upload system for event posters, integrated with a cloud storage provider (Supabase).

Tech Stack
Backend
Framework: Spring Boot 3.3.2

Language: Java 21

Database: PostgreSQL with Spring Data JPA & Hibernate

Security: Spring Security (JWT Authentication & OAuth2 for Google)

APIs: RESTful API architecture

External Services:

DeepL: For language translation

SendGrid: For sending transactional emails (reminders, password resets)

Supabase: For cloud-based image storage

Frontend
Framework: React 19 with Vite

Language: TypeScript

Styling: Tailwind CSS

Routing: React Router v7

State Management: React Hooks & Context API

API Communication: Axios

Internationalization: i18next

Mapping: Leaflet & React-Leaflet

Getting Started
Prerequisites
Java 21+

Maven

Node.js & npm

PostgreSQL Database

Backend Setup
Clone the repository.

Set up the required environment variables in src/main/resources/application.properties for your database connection, JWT secret, and external API keys (DeepL, SendGrid, Supabase, Google OAuth).

Run the application using your IDE or via the command line: ./mvnw spring-boot:run.

Frontend Setup
Navigate to the frontend client directory.

Install dependencies: npm install.

Create a .env file in the client's root directory and set the VITE_API_BASE_URL to point to your running backend (e.g., VITE_API_BASE_URL=http://localhost:8080/api).

Start the development server: npm run dev.