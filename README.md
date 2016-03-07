# pebbleship

This [SailsJS](http://sailsjs.org) application controls the gameplay of the Battleship clone *pebbleship*. The gameplay is controlled via a REST API.

The idea for the server is to have a central instance where multiple players play against each other in a future version of the game. Interaction with the server is done with the ```pebbleship-cli```, which forms an abstraction layer above the server's REST API.

## Installation

Run ```npm install``` to install the dependencies.

## Starting the game

First start the server with

```
npm start
```

To play the game run

```
node lib/pebbleship-cli
```

The CLI connects to the server and provides you with a prompt where you can enter a cell (e.g., "A5").

## API Documentation

After the server is started the API documentation is available at ```http://localhost:1337```.

To create the documentation from the source code you have to install ```apidoc``` first:

```
sudo npm install -g apidoc
```

Afterwards run ```npm run create-docs``` to generate the documentation in ```./assets```.

## Code structure

### Server

The API endpoints are located at ```./api/controllers```. The gameplay logic is encapsulated in ```./lib/sails-pebbleship```, which is injected as a service into the controllers in ```./api/services/Pebbleship.js```. The definition of the grid and ship models is stored in ```./api/models```. The rest of the files in this respository is boilerplate code from SailsJS.

### CLI

The CLI is located at ```./lib/pebbleship-cli```.

## Docker setup

The repository contains a ```Dockerfile``` to create a Docker image for pebbleship. Run

```
docker build -t local/pebbleship-server .
```

to build the image and

```
docker run -p 1337:1337 local/pebbleship-server
```

to start it as a Docker container. You can now connect to the server with the ```pebbleship-cli```.

## Development setup

To start a development server with live reloading functionality on a code change use ```npm run dev```. It uses ```nodemon``` as a prerequisite which has to be installed with ```npm install -g nodemon``` first.
