#include "Server.h"
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <cstdlib>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 4) {
    // Require at least port, filterSize, and one seed
        return 1;
    }

    int port = std::atoi(argv[1]);
    int filterSize = std::atoi(argv[2]);
    if (port <= 0 || port > 65535) {
    // Invalid port number
        return 1;
}

    vector<int> seeds;
    for (int i = 3 ; i < argc; ++i) {
    // Collect seed values for Bloom Filter
        seeds.push_back(atoi(argv[i]));
    }
    // Initialize and start the server
    Server server(filterSize, seeds);
    return server.start();
}
