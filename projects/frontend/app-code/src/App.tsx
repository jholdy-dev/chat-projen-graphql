import './App.css';
import { ApolloProvider } from '@apollo/client';
import { mainGqlClient } from './helpers/gql.setup';
import Home from './page/home';

export default function App() {
  return (
    <ApolloProvider client={mainGqlClient}>
      <Home />
    </ApolloProvider>
  );
}
