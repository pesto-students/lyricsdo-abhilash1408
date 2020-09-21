# Instruction

You need to create a Lyrics app to show song lyrics.

# Features

- User should be able to search songs based on artist name or song title words.
- On `Search` button click event, show list of matched songs based on user input.
- Support Pagination functionality. User should be able to go to next page and previous page.
- On `Show Lyrics` button click event, show that song's lyrics.

# Lyrics API Document

https://lyricsovh.docs.apiary.io/#

Endpoint to get song suggestions is not mentioned in API doc. mentioning it here.
https://api.lyrics.ovh/suggest/inputQuery

`inputQuery` is path parameter. Replace `inputQuery` with actual word(ex. stairway)

# Additional feature

- You will get more points for writing test cases

# Restrictions

- You need to use pure HTML, CSS, and JavaScript to build this application.
- No other frameworks/libraries(ex. React, Angular, SCSS, etc) is allowed.
- Development libraries and dependencies are allowed and recommended
  For example:
  - Jest + helpers(for testing purpose)
  - ESLint + Airbnb (for linting purpose)
- Do not remove or rename existing files and folder. you can add new files and folder though.

# Commands

- Run `npm run develop` to run app locally
