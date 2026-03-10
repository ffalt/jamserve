import { Container } from 'inversify';

export const container = new Container({ defaultScope: 'Singleton', autoBindInjectable: true });
