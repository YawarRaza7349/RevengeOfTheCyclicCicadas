#include <string>
#include <ostream>

#ifndef JSON_WRITER_H
#define JSON_WRITER_H

class json_writer {
private:
    std::ostream& output;
    bool just_begun;
public:
    json_writer(std::ostream& output);
    ~json_writer();
    void string(std::string const& value);
    void integer(std::uintmax_t value);
    void begin_array();
    void array_element();
    void end_array();
    void begin_object();
    void object_field(std::string const& name);
    void end_object();
};

#endif