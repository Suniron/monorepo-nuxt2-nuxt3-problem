# Migrations files

All the files in this folder are to be considered migrations.
They will automatically be loaded by Knex and ran in order from the oldest to the newest.

# Creating a migration

## File name

The file name should be created as follows:

`<year><month><day><hours><minutes><seconds>_<name>.js` (or `YYYYMMDDhhmmss_name.js`)

> The date should be the time of the feature's end of development.

For example:

```
20220315091204_awesome_new_feature.js
```

## Content

The migration should export an `up` and a `down` function. Each functions recieves the knex object with the database connection as parameter.

### Snippet

To make the creation of a migration easier, you can use the custom snippet `migration` in the empty file you created. This snippet will create a base template for the new migration

### isSetup

The knex object has a custom property `knex.userParams.isSetup`. This property is set to `true` when the migration is called on the first start of the application (when the `db_migrations` and `db_migrations_lock` are not created yet).  
The point of this property is to have a "dry run" of your migration on the app's first initialization (since the database should not be outdated at that point).

### Example

Here is an example of a migration:

`20220315091204_user_avatar.js`

```js
exports.up = function (knex) {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.table('user', function (table) {
    table.string('avatar_url')
  })
}

exports.down = function (knex) {
  return knex.schema.table('user', function (table) {
    table.dropColumn('avatar_url')
  })
}
```
