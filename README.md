OYC - Old man Yells at Clouds

(name not final)

Is an attempt to copy htmx as a learning experience. It has some differences to htmx because of the self-imposed limitations.

Don't expect much. There's an `index.html` which has a very small example. There's also _some_ tests.

If you want to contribute, there's a ton of TODOs scattered throughout the repo.

# Basic logic

Processing means:
 - add http events
 - add "on:" events

When swapping
 - parse HTML into fragment
 - add http events
 - add "on:" events
 - append fragment to destination
 - remove existing elements if needed


# Short term goals
- investigate plugin system
- move methods to private methods
- add logger
- helpers for toggling a class
- add ignore attribute
- support inputs
- support for forms
- complex example page
- overhaul tests
- inherited attributes?
- remove accepting `data-` attributes stick to just oyc's, but allow the prefix to be changed to whatever the user wants
- add support for `withCredentials` when doing a fetch
- hx-sync-like
- process nodes after all have been inserted to avoid any weird selector issues
- See if we can improve initialization when used inside an ES Module. The problem is reading the on:click functions as they are no longer accessible
- Server-side HMR helper

# Long term goals
- Define custom headers that change functionality
- Logger
- Define specs for optional server responses
- Showcase educational benchmarks that led to decisions being made

# Self-imposed limitations
- modern JS wherever possible (fetch, intersection observer)
- do not support `eval` to be as CSP friendly
- try to reduce the amount of object creation
- try to store as much information as possible in the element itself.
- package as a ES Module
- support attributes beginning with both `oyc` and `data-oyc`
- NO IE 11 Support

# Non-goals
- 100% test coverage
- Actually useful software - this is for educational/recreational purposes