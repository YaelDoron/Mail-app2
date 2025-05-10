import sys
from client import Client
from IO.console_io import ConsoleIO

def main():
    print("[DEBUG] sys.argv:", sys.argv)
    # Check that exactly 2 arguments were passed (IP and port)
    if len(sys.argv) < 3:
        sys.exit(1)

    ip = sys.argv[1]

    port = int(sys.argv[2])

    if port <= 0 or port > 65535:
        sys.exit(1)
   
    # Create and run the client
    io = ConsoleIO()
    client = Client(ip, port, io)
    client.run()

if __name__ == "__main__":
    main()
