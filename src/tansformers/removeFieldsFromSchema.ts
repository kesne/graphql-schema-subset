import { GraphQLSchema, GraphQLObjectType } from 'graphql';

export default function removeFieldsFromSchema(
  scope: 'Query' | 'Mutation' | 'Subscription',
  keepFields: string[],
) {
  return (schema: GraphQLSchema) => {
    let type: GraphQLObjectType | undefined | null;

    if (scope === 'Query') {
      type = schema.getQueryType();
    } else if (scope === 'Mutation') {
      type = schema.getMutationType();
    } else if (scope === 'Subscription') {
      type = schema.getSubscriptionType();
    }

    if (type) {
      const fields = type.getFields();
      for (const fieldName of Object.keys(fields)) {
        if (!keepFields.includes(fieldName)) {
          delete fields[fieldName];
        }
      }
    }

    return schema;
  };
}
