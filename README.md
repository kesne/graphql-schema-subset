> **THIS PACKAGE HAS BEEN DEPRECATED:** This approach to generation of schema subsets is no deprecated, and longer recommended. Instead, we recommend using a code-based approach to Schema generation, which allows for generating a subset of the schema via code exclusion patterns. We specifically use [GiraphQL](https://giraphql.com/), which has [this capability built in via plugins](https://giraphql.com/guide/writing-plugins#removing-fields-and-enum-values). We use this in conjuction with the [`pruneSchema`](https://www.graphql-tools.com/docs/api/classes/wrap_src.pruneschema/) function from [`graphql-tools`](https://www.graphql-tools.com/) to remove unused types from the output.

# graphql-schema-subset

Builds a subset of your GraphQL schema.
This is designed to build a subset of your schema that can be exposed publically.

## Features

- Automatically strips all schema directives.
- Supports preserving a subset of the fields in the Query, Mutation, and Subscription types.
- Removes any unused types in the schema.

## TODO:

- Add tests for enums and unions and such.
