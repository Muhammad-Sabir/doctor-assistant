# Doctor Assistance - Mobile Frontend

## Run Application

1. **Navigate to the frontend project directory**:
    ```bash
    cd doctor-assistance-mobile
    ```

2. **Install Dependencies:**
   Install all the required packages using:
   ```bash
   npm install
   ```

3.  **Create a `.env` file** 
    In root directory (`/doctor-assistance-mobile`) replace the .env.template with .env and fill its fields with the backend base url (ngrok url)

4.  **Add the ngrok path in the `.env` file in `/doctor-assistance-be` folder** 
   Add the ngrok path in the ALLOWED_HOSTS variable in .env file of (`/doctor-assistance-be`) folder

4. **Start the project**:
    ```bash
    npx expo start -c --tunnel  
    ``` 
