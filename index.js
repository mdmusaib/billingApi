const http = require("http");
const path = require("path");
const express = require("express");

const serverApp = require("./app");
const serverPort = process.env.PORT || 8080;

const server = http.createServer(serverApp);
server.listen(serverPort);
