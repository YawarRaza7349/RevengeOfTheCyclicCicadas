#include <string>
#include <array>
#include <fstream>
#include <iostream>

int main() {
    auto const code_size = 2;
    auto const max_code_char = 'Z';
    
    // trade space efficiency for time efficiency
    // by not reindexing code chars to remove gaps
    std::array<
        std::array<std::string, max_code_char + 1>,
        max_code_char + 1
    > lookup_table;
    
    std::array<char, code_size + 1> code;
    
    {
        std::ifstream lookup_file("keys.tsv");
        while (lookup_file.getline(code.data(), code_size + 1, '\t')) {
            std::getline(lookup_file, lookup_table[code[0]][code[1]]);
        }
    } // destroy lookup_file
}
