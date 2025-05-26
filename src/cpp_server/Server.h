#pragma once
#include <vector>
#include <mutex>     
#include "storage/BloomFilter.h"      
#include "storage/UrlStore.h"

class Server {
    int port;
    int serverSocket;
    BloomFilter filter;
    UrlStore store;
    std::mutex dataMutex;  // Protects access to the files

public:
    Server(int port, int filterSize, const std::vector<int>& seeds); // constructor
    int start();
    void handleClient(int client_sock);
};