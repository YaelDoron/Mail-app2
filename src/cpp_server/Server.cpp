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
#include <thread>

using std::vector;

#define MAX_CLIENTS 1

// ✅ בנאי: מקבל פורט אמיתי (לא מקובע), גודל פילטר וזרעים
Server::Server(int port, const vector<int>& seeds)
    : port(port),
      serverSocket(-1),
      filter(1000, seeds, std::hash<std::string>()),
      store("data/urls.txt")
{
    vector<bool> loadedBits;
    LoadFromFilter loader("data/bloom.txt", loadedBits);
    loader.execute();

    if (!loadedBits.empty()) {
        filter.setFilter(loadedBits);
    }

    store.load();
}

int Server::start() {
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) {
        perror("Socket creation failed");
        return -1;
    }

    // מאפשר הפעלה מחדש של השרת מיידית בלי שגיאת "Address already in use"
    int opt = 1;
    setsockopt(serverSocket, SOL_SOCKET, SO_REUSEADDR | SO_REUSEPORT, &opt, sizeof(opt));

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port); // ✅ שימוש בפורט מהמשתמש

    if (bind(serverSocket, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("Bind failed");
        close(serverSocket);
        return -1;
    }

    if (listen(serverSocket, MAX_CLIENTS) < 0) {
        perror("Listen failed");
        close(serverSocket);
        return -1;
    }

    std::cout << "[Server] Listening on port " << port << std::endl;

    while (true) {
        struct sockaddr_in client_sin;
        socklen_t addr_len = sizeof(client_sin);
        int client_sock = accept(serverSocket, (struct sockaddr *) &client_sin, &addr_len);
        if (client_sock < 0) {
            perror("Accept failed");
            continue;
        }

        std::thread t([this, client_sock]() {
            this->handleClient(client_sock);
        });
        t.detach();
    }

    close(serverSocket);
    return 0;
}

void Server::handleClient(int client_sock) {
    char buffer[4096] = {0};

    while (true) {
        int read_bytes = recv(client_sock, buffer, sizeof(buffer), 0);
        if (read_bytes == 0) {
            break;
        } else if (read_bytes < 0) {
            continue;
        }

        std::string command(buffer);
        std::lock_guard<std::mutex> lock(dataMutex);

        CommandParser parser(filter, store);
        std::string response = parser.Parse(command);
        send(client_sock, response.c_str(), response.length(), 0);
        memset(buffer, 0, sizeof(buffer));
    }

    close(client_sock);
}
