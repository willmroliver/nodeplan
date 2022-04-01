--- NODEPLAN WORK-SCHEDULING APP ---

This project is in-progress Node/Express/MongoDB/EJS app to showcase my current skillbase.
Hosted with Heroku - Go visit! ---> https://node-plan.herokuapp.com/

Development began on 28/02/2022.


--- CURRENT FEATURES ---

Current user features are:
    - Create their own account.
    - View a calendar which I've hard-coded using Vanilla JS/EJS.
    - Add events which are saved to a MongoDB Atlas and can be viewed on the calendar.
    - View location of events on Google Maps (uses the Maps and Geocoder APIs).
    - Click on calendar events to see further details.
    - Modify and delete events on further details page.
General features of the site:
    - User passwords are stored securely:
        SHA-256 hashing, 10 rounds of salting .
        256-bit cryptographically secure pseudo-random salts.
    - User sessions are maintained using Passport.js.
    - Environment variables secured using dotenv. 


--- LATEST COMMIT DETAILS ---

    - User Accounts are now fully functional!:
        Events are added with user IDs.
        Users access their own event collections through their account session (see below).
    - Passport.js for user sessions! Cookies now used to keep account logged in.


--- TODO ---

The next immediate features to be added will be:
    - Add greater user-customization, event-searching and activity summaries on the home-page.
    - Improve Look and Feel with further CSS formatting (very little styling has been done, focus is on functionality).
    - Make some restrictions to INSERTing new events (to avoid name-time clashes, etc.).