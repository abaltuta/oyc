OYC

Old man Yells at Cloud is an attempt at a simple front-end framework. It's best coupled with a backend that returns HTML.

Short term goals
- better define flow and document the process at the beginning of the script
- processElementsAndChildren when swapping inner html
- combine `on` attribute handling with general attribute handling
- add ignore attribute
- support inputs
- support for forms
- create test pages and scripts
- extract types
- example page
- inherited attributes?
- add support for `withCredentials` when doing a fetch
- similar to hx-sync
- investigate plugin system
- build script with minification
- add UMD insanity?
- See if we can improve initialization when used inside an ES Module. The problem is reading the on:click functions as they are no longer accessible

Long term goals
- Define custom headers that change functionality
- Logger

Self-imposed limitations
- modern JS wherever possible (fetch, intersection observer)
- try to reduce the amount of object creation
- try to store as much information as possible in the element itself.
- package as a ES Module
- support attributes beginning with both `oyc` and `data-oyc`
- NO IE 11 Support