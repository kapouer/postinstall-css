postinstall-css
===============

This is a [postinstall](http://github.com/kapouer/postintall) command plugin.

It runs `postcss` with these plugins (in that order):
- postcss-import (for inlining imports)
- postcss-url (for rebasing)
- autoprefixer (for browsers compatibility)
- reporter
- csswring (for minification)


Usage
-----

The plugin can be called directly, or through `postinstall`.

Caveats
-------

Support for source maps is not yet available.

