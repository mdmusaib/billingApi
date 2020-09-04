const http = require("http");
const path = require("path");
const express = require("express");

const serverApp = require("./app");
const serverPort = 9000;

const server = http.createServer(serverApp);
server.listen(serverPort);
