#pragma once
#include IO.h

class Server {
    int port;
    int serverSocket;
    BloomFilter filter;
    UrlStore store;
    IO& io;

public:
    Server(int port, int filterSize, const std::vector<int>& seeds,IO& io); // constructor
    int start();
    void handleClient(int client_sock);
};