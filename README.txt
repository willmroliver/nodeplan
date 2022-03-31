--- NODEPLAN WORK-SCHEDULING APP ---

This project is in-progress Node/Express/MongoDB/EJS app to showcase my current skillbase.
Hosted with Heroku - Go visit! ---> https://node-plan.herokuapp.com/


--- CURRENT FEATURES ---

Development began 28/02/2022; current user features are:
    - Create an account with a securely hashed and salted password (SHA-256, 10 rounds of salting with 32-byte salts).
    - View a calendar which I've hard-coded using Vanilla JS/EJS.
    - Add events which are saved to a MongoDB Atlas and can be viewed on the calendar.
    - View location of events on Google Maps (uses the Maps and Geocoder APIs).
    - Click on calendar events to see further details.
    - Modify and delete events on further details page.


--- LATEST COMMIT DETAILS ---

    - Passport.js for user sessions! Cookies now used to keep account logged in.


--- TODO ---

The next immediate features to be added will be:
    - Make sensible restrictions to INSERTing new events (to avoid name-time clashes, etc.).
    - Improve Look and Feel with further CSS formatting (very little styling has been done, focus is on functionality).