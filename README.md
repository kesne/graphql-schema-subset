# graphql-schema-subset

Builds a subset of your GraphQL schema.
This is designed to build a subset of your schema that can be exposed publically.

## Features

- Automatically strips all schema directives.
- Supports preserving a subset of the fields in the Query, Mutation, and Subscription types.
- Removes any unused types in the schema.

## TODO:

- Add tests for enums and unions and such.
- Add CLI.
