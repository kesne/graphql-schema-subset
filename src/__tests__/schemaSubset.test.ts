import gql from 'graphql-tag';
import schemaSubset from '../schemaSubset';

describe('graphql-schema-subset', () => {
  it('removes unused types', () => {
    expect(
      schemaSubset(gql`
        type Unused {
          removeMe: String
        }

        type Query {
          hello: String!
        }
      `),
    ).toMatchInlineSnapshot(`
"type Query {
  hello: String!
}
"
`);
  });

  it('removes directives', () => {
    expect(
      schemaSubset(gql`
        directive @doNotUse(
          reason: String = "No longer supported"
        ) on FIELD_DEFINITION

        type Hello {
          old: String @doNotUse(reason: "Use new.")
          new: String @deprecated
        }

        type Query {
          hello: Hello @deprecated
        }
      `),
    ).toMatchInlineSnapshot(`
"type Hello {
  old: String
  new: String
}

type Query {
  hello: Hello
}
"
`);
  });

  it('allows specifying query fields to keep', () => {
    const schema = gql`
      type Hello {
        message: String
      }

      type Query {
        hello: Hello
        additional: String
      }
    `;

    expect(schemaSubset(schema, { keepQueries: ['hello'] }))
      .toMatchInlineSnapshot(`
"type Hello {
  message: String
}

type Query {
  hello: Hello
}
"
`);

    expect(schemaSubset(schema, { keepQueries: ['additional'] }))
      .toMatchInlineSnapshot(`
"type Query {
  additional: String
}
"
`);

    expect(schemaSubset(schema, { keepQueries: ['hello', 'additional'] }))
      .toMatchInlineSnapshot(`
"type Hello {
  message: String
}

type Query {
  hello: Hello
  additional: String
}
"
`);
  });

  it('allows removing everything', () => {
    const schema = gql`
      type Hello {
        message: String
      }

      type Query {
        hello: Hello
        additional: String
      }

      type Mutation {
        sendHello: String
      }
    `;

    expect(schemaSubset(schema, { keepQueries: [], keepMutations: [] }))
      .toMatchInlineSnapshot(`
"
"
`);
  });

  it('allows removing deprecated fields', () => {
    expect(
      schemaSubset(
        gql`
          type Hello {
            old: String @deprecated
            new: String
          }

          type Query {
            hello: Hello
            oldHello: Hello @deprecated
          }
        `,
        { removeDeprecated: true },
      ),
    ).toMatchInlineSnapshot(`
"type Hello {
  new: String
}

type Query {
  hello: Hello
}
"
`);
  });
});
