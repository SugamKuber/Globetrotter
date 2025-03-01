import '@elysiajs/types';

declare module '@elysiajs/types' {
  interface ElysiaContext {
    user?: {
      id: string;
      username: string;
    };
  }
}