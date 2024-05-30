#include <string>
#include <array>
#include <fstream>
#include <iostream>

template<int Dimension, typename T, int N>
struct table {
    std::array<table<Dimension - 1, T, N>, N> arr;
    
    template<typename KeyIter>
    auto& operator[](KeyIter&& key_iter) {
        // create sequence point to ensure deref precedes incr
        auto& inner = arr[*key_iter];
        return inner[++key_iter];
    }
};

template<typename T, int N>
struct table<0, T, N> {
    T t;
    
    template<typename KeyIter>
    auto& operator[](KeyIter&&) {
        return t;
    }
};

int main() {
    auto const code_size = 2;
    auto const max_code_char = 'Z';
    
    // trade space efficiency for time efficiency
    // by not reindexing code chars to remove gaps
    table<code_size, std:: string, max_code_char + 1> lookup_table;
    
    // one extra element for NUL
    std::array<char, code_size + 1> code;
    
    {
        std::ifstream lookup_file("keys.tsv");
        while (lookup_file.getline(code.data(), code_size + 1, '\t')) {
            std::getline(lookup_file, lookup_table[code.begin()]);
        }
    } // destroy lookup_file
}
