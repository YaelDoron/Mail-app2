import socket
import sys

HOST = "172.28.0.2"

def main(serverPort):
    # Create TCP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        # Connect to the server
        sock.connect((HOST, serverPort))

        while True:
            msg = input()

            # Replace empty input with a placeholder
            if not msg.strip():
                msg = "<EMPTY>"

            # Send the message
            data = msg.encode('utf-8')
            sock.send(data)
            # Receive and print the response
            response = sock.recv(4096).decode('utf-8')
            print(response)

    # Exit the program if an error occurs
    except Exception:
        sys.exit(1)

    # Ensure the socket is closed in any case
    finally:
        sock.close()

if __name__ == "__main__":
    # Expecting exactly 2 arguments: IP and port
    if len(sys.argv) != 3:
        sys.exit(1)
        
    serverIp = sys.argv[1]
    serverPort = int(sys.argv[2])
    main(serverPort)