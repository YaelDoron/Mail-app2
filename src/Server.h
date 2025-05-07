#pragma once

class Server {
    int port;
public:
    Server(int port); // constructor
    int start();
};