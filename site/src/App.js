import React from 'react';
import RouteComponent from './components/routes';
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';

const store = createStore({
    authName:'_auth',
    authType:'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === 'https:',
  });

const App = () => (
    <AuthProvider store={store} >
        <RouteComponent />
    </AuthProvider>
);

export default App;