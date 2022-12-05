# xrator

> Xractor helps to manage all your company assets and audit their security vulnerabilities

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## More info about features

### Dashboard

The library vue-responsive-dash ([Github](https://github.com/bensladden/vue-responsive-dash) [full documentation](https://vue-responsive-dash.netlify.app/)) is used to create a reponsive dashbaord with sm, md and lg breakpoints. 

Note: in the future, this lib should be replaced by [gridstack](https://www.npmjs.com/package/gridstack) which offers better support.

- By default, there is **12** columns in the grid.
- **Height** and **width** correspond to the number of **columns** and **rows**.
- **x** and **y** correspond to the top left corner of the widget.

