OYC - Old man Yells at Clouds

(name not final)

Is an attempt to copy htmx as a learning experience. It has some differences to htmx because of the self-imposed limitations.

Don't expect much. There's an `index.html` which has a very small example. There's also _some_ tests.

If you want to contribute, there's a ton of TODOs scattered throughout the repo.

# Short term goals
- better define flow and document the process at the beginning of the script
- clean up elements when deleting them
- combine `on` attribute handling with general attribute handling
- add ignore attribute
- support inputs
- support for forms
- create test pages and scripts
- extract types
- example page
- inherited attributes?
- add support for `withCredentials` when doing a fetch
- hx-sync-like
- investigate plugin system
- process nodes after all have been inserted to avoid any weird selector issues
- See if we can improve initialization when used inside an ES Module. The problem is reading the on:click functions as they are no longer accessible

# Long term goals
- Define custom headers that change functionality
- Logger
- Define specs for optional server responses

# Self-imposed limitations
- modern JS wherever possible (fetch, intersection observer)
- try to reduce the amount of object creation
- try to store as much information as possible in the element itself.
- package as a ES Module
- support attributes beginning with both `oyc` and `data-oyc`
- NO IE 11 Support

# Non-goals
- 100% test coverage
- Actually useful software - this is for educational/recreational purposes