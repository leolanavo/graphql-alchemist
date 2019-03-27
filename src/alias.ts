function alias(aliases: string[]): MethodDecorator {
  return (target: any, propertyKey: string | symbol, _: PropertyDescriptor): void => {
    aliases.forEach((name: string): void => target[name] = target[propertyKey]);
  };
}

export default alias;
