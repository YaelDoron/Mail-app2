#include "Server.h"
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
//creating the server with the given arguments and uninitialized server socket 
Server::Server(int port, int filterSize, const vector<int>& seeds,IO& io)
    : port(port),
      serverSocket(-1),
      filter(filterSize, seeds, std::hash<std::string>()),
      store("/usr/src/mytest/data/urls.txt"),
      io(io)
{
    vector<bool> loadedBits;
    LoadFromFilter loader("/usr/src/mytest/data/bloom.txt", loadedBits);
    loader.execute();
    if (!loadedBits.empty()) {
        filter.setFilter(loadedBits);
    }

    store.load();
}


// Starts the server: creates the socket, binds it to the given port, listens for a single client,
// and passes the connection to a handler.
int Server::start() {
    // Creating the server's TCP socket
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) {
        return;
    }
    // Setting up the address struct
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);
    // Binding the socket to the chosen port
    if (bind(serverSocket, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        return;
    }
    // Start listening for client connections
    if (listen(serverSocket, 5) < 0) {
        return;
    }
    // Accept a client connection
    struct sockaddr_in client_sin;
    unsigned int addr_len = sizeof(client_sin);
    int client_sock = accept(serverSocket,  (struct sockaddr *) &client_sin,  &addr_len);
    if (client_sock < 0) {
        return;
    }
    handleClient(client_sock);
    close(serverSocket);
    return 0;
}
// Handles communication with a single client over an open socket.
// Isolated for future scalability to support multiple clients concurrently.
void Server::handleClient(SocketIO& clientSocketIO) {
    // Receive a message from the client
    while (true) {
        std::string read_bytes = clientSocketIO.getInput();
        if (read_bytes.empty()) {
        // Client closed connection or sent nothing
        break;
        }
    
        std::string response = CommandParser(filter, store).Parse(read_bytes);
        clientSocketIO.displayOutput(response);
    }
}