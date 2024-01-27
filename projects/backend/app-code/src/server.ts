import 'reflect-metadata';

import { createServer } from 'node:http';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createYoga } from 'graphql-yoga';
import { WebSocketServer } from 'ws';
import { getSchema } from './schema';

async function main() {
  const buildSchema = await getSchema();
  const yogaApp = createYoga({
    schema: buildSchema,
    graphiql: {
      subscriptionsProtocol: 'WS',
    },
  });

  const httpServer = createServer(yogaApp);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: yogaApp.graphqlEndpoint,
  });

  useServer(
    {
      execute: (args: any) => args.rootValue.execute(args),
      subscribe: (args: any) => args.rootValue.subscribe(args),
      onSubscribe: async (ctx, msg) => {
        const { schema, execute, subscribe, contextFactory, parse, validate } = yogaApp.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload,
        });

        const args = {
          schema,
          operationName: msg.payload.operationName,
          document: parse(msg.payload.query),
          variableValues: msg.payload.variables,
          contextValue: await contextFactory(),
          rootValue: {
            execute,
            subscribe,
          },
        };

        const errors = validate(args.schema, args.document);
        if (errors.length) return errors;
        return args;
      },
    },
    wsServer,
  );

  httpServer.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
