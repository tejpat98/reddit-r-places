# Reddit /r/place game

## Description

This is a remake/clone of a popular game found on [reddit.com/r/place](https://www.reddit.com/r/place/).

Made using NextJS, MongoDB and Socket.io.

The user is given a canvas from which they can select a pixel, and set a colour for that pixel. These changes are then sent and displayed in real time to all connected users via socket.io.

By default the grid is 500 by 500, it can made much bigger by setting gridSize in rplace-config.js

## Instructions

1.  Setup a MongoDB instance
2.  Set MONGODB_URI and DB_NAME
3.  At the root of the directory

        npm install
        npm run build
        npm run start

    ... or for dockerised version

            docker build -t reddit-r-place .
            docker run -dp 3000:3000 reddit-r-place

4.  http://localhost:3000

## Contributing

You are free to use this code as you wish.
This project is complete enough to be usable, but here are some things that could be improved / added:

- [ ] Zoom on pointer
- Either...
  - [ ] Migrate to a redis DB (for more performace)
  - [ ] Add more data e.g. change timestamps, users, cooldowns (per user/pixel)
- [ ] The client will track all the pixel changes it receives from the server in a useState called PixelChanges (/src/components/RedditPlaces.tsx lines 12 and 33), after a change is applied to gridData (Canvas.tsx line 18) it is no longer needed. Set PixelChanges to a filtered array (using setPixelChanges) that excludes changes that have already been applied to gridData.
