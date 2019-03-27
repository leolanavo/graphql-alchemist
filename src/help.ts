const globalHelp: string = `
Usage: graphql-alchemist COMMAND

A CLI tool to generate opinionated GraphQL schema and code

Commands:
  init         Bootstrap a new Apollo Server API
  schema       Create new schema
  model        Create new model
  type         Create new type
  input        Create new input
  resolver     Create new resolver

Run graphql-alchemist COMMAND -h for more information on a command.
`;

export default {
  global: globalHelp,
};
