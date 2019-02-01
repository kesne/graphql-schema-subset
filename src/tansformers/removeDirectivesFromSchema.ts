import { GraphQLSchema, GraphQLNamedType, GraphQLObjectType } from 'graphql';
import { TypeMap } from 'graphql/type/schema';

export default function removeDirectivesFromSchema(
  schema: GraphQLSchema,
): GraphQLSchema {
  return new GraphQLSchema({
    query: removeDirectiveFromObjectType(schema.getQueryType()),
    mutation: removeDirectiveFromObjectType(schema.getMutationType()),
    subscription: removeDirectiveFromObjectType(schema.getSubscriptionType()),
    directives: [],
    types: removeDirectivesFromTypes(schema.getTypeMap()),
  });
}

function removeDirectivesFromTypes(typemap: TypeMap): GraphQLNamedType[] {
  const types = Object.values(typemap);

  types.map(type => {
    // @ts-ignore
    const fields = Object.values(type._fields || []);
    fields.forEach(field => {
      removeDirectivesFromField(field);
    });
  });
  return types;
}

function removeDirectiveFromObjectType(
  type: GraphQLObjectType | null | undefined,
) {
  if (!type) return type;

  const fields = type.getFields();

  Object.values(fields).forEach(field => {
    removeDirectivesFromField(field);
  });

  return type;
}

function removeDirectivesFromField(field: any) {
  delete field.isDeprecated;
  delete field.deprecationReason;
  if (field.astNode) {
    field.astNode = removeDirectiveFromNode(field.astNode);
  }
}

function removeDirectiveFromNode(node: any) {
  node.directives = [];
  let fields = node.fields;
  if (fields) {
    fields = fields.map((n: any) => removeDirectiveFromNode(n));
  }

  return {
    ...node,
    fields,
    directives: [],
  };
}
