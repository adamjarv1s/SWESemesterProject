#include <iostream>
#include <ctime>
#include <string>
#include <winsock2.h>
#include <ws2tcpip.h>

#pragma comment(lib, "ws2_32.lib")

std::string getCurrentDate(){
    time_t timestamp = time(NULL);
    struct tm datetime = *localtime(&timestamp);
    char output[50];

    strftime(output, 50, "%Y-%m-%d", &datetime);
    return std::string(output);
}

std::string getIPAddress() {
    WSADATA wsa;
    WSAStartup(MAKEWORD(2, 2), &wsa);

    SOCKET sock = socket(AF_INET, SOCK_DGRAM, 0);

    sockaddr_in remote{};
    remote.sin_family = AF_INET;
    remote.sin_port = htons(53);
    inet_pton(AF_INET, "8.8.8.8", &remote.sin_addr);

    connect(sock, (sockaddr*)&remote, sizeof(remote));

    sockaddr_in local{};
    int len = sizeof(local);
    getsockname(sock, (sockaddr*)&local, &len);

    char buffer[INET_ADDRSTRLEN];
    inet_ntop(AF_INET, &local.sin_addr, buffer, INET_ADDRSTRLEN);

    closesocket(sock);
    WSACleanup();

    return std::string(buffer);
}