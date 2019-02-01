import { GraphQLSchema } from 'graphql';
import { compact } from '../utils';

export default function removeDeprecatedFromSchema(
  schema: GraphQLSchema,
): GraphQLSchema {
  compact([
    schema.getQueryType(),
    schema.getMutationType(),
    schema.getSubscriptionType(),
  ]).forEach(type => {
    removeDeprecatedFromFields(type.getFields());
  });

  Object.entries(schema.getTypeMap()).forEach(([key, type]: any) => {
    if (type._fields) {
      removeDeprecatedFromFields(type._fields);
    }
  });

  return schema;
}

function removeDeprecatedFromFields(fields: any) {
  for (const [key, value] of Object.entries(fields) as any) {
    if (value.isDeprecated) {
      delete fields[key];
    }
  }
}
