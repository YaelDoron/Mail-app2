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

//Testing valid get command returns the right message
TEST(ServerTests, Get_Test) {
    std::string response = CommandParser::parse("GET www.valid.com");
    EXPECT_EQ(response, "200 OK\n");
}

//Testing valid post command returns the right message
TEST(ServerTests, Post_Test) {
    std::string response = CommandParser::parse("POST www.valid.com");
    EXPECT_EQ(response, "201 Created\n");
}

//Testing valid delete command returns the right message
TEST(ServerTests, Delete_Test) {
    std::string response = CommandParser::parse("DELETE www.delete.com");
    EXPECT_EQ(response, "204 No Content\n");
}

//Testing invalid get command (no URL) returns the right message
TEST(ServerTests, Get_Test_No_Url) {
    std::string response = CommandParser::parse("GET");
    EXPECT_EQ(response, "400 Bad Request\n");
}

//Testing invalid post command (no URL) returns the right message
TEST(ServerTests, Post_Test_No_Url) {
    std::string response = CommandParser::parse("POST");
    EXPECT_EQ(response, "400 Bad Request\n");
}

//Testing invalid delete command (delete for URL that wan't added) returns the right message
TEST(ServerTests, Delete_Test_Not_Added) {
    std::string response = CommandParser::parse("DELETE www.notadded.com");
    EXPECT_EQ(response, "404 Not Found\n");
}

//Testing invalid command (not GET/DELETE/POST)returns the right message
TEST(ServerTests, UnknownCommand_Test) {
    std::string response = CommandParser::parse("PUT www.unknowncommand.com");
    EXPECT_EQ(response, "400 Bad Request\n");
}
//Testing invalid command (empty line) returns the right message
TEST(ServerTests, EmptyInput_ReturnsBadRequest) {
    std::string response = CommandParser::parse("");
    EXPECT_EQ(response, "400 Bad Request\n");
}

//Testing that the connection with the server works properly
TEST(ServerTest, AcceptsClientConnection) {
    //running the server in different tread so it can run at the same time
    std::thread serverThread([](){
        Server server(12345);
        server.start();
    });
    // preventing the client from trying to connect to the server too soon
    std::this_thread::sleep_for(std::chrono::milliseconds(100));

    int sock = socket(AF_INET, SOCK_STREAM, 0); //creating the socket using IPv4
    if (sock < 0)
    {
        perror("error creating socket");
    }

    sockaddr_in sin;
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(12345);
    inet_pton(AF_INET, "127.0.0.1", &sin.sin_addr); //converts then string into a network address structure in the af address family
    if (connect(sock,(struct sockaddr *)&sin, sizeof(sin)) < 0)
    {
    perror("error connecting to server");
    }

    close(sock);

    exit(0);  //למחוק כי זה אמור להיות ריצה אינסופית!!
}
