# If you want to change anything in this file, consult Abby first.

cmake_minimum_required(VERSION 3.20)
project(Uter-Us)

set(CMAKE_CXX_STANDARD 17)

set(MARIADB_DIR "C:/Program Files/MariaDB/MariaDB C++ Connector 64-bit")

add_executable(Uter-Us backend/main.cpp backend/database.cpp)

target_include_directories(Uter-Us PRIVATE "${MARIADB_DIR}/include")

add_library(mariadbcpp SHARED IMPORTED)
set_target_properties(mariadbcpp PROPERTIES
        IMPORTED_LOCATION "${MARIADB_DIR}/mariadbcpp.dll"
        IMPORTED_IMPLIB   "${MARIADB_DIR}/mariadbcpp.lib"
)

target_link_libraries(Uter-Us PRIVATE mariadbcpp)