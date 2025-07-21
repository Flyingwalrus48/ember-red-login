# Project Blueprint

## Overview
A comprehensive firefighter career development application focused on helping users get hired in their target fire departments.

## Features

### Feature 4: The "Servicedin" Community Hub (MVP)

* **Objective:** To provide a professional directory where users can find and connect with peers and mentors on the same career path.

* **User Stories:**
  * "As a user, I want to opt-in to making my profile public so I can connect with others."
  * "As a user, I want to search the directory to find other candidates applying to the same city as me."
  * "As a user, I want to find experienced members who are willing to mentor me."

* **Implementation Details:**
  * Add a boolean (true/false) column to the `profiles` table in Supabase called `is_public`.
  * Add optional text fields to the `profiles` table for `linkedin_url` and `other_social_url`.
  * The `ServicedinPage` will only display profiles where `is_public` is true.
  * The "Connect" button will reveal the `linkedin_url` and `other_social_url` fields.