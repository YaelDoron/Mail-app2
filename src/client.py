import socket

class Client:
    # Store server details and create a TCP socket
    def __init__(self, server_ip, server_port):
        self.server_ip = server_ip
        self.server_port = int(server_port)
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def run(self):
        # Connect to the server
        self.sock.connect((self.server_ip, self.server_port))
        # Get the first command from the user.
        msg = input()  

        while not msg == 'quit':
            # Send the command to the server.
            self.sock.send(bytes(msg, 'utf-8')) 
            # Wait for the server's response and display it.
            data = self.sock.recv(4096)  
            print(data.decode('utf-8'))  
            # Prompt for the next command.
            msg = input()

        self.sock.close()    

