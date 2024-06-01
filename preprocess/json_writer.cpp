#include <string>
#include <ostream>
#include "json_writer.h"

std::string escape(std::string str) {
    auto idx = 0;
    while ((idx = str.find_first_of("\"\\", idx)) != std::string::npos) {
        str.insert(idx, 1, '\\');
        idx += 2;
    }
    return str;
}

json_writer::json_writer(std::ostream& o) :
    output(o),
    just_begun(false) {}

json_writer::~json_writer() {
    output.flush();
}

void json_writer::string(std::string const& value) {
    output << '"' << escape(value) << '"';
}

void json_writer::integer(std::uintmax_t value) {
    output << value;
}

void json_writer::begin_array() {
    output << '[';
    just_begun = true;
}

void json_writer::array_element() {
    if (!just_begun) {
        output << ',';
    }
    just_begun = false;
}

void json_writer::end_array() {
    output << ']';
}

void json_writer::begin_object() {
    output << '{';
    just_begun = true;
}

void json_writer::object_field(std::string const& name) {
    if (!just_begun) {
        output << ',';
    }
    just_begun = false;
    output << '"' << escape(name) << "\":";
}

void json_writer::end_object() {
    output << '}';
}