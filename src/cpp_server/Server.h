#pragma once

#include <vector>
#include <mutex>
#include "storage/BloomFilter.h"
#include "storage/UrlStore.h"


//TCP Server that handles spam filtering requests using a Bloom Filter and URL storage.
class Server {
    int port; 
    int serverSocket;
    BloomFilter filter;
    UrlStore store;
    std::mutex dataMutex;

public:
    //Constructs the server with given port, Bloom Filter size and hash seeds.
    Server(int port, int filterSize, const std::vector<int>& seeds);

    //Starts the server and listens for incoming connections.
    int start();

    //Handles a single client connection.
    void handleClient(int client_sock);
};