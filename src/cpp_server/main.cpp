#include "Server.h"
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <cstdlib>

using namespace std;

/**
 * 
 * Expected command-line arguments:
 *   argv[1] - Port number (e.g. 12345)
 *   argv[2] - Bloom Filter size
 *   argv[3+] - Hash seeds for the Bloom Filter
 */
int main(int argc, char* argv[]) {
    if (argc < 4) {
        cerr << "Usage: " << argv[0] << " <port> <filterSize> <seed1> [seed2] ..." << endl;
        return 1;
    }

    int port = std::atoi(argv[1]);
    int filterSize = std::atoi(argv[2]);

    if (port <= 0 || port > 65535) {
        cerr << "Error: Invalid port number." << endl;
        return 1;
    }

    vector<int> seeds;
    for (int i = 3; i < argc; ++i) {
        seeds.push_back(std::atoi(argv[i]));
    }

    // Initialize and start the TCP server
    Server server(port, filterSize, seeds);
    return server.start();
}