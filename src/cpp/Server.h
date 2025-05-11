#pragma once
#include <vector>             
#include "storage/BloomFilter.h"      
#include "storage/UrlStore.h"

class Server {
    std::string ip;
    int port;
    int serverSocket;
    BloomFilter filter;
    UrlStore store;

public:
    Server(const std::string& ip,int port, int filterSize, const std::vector<int>& seeds); // constructor
    int start();
    void handleClient(int client_sock);
};