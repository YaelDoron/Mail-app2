#include <gtest/gtest.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string>
#include <thread>
#include <chrono>
#include "Server.h"
#include "CommandParser.h"


//Testing that the connection with the server works properly
TEST(ServerTest, AcceptsClientConnection) {
    //Ensure the data directory exists
    std::filesystem::create_directory("data");

    //Create and clear the test files
    std::ofstream clear1("data/test_urls.txt", std::ios::trunc);
    clear1.close();
    std::ofstream clear2("data/test_bloom.txt", std::ios::trunc);
    clear2.close();

    //Create BloomFilter and UrlStore
    BloomFilter filter(1000, {1, 2, 3}, std::hash<std::string>());
    UrlStore store("data/test_urls.txt");
    store.load();  // Loads any existing content (empty after clear)

    //running the server in different tread so it can run at the same time
    std::thread serverThread([](){
        Server server(12345, 1000, {1, 2, 3});
        server.start();

    });
    // preventing the client from trying to connect to the server too soon
    std::this_thread::sleep_for(std::chrono::milliseconds(100));

    int sock = socket(AF_INET, SOCK_STREAM, 0); //creating the socket using IPv4
    if (sock < 0)
    {
        return;
    }
    // Creating the client-side address structure and attempting to connect to the server
    sockaddr_in sin;
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(12345);
    inet_pton(AF_INET, "127.0.0.1", &sin.sin_addr); //converts then string into a network address structure in the af address family
    if (connect(sock,(struct sockaddr *)&sin, sizeof(sin)) < 0)  //if the connection failed, we exit the test 
    {
        return;
    }

    close(sock);
    serverThread.detach();
}

// Test full client-server communication: connection, sending, and receiving response
TEST(ServerTest, ClientServerCommunication) {
    //Ensure the data directory exists
    std::filesystem::create_directory("data");

    //Create and clear the test files
    std::ofstream clear1("data/test_urls.txt", std::ios::trunc);
    clear1.close();
    std::ofstream clear2("data/test_bloom.txt", std::ios::trunc);
    clear2.close();

    //Create BloomFilter and UrlStore
    BloomFilter filter(1000, {1, 2, 3}, std::hash<std::string>());
    UrlStore store("data/test_urls.txt");
    store.load();  // Loads any existing content (empty after clear)

   //running the server in different tread so it can run at the same time
   std::thread serverThread([](){
    Server server(12345, 1000, {1, 2, 3});
    server.start();

    });
    // preventing the client from trying to connect to the server too soon
    std::this_thread::sleep_for(std::chrono::milliseconds(100));

    int sock = socket(AF_INET, SOCK_STREAM, 0); //creating the socket using IPv4
    if (sock < 0)
    {
        return;
    }
    // Creating the client-side address structure and attempting to connect to the server
    sockaddr_in sin;
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(12345);
    inet_pton(AF_INET, "127.0.0.1", &sin.sin_addr); //converts then string into a network address structure in the af address family
    if (connect(sock,(struct sockaddr *)&sin, sizeof(sin)) < 0)
    {
        return;
    }
    // creating communication between the client and the server off adding url and then checking the same one
    const char* firstMessage = "POST www.test.com\n";
    send(sock, firstMessage, strlen(firstMessage), 0);
    char buffer[1024] = {0};
    recv(sock, buffer, sizeof(buffer), 0);

    const char* secondMessage = "GET www.test.com\n";
    send(sock, secondMessage, strlen(secondMessage), 0);
    memset(buffer, 0, sizeof(buffer));
    recv(sock, buffer, sizeof(buffer), 0); //initiallizing the buffer

    EXPECT_STREQ(buffer, "200 OK\n\ntrue true");  // We expect it to return true true beacause we first added the Url and the checked

    close(sock);
    serverThread.detach();

}
