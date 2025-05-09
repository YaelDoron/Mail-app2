import socket

class Client:
    # Store server details and create a TCP socket
    def __init__(self, server_ip, server_port, io):
        self.server_ip = server_ip
        self.server_port = server_port
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.io = io

    def run(self):
        # Connect to the server
        try:
            self.sock.connect((self.server_ip, self.server_port))

            while True:
                # Get the command from the user.
                msg = self.io.get_input()
                # Send the command to the server.
                self.sock.send(msg.encode('utf-8'))
                # Wait for the server's response and display it.
                data = self.sock.recv(4096)  
                self.io.display_output(data.decode('utf-8'))
        except:
            # exit if connection fails 
            return  
         
        finally:   
            self.sock.close()    

