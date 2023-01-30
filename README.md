postinstall-css
===============

This is a [postinstall](http://github.com/kapouer/postintall) command plugin.

It runs `postcss` with these plugins (in that order):

- postcss-import (for inlining imports)
- postcss-url (for rebasing)
- postcss-flexbugs-fixes
- autoprefixer (for browsers compatibility)
- reporter
- cssnano (for minification)

Usage
-----

The plugin can be called directly, or through `postinstall`.
Directly:

```js
require('postinstall-css')(inputs, output, options).then(function() {
 // done
});
```

Options
-------

- browsers: a string, environment for Browserslist
- minify: pass `minify: false` to disable minification.

Caveats
-------

Support for source maps is not yet available.
