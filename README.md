# URL Filtering System Using a Bloom Filter

## Overview
This project implements a URL filtering system based on a Bloom Filter.  
It allows:
- Adding URLs to a blacklist.
- Checking whether a URL might be blacklisted (probabilistic check).
- Persisting the Bloom Filter and the URL list across sessions.
- Running all functionalities via a command-line interface.

The program is now implemented as a client-server system:
- The server (C++) runs and listens on a given port.
- The client (Python) connects to the server and sends commands (POST, GET, DELETE).

The server handles:
- URL insertion (POST)
- URL query (GET)
- URL deletion (DELETE)

It uses C++17, GoogleTest for unit tests, CMake for building, and Docker for containerized execution.

## Code Design and Future Flexibility
As the system evolves, we continue to structure the code according to core software engineering principles, with special attention to loose coupling and the SOLID principles. This enables us to easily extend the codebase while minimizing the need to modify existing components. The following points address key design considerations from this assignment:
- Changing Command Names - The mapping from command names to actions is handled in a centralized CommandParser. Thanks to this separation of concerns (designed in Assignment 1), updating command names required changes only in the parser, without touching any command logic.
- Adding New Commands - We followed the Open/Closed Principle by implementing each command as a separate class inheriting from a common iCommand interface. The new DELETE command was added simply by creating a new class (DeleteUrl) and registering it in the parser.
- Changing Output Format - The addition of status codes like 200 Ok, 201 Created, and 400 Bad Request was handled in the CommandParser, which serves as a centralized coordinator. This allowed us to extend output behavior without modifying individual command implementations.
- Switching from Console to Socket I/O - In Assignment 1, input was received from the console. In this assignment, we switched to socket-based communication between a Python client and a C++ server. This required refactoring the way commands are received and responses are sent. However, most of the command logic remained untouched, as the changes were isolated to the networking layer and integration with CommandParser. This separation ensured minimal impact on the core logic.
- upporting Multiple Clients - Not yet implemented, but the code is ready for extension.
Currently, the server handles only one client at a time. However, the client-handling logic is isolated in a dedicated method (handleClient), making it straightforward to adapt it in the future. The architecture anticipates future support for concurrent clients with minimal changes to existing logic.

## How to Build and Run
First, build the Docker image by executing:

```bash
docker-compose build --no-cache
```

Then, use this command to run the C++ server:

```bash
docker-compose run server <port> <filterSize> <seed1> <seed2> ...
```
Arguments:
- port: Port number the server will listen on
- filterSize: Number of bits in the Bloom Filter
- seed1> <seed2> ... : One or more seed values for the hash functions

Use this command to run the Python client:

```bash
docker-compose run client <server_ip> <port>
```
Arguments:
- server_ip: IP address of the server
- port: Port number (must match the server's port)


## Running tests
Build the Docker image if you haven’t done it yet.  
And then execute:

```bash
docker-compose run test
```

## How to Use the Program

Once both the server and client are running, you can interact with the system by entering commands in the client terminal.

Commands explanation:
- POST <url> - Adds the given URL to the blacklist.<br>
Response: '201 Created'
- GET <url> - Checks if the URL is possibly in the blacklist using the Bloom Filter.<br>
Response - '200 Ok' followed by a single line with two values:<br>
First value: the result from the Bloom Filter (if it's false then there won't be a second value)<br>
Second value: the actual presence in the URL store
- DELETE <url>
Removes the given URL from the store.<br>
Response: '204 No Content' if deleted successfully, or '404 Not Found' url wasn't added.

In any case where an invalid or unrecognized command is received, the server should ignore it and respond to the client with:
'400 Bad Request'

Examples:

![Example](https://github.com/user-attachments/assets/186a82c6-6f1b-4342-98b1-6b8560f0b9f0)

![Example](https://github.com/user-attachments/assets/0d1bc468-4c7f-4d30-94d5-75e172af955f)

## Notes
- False positives may occur.
- False negatives cannot happen.
- After each command, the filter is automatically saved to disk (`data/bloom.txt`) and the URLs are saved in (`data/urls.txt`).

[Team Meeting Documentation](https://docs.google.com/document/d/13VuUzQ-KDu7Q3zzVhvA42WCy0XEnrzZqYtl7023NFDo/edit?tab=t.0)
