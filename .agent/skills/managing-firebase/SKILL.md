---
name: managing-firebase
description: Provides instructions and workflows for using the firebase-mcp-server to manage Firebase projects, init services, create apps, and access Google Developer documentation. Use this skill when the user asks to integrate, build, or deploy with Firebase.
---

# Managing Firebase

## When to use this skill
- Integrating a new or existing app with Firebase services (Auth, Database, Storage, Hosting).
- Initializing Firebase configurations (`mcp_firebase-mcp-server_firebase_init`).
- Authenticating or logging into Firebase CLI/tools.
- Creating and managing Firebase Projects and Apps (iOS, Android, Web).
- Searching Google developer knowledge (Firebase, Google Cloud, Android, etc.).

## Workflow

### 1. Authentication & Environment Check
- Before starting, make sure you are authenticated. Check the environment with `mcp_firebase-mcp-server_firebase_get_environment`.
- If the user is missing credentials or auth fails, run `mcp_firebase-mcp-server_firebase_login` and provide the `authCode` after the user handles the login flow.
- Ensure you have the `active_project` mapped to your project directory using `mcp_firebase-mcp-server_firebase_update_environment`.

### 2. Project Setup
- **List / Get**: Check available projects with `mcp_firebase-mcp-server_firebase_list_projects` or current setup via `mcp_firebase-mcp-server_firebase_get_project`.
- **Create Project**: If they don't have a Firebase project, use `mcp_firebase-mcp-server_firebase_create_project`.
- **Create App**: To connect the code to Firebase, use `mcp_firebase-mcp-server_firebase_create_app` (specify `platform` as `web`, `ios`, or `android`). 

### 3. Service Initialization
- Run `mcp_firebase-mcp-server_firebase_init` to define which features (Firestore, Auth, Storage, Hosting, Database, DataConnect, or AILogic) to set up in the current directory.
- This manages the `firebase.json` creation/updates for you.
- Always check the configurations and remind the user that they will need to run the `firebase deploy` bash command if they need to push the initialized config natively.

### 4. Fetching Developer References
- If unsure about a tool implementation, security rule, or SDK snippet, call `mcp_firebase-mcp-server_developerknowledge_search_documents` with your query to get the Firebase documentation.
- When you find a helpful document, pull the full content with `mcp_firebase-mcp-server_developerknowledge_get_documents` before integrating code.

## Resources
- Rely on `firebase-mcp-server` MCP tools.
- Consult Google Developer documentation through the MCP knowledge tools to verify correct SDK usage.
