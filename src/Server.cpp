#include "Server.h"
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>

Server::Server(int port) : port(port) {}

int Server::start() {
    return 0;
}