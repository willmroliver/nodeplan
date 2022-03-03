--- NODEPLAN WORK-SCHEDULING APP ---

This project is in-progress Node/Express/MongoDB/EJS app to showcase my current skillbase.
Hosted with Heroku - Go visit! ---> https://node-plan.herokuapp.com/

MOBILE USERS -  Unfortunately I have been so far unable to get the calendar to behave properly on mobile.
                It has full functionality but calendar cell sizing varies with the number of events on a given date.
                When no events are contained in a month, this causes the calendar to collapse.



--- CURRENT FEATURES ---

Development began 28/02/2022, so current features are limited. Through the site, the user can:
    - View a calendar which I've hard-coded using EJS and Vanilla JS
    - Add events which are saved to a MongoDB Atlas and can be viewed on the calendar
    - Click on calendar events to see further details
    - Modify and delete events on further details page.



--- TODO ---

The next immediate features to be added will be:
    - User Accounts, Authentication, etc.
    - Use Google API to show event location on a map
    - Add buttons to scroll through to different months on the calendar
    - Make sensible restrictions to INSERTing new events (to avoid name-time clashes, etc.)
    - Improve Look and Feel with further CSS formatting (very little styling has been done, focus is on functionality)