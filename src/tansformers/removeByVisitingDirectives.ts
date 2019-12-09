import { GraphQLSchema, ArgumentNode } from 'graphql';
import { compact } from '../utils';

/**
 * Directive visitors will be executed on each note the directive is attached
 * to. If the visitor returns true, the node will be removed from the schema.
 * If the visitor returns false, the node will not be removed.
 */
export type Visitors = Record<string, (args: Record<string, any>) => boolean>;

export default function removeByVisitingDirectives(visitors: Visitors) {
  return (schema: GraphQLSchema) => {
    compact([
      schema.getQueryType(),
      schema.getMutationType(),
      schema.getSubscriptionType(),
    ]).forEach(type => {
      removeDeprecatedFromFields(visitors, type.getFields());
    });

    Object.entries(schema.getTypeMap()).forEach(([key, type]: any) => {
      if (type._fields) {
        removeDeprecatedFromFields(visitors, type._fields);
      }
    });

    return schema;
  };
}

function removeDeprecatedFromFields(visitors: Visitors, fields: any) {
  for (const [key, value] of Object.entries(fields) as any) {
    if (value.astNode) {
      filterArguments(visitors, value);
      const shouldRemoveField = shouldRemove(
        visitors,
        value.astNode.directives,
      );

      if (shouldRemoveField) {
        delete fields[key];
      }
    }
  }
}

function filterArguments(visitors: Visitors, node: { args: any[] }) {
  node.args = node.args.filter((arg) => {
    if (shouldRemove(visitors, arg.astNode.directives)) {
      return false;
    }
    return true;
  });
}

function shouldRemove(visitors: Visitors, directives: any[]) {
  return directives.some((directive: any) => {
    const visitor = visitors[directive.name.value];
    if (visitor) {
      const args = directive.arguments.reduce(
        (acc: Record<string, any>, arg: ArgumentNode) => {
          acc[arg.name.value] =
            'value' in arg.value ? arg.value.value : arg.value;
          return acc;
        },
        {},
      );
      return visitor(args);
    }
    return false;
  });
}
