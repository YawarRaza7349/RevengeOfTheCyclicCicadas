In recognition of Cicadaggedon 2024, I have reimplemented [my decade-old data visualization](https://github.com/YawarRaza7349/CyclicCicadas) showing cicadas across U.S. states in different years. Unlike the original, which was in Processing and thus inconvenient for people to run on their own computers, this version runs in a web browser and uses its native SVG rendering capabilities, alongside vanilla HTML, CSS, and JavaScript. 

The original version does a bunch of data processing at the start of every run of the program, specifically aggregating all the data points into per-state totals. This processing is identical in every run, so in this updated version, I do this processing ahead of time with a C++ program I wrote. This C++ program outputs a JSON file with the per-state totals, which is then read by the data visualization program instead of the original data. The C++ program includes a use of recursive templates (to generalize something over N dimensions) and a hand-rolled JSON serializer with an imperative API.

I have attempted to make the app accessible to screen readers, though I have not been able to test it as I don't have a computer right now. I have also made the layout of the page responsive across varying screen sizes, with both a "mobile" layout and a "desktop" layout. The implementation is simple and straightforward, yet modern, using technologies like CSS Flexbox and ES6 language features.

For those looking at the commit logs, I do know how to use `git add` to add multiple files to a single commit, but I don't have a computer, so I programmed this on my smartphone and used the GitHub web UI to make my commits, which doesn't support multiple files per commit.
