class Field {
  public name: string;
  public type: string;

  constructor(arg: string) {
    const [ name, type ]: string[] = arg.split(':');

    this.name = name;
    this.type = type;
  }
}

export default Field;
