import alias from './alias';

import fs from 'fs';
import Field from './field';

const helpText: string = `
Usage: graphql-alchemist resolver [OPTIONS] -n NAME

Create a new file with the named resolver inside using a boilerplate

Options:
  -n, --name                   Set the name of the resolver (must be specified)
  -a, --async                  Set the resolver function to a async funtion
  -p, --parent                 Enable parent argument (disabled by default
  -i, --info                   Enable info argument (disabled by default
      --args <list of args>    List of arguments, must be specified in the format name:type,
                               leaving this blank will create a resolver without args
  -r, --return <type>          Set the return type of the resolver
  -q, --query                  Set the resolver type to query (default value)
  -m, --mutation               Set the resolver type to mutation (query is the default)
  -s, --subscription           Set the resolver type to subscription (query is the default)
`;

enum ResolverType {
  QUERY = 'Query',
  MUTATION = 'Mutation',
  SUBSCRIPTION = 'Subscription',
}

interface Resolver {
  name: string;
  type: ResolverType;
  isAsync: boolean;
  hasParent: boolean;
  hasInfo: boolean;
  arguments: Field[];
  [key: string]: any;
}

class Resolver implements Resolver {
  public name: string = '';
  public type: ResolverType = ResolverType.QUERY;
  public isAsync: boolean = false;
  public hasParent: boolean = false;
  public hasInfo: boolean = false;
  public arguments: Field[] = [];

  constructor(args: string[]) {
    if (args.length === 2 && (args[1] === '-h' || args[1] === '--help')) {
      this.help([]);
      return;
    }

    const nameIndex: number =
      args.findIndex((arg: string): boolean => arg === '--name' || arg === '-n');

    if (nameIndex < 0) {
      this.help([]);
      throw new Error('A resolver name must be defined');
    }

    this.name = args[nameIndex + 1];
    this.parseFlags(args);
    this.parseArgs(args);
  }

  @alias(['p', 'parent'])
  public setHasParent(_: string[]): void {
    this.hasParent = true;
  }

  @alias(['i', 'info'])
  public setHasInfo(_: string[]): void {
    this.hasInfo = true;
  }

  @alias(['a', 'async'])
  public setAsync(_: string[]): void {
    this.isAsync = true;
  }

  @alias(['q', 'query'])
  public setResolverTypeToQuery(_: string[]): void {
    this.type = ResolverType.QUERY;
  }

  @alias(['m', 'mutation'])
  public setResolverTypeToMutation(_: string[]): void {
    this.type = ResolverType.MUTATION;
  }

  @alias(['s', 'subscription'])
  public setResolverTypeToSubscription(_: string[]): void {
    this.type = ResolverType.SUBSCRIPTION;
  }

  @alias(['h', 'help'])
  public help(_: string[]): void {
    console.log(helpText);
  }

  public parseFlags(args: string[]): void {
    const shortFlags: string[] = args
      .filter((arg: string): boolean | null => arg.match(/^-(\w+)/) && arg !== '-n')
      .map((flag: string): string => flag.slice(1))
      .join('')
      .split('');

    const extensiveFlags: string[] = args
      .filter((arg: string): boolean | null => arg.match(/^--(\w+)/) && arg !== '--name' && arg !== '--args')
      .map((flag: string): string => flag.slice(2));

    const flags: string[] = shortFlags.concat(extensiveFlags);

    flags.forEach((flag: string): void => {
      this[flag](args);
    });
  }

  public parseArgs(args: string[]): void {
    const startIndex: number = args.indexOf('--args') + 1;
    const endIndex: number =
      args
        .slice(startIndex)
        .findIndex((arg: string): boolean => arg.match(/^-/) !== null);

    this.arguments = args
      .slice(startIndex, startIndex + endIndex)
      .map((arg: string): Field => new Field(arg));
  }

  public print(): void {
    const parent: string = this.hasParent ? 'parent' : '_parent';
    const info: string = this.hasInfo ? 'info' : '_info';
    const fucntionDeclaration: string = this.isAsync ? 'async function' : 'function';

    console.log(`${this.type} ${this.name}`);
    console.log();

    const path: string = `${__dirname}/${this.name}.js`;

    fs.openSync(path, 'w');

    fs.writeFileSync(
      path,
      `${fucntionDeclaration} ${this.name} (${parent}, args, context, ${info}) {\n` +
      '  // Your code goes here\n' +
      '}\n\n' +
      `export default ${this.name}\n`,
    );

    console.log(`${__dirname}/src/resolver/${this.name}`);
  }
}

export default Resolver;
