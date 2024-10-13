import { createSignal } from 'solid-js';
import { Accessor, createContext, ParentProps, useContext } from 'solid-js';

type Product = {
  id: number;
  name: string;
  price: number;
};

type ProductState = {
  products: Accessor<Product[]>;
};

export const ProductContext = createContext<ProductState>();

export const ProductProvider = (props: ParentProps) => {
  const [products, setProducts] = createSignal<Product[]>([
    {
      id: 1,
      name: 'Product 1',
      price: 100,
    },
    {
      id: 2,
      name: 'Product 2',
      price: 200,
    },
  ]);

  return (
    <ProductContext.Provider
      value={{
        products,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return ctx;
};
