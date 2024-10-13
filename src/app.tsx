import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import Nav from '~/components/Nav';
import './app.css';
import { ProductProvider } from './context/product/ProductProvider';

export default function App() {
  return (
    <Router
      root={(props) => (
        <ProductProvider>
          <Nav />
          <Suspense>{props.children}</Suspense>
        </ProductProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
