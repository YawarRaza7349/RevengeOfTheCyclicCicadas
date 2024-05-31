#include <string>
#include <array>
#include <fstream>
#include <map>
#include <iostream>

template<int Dimension, typename T, char Lower, char Upper>
class table {
private:
    std::array<table<Dimension - 1, T, Lower, Upper>, Upper - Lower + 1> arr;

public:
    template<typename KeyIter>
    auto& operator[](KeyIter&& key_iter) {
        // create sequence point to ensure dereference precedes increment
        auto& next = arr[*key_iter - Lower];
        return next[++key_iter];
    }
};

template<typename T, char Lower, char Upper>
class table<0, T, Lower, Upper> {
private:
    T t;
    
public:
    template<typename KeyIter>
    auto& operator[](KeyIter&&) {
        return t;
    }
};

template<int Length>
// one extra element for NUL
class code : public std::array<char, Length + 1> {};

template<int Length>
decltype(auto) operator>>(std::istream& input, code<Length>& c) {
    return input.get(c.data(), Length + 1);
}

class state_data {
public:
    std::array<std::uintmax_t, 13> back13{};
    std::array<std::uintmax_t, 17> back17{};
};

int main() {
    auto const code_length = 2;
    
    // trade space efficiency for time efficiency by
    // not removing the gap between digits and letters
    table<code_length, std::string, '0', 'Z'> lookup_table;
    
    {
        std::ifstream lookup_file("keys.tsv");
        code<code_length> key;
        
        while (lookup_file >> key) {
            lookup_file.getline(nullptr, 0, '\t');
            std::getline(lookup_file, lookup_table[key.begin()]);
        }
    } // close lookup_file
    
    std::map<std::string, state_data> data_by_state;
    
    {
        std::ifstream data_file("data.txt");
        
        code<code_length> discard, cycle_code, year_code, state_code;
        
        while (data_file >> discard) {
            data_file
                >> discard
                >> cycle_code
                >> year_code
                >> discard
                >> state_code
                >> discard;
            
            auto& data_for_state = data_by_state[lookup_table[state_code.begin()]];
            
            auto cycle = lookup_table[cycle_code.begin()];
            
            try {
                auto years_before_cutoff = 2012 - std::stoi(lookup_table[year_code.begin()]);
                
                if (cycle == "13" && years_before_cutoff < 13) {
                    ++data_for_state.back13.at(years_before_cutoff);
                } else if (cycle == "17" && years_before_cutoff < 17) {
                    ++data_for_state.back17.at(years_before_cutoff);
                }
            } catch (...) {
                // ignore data with invalid year
            }
        }
    } // close data_file
}
