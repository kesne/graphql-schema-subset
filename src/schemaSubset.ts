import {
  buildSchema,
  printSchema,
  DocumentNode,
  buildASTSchema,
} from 'graphql';
import removeUnusedTypesFromSchema from './tansformers/removeUnusedTypesFromSchema';
import removeDirectivesFromSchema from './tansformers/removeDirectivesFromSchema';
import removeFieldsFromSchema from './tansformers/removeFieldsFromSchema';
import removeDeprecatedFromSchema from './tansformers/removeDeprecatedFromSchema';
import { compact } from './utils';

interface SubsetOptions {
  removeDeprecated?: boolean;
  keepQueries?: string[];
  keepMutations?: string[];
  keepSubscriptions?: string[];
}

export default function schemaSubset(
  schema: string | DocumentNode,
  options: SubsetOptions = {},
) {
  const schemaAST =
    typeof schema === 'string' ? buildSchema(schema) : buildASTSchema(schema);

  const transformers = compact([
    options.removeDeprecated && removeDeprecatedFromSchema,
    options.keepQueries && removeFieldsFromSchema('Query', options.keepQueries),
    options.keepMutations &&
      removeFieldsFromSchema('Mutation', options.keepMutations),
    options.keepSubscriptions &&
      removeFieldsFromSchema('Mutation', options.keepSubscriptions),
    removeDirectivesFromSchema,
    removeUnusedTypesFromSchema,
  ]);

  return printSchema(
    transformers.reduce((ast, transform) => transform(ast), schemaAST),
    {
      commentDescriptions: true,
    },
  );
}
