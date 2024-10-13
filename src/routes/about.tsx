import { A } from '@solidjs/router';
import { For, onMount } from 'solid-js';
import Counter from '~/components/Counter';
import { useProductContext } from '~/context/product/ProductProvider';

export default function About() {
  const { products } = useProductContext();
  onMount(() => {
    console.log('products:', products());
  });
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        About Page
      </h1>
      <For each={products()}>
        {(product) => (
          <div class="text-left mt-4">
            <p>
              <strong>Product:</strong> {product.name} - ${product.price} 🔥😂
            </p>
          </div>
        )}
      </For>
      <Counter />
      <p class="mt-8">
        Visit{' '}
        <a
          href="https://solidjs.com"
          target="_blank"
          class="text-sky-600 hover:underline"
        >
          solidjs.com
        </a>{' '}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <A href="/" class="text-sky-600 hover:underline">
          Home
        </A>
        {' - '}
        <span>About Page</span>
      </p>
    </main>
  );
}
