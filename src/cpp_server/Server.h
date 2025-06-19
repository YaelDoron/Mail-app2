#pragma once

#include <vector>
#include <mutex>
#include "storage/BloomFilter.h"
#include "storage/UrlStore.h"

/**
 * @brief TCP Server that handles spam filtering requests using a Bloom Filter and URL storage.
 */
class Server {
    int port;                        ///< Port to listen on
    int serverSocket;               ///< Server socket file descriptor
    BloomFilter filter;             ///< Bloom filter used for URL blacklisting
    UrlStore store;                 ///< Stores the list of blacklisted URLs
    std::mutex dataMutex;           ///< Protects access to Bloom filter and URL file

public:
    /**
     * @brief Constructs the server with given port, Bloom Filter size and hash seeds.
     * @param port Port number for the server to listen on
     * @param seeds Hash function seeds for the Bloom Filter
     */
    Server(int port, const std::vector<int>& seeds);

    /**
     * @brief Starts the server and listens for incoming connections.
     * @return 0 on success, -1 on failure
     */
    int start();

    /**
     * @brief Handles a single client connection.
     * @param client_sock Socket descriptor of the connected client
     */
    void handleClient(int client_sock);
};
