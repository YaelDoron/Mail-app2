#include "Server.h"
#include "CommandParser.h"
#include "commands/LoadFromFilter.h"
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <vector>
using std::vector;


#define MAX_CLIENTS 1

//creating the server with the given arguments and uninitialized server socket 
Server::Server(const std::string& ip, int port, int filterSize, const vector<int>& seeds)
    : ip(ip), port(port),
      serverSocket(-1),
      filter(filterSize, seeds, std::hash<std::string>()),
      store("data/urls.txt")
{
    vector<bool> loadedBits;
    LoadFromFilter loader("data/bloom.txt", loadedBits);
    loader.execute();
    if (!loadedBits.empty()) {
        filter.setFilter(loadedBits);
        std::cout << "[DEBUG] Loaded " << loadedBits.size() << " bits from bloom filter" << std::endl;
    } else {
        std::cout << "[DEBUG] No bloom filter data loaded or file doesn't exist yet" << std::endl;
    }

    store.load();
    std::cout << "[DEBUG] URL store loaded" << std::endl;
}


// Starts the server: creates the socket, binds it to the given port, listens for a single client,
// and passes the connection to a handler.
int Server::start() {
    // Creating the server's TCP socket
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) {
        close(serverSocket);
        return -1;
    }

    // Setting up the address struct
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    inet_pton(AF_INET, ip.c_str(), &sin.sin_addr);
    sin.sin_port = htons(port);

    // Binding the socket to the chosen port
    if (bind(serverSocket, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        close(serverSocket);
        return -1;
    }

    // Start listening
    if (listen(serverSocket, MAX_CLIENTS) < 0) {
        close(serverSocket);
        return -1;
    }

    std::cout << "[DEBUG] Server is listening on port " << port << std::endl;

    while (true) {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);

        int client_sock = accept(serverSocket, (struct sockaddr *) &client_sin, &addr_len);
        if (client_sock < 0) {
            std::cerr << "[ERROR] Failed to accept connection\n";
            continue;
        }

        std::cout << "[DEBUG] New client connected\n";
        handleClient(client_sock);
        close(client_sock); // close only the client socket, not the server socket
    }

    close(serverSocket);
    return 0;
}
// Handles communication with a single client over an open socket.
// Isolated for future scalability to support multiple clients concurrently.
void Server::handleClient(int client_sock) {
    // Receive a message from the client
    char buffer[4096]={0};
    while (true) {
        int expected_data_len = sizeof(buffer);
        int read_bytes = recv(client_sock, buffer, expected_data_len, 0);
        // If a message was received, we send the response to the client
        if (read_bytes == 0) {
        // connection is closed
        break;
        }
        else if (read_bytes < 0) {
        continue;
        }
        std::string command(buffer);
        std::cout << "[DEBUG] Received command: " << command << std::endl;
        CommandParser parser(filter, store);
        std::string response = parser.Parse(command);
        std::cout << "[DEBUG] Responding with: " << response << std::endl;
        send(client_sock, response.c_str(), response.length(), 0);
        
        memset(buffer, 0, sizeof(buffer));
    }
    // Close sockets
    close(client_sock);
}
