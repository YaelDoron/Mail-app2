#pragma once
#include <vector>             
#include "storage/BloomFilter.h"      
#include "storage/UrlStore.h"

class Server {
    int port;
    int serverSocket;
    BloomFilter filter;
    UrlStore store;

public:
    Server(int port, int filterSize, const std::vector<int>& seeds); // constructor
    int start();
    void handleClient(int client_sock);
};