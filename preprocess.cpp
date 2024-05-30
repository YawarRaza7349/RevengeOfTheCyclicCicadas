#include <string>
#include <array>
#include <fstream>
#include <iostream>

template<int Dimension, typename T, int N>
class table {
private:
    std::array<table<Dimension - 1, T, N>, N> arr;

public:
    template<typename KeyIter>
    auto& operator[](KeyIter&& key_iter) {
        // create sequence point to ensure dereference precedes increment
        auto& next = arr[*key_iter];
        return next[++key_iter];
    }
};

template<typename T, int N>
class table<0, T, N> {
private:
    T t;
    
public:
    template<typename KeyIter>
    auto& operator[](KeyIter&&) {
        return t;
    }
};

template<int L>
// one extra element for NUL
class code : public std::array<char, L + 1> {};

template<int L>
decltype(auto) operator>>(std::istream& input, code<L>& c) {
    return input.get(c.data(), L + 1);
}

int main() {
    auto const code_length = 2;
    auto const max_code_char = 'Z';
    
    // trade space efficiency for time efficiency
    // by not reindexing code chars to remove gaps
    table<code_length, std::string, max_code_char + 1> lookup_table;
    
    {
        std::ifstream lookup_file("keys.tsv");
        code<code_length> key;
        
        while (lookup_file >> key) {
            lookup_file.getline(nullptr, 0, '\t');
            std::getline(lookup_file, lookup_table[key.begin()]);
        }
    } // destroy lookup_file
}
