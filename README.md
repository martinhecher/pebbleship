# pebbleship-server


## Development setup

To start a development server with reloading functionality use ```npm run dev```. It uses ```nodemon``` as a prerequisite which has to be installed with ```npm install -g nodemon``` first.

## Notes

* The used API framework [Sails](http://sailsjs.org) only supports a subset of ES6 features available in NodeJS 4.x. Block-scoped declaratione (let, const, class, etc.) are not supported. That's the reason for still using 'var' instead of 'let'.
