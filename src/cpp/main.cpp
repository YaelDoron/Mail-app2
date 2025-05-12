#include "Server.h"
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <cstdlib>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 4) {
        return 1;
    }

    int port = std::atoi(argv[1]);
    int filterSize = std::atoi(argv[2]);
    if (port <= 0 || port > 65535) {
        return 1;
}

    vector<int> seeds;
    for (int i = 3 ; i < argc; ++i) {
        seeds.push_back(atoi(argv[i]));
    }

    Server server(port, filterSize, seeds);
    return server.start();
}
