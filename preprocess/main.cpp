#include <string>
#include <array>
#include <fstream>
#include <map>
#include <iostream>
#include "json_writer.h"

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
    auto constexpr code_length = 2;
    
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
            
            auto const& cycle = lookup_table[cycle_code.begin()];
            auto const& year = lookup_table[year_code.begin()];
            auto const& state = lookup_table[state_code.begin()];
            
            try {
                auto years_before_cutoff = 2012 - std::stoi(year);
                
                if (cycle == "13" && years_before_cutoff < 13) {
                    ++data_by_state[state].back13.at(years_before_cutoff);
                } else if (cycle == "17" && years_before_cutoff < 17) {
                    ++data_by_state[state].back17.at(years_before_cutoff);
                }
            } catch (...) {
                // ignore data with invalid year
            }
        }
    } // close data_file
    
    json_writer jw(std::cout);
    
    jw.begin_object();
    
    jw.object_field("startYear");
    jw.integer(2013);
    
    jw.object_field("data");
    jw.begin_array();
    
    for (auto const& [name, data] : data_by_state) {
        jw.array_element();
        
        jw.begin_object();
        
        jw.object_field("state");
        jw.string(name);
        
        jw.object_field("cycle13");
        jw.begin_array();
        for (
            auto iter(data.back13.rbegin());
            iter != data.back13.rend();
            ++iter
        ) {
            jw.array_element();
            jw.integer(*iter);
        }
        jw.end_array();
        
        jw.object_field("cycle17");
        jw.begin_array();
        for (
            auto iter(data.back17.rbegin());
            iter != data.back17.rend();
            ++iter
        ) {
            jw.array_element();
            jw.integer(*iter);
        }
        jw.end_array();
        
        jw.end_object();
    }
    
    jw.end_array();
    
    jw.end_object();
}
