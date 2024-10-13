import {
  A,
  action,
  cache,
  createAsync,
  reload,
  RouteDefinition,
  RouteSectionProps,
  useAction,
  useSubmission,
} from '@solidjs/router';
import { createEffect, For, Show } from 'solid-js';
import Counter from '~/components/Counter';
import { Button } from '~/components/ui/button';
import { getDB } from '~/server/db';

// const prisma = new PrismaClient();

const getUsers = cache(async () => {
  'use server';

  const db = await getDB();

  return db.data.users;
}, 'getUsers');

const createUser = action(async (formData: FormData) => {
  'use server';
  const name = formData.get('name') as string;
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Creating user:', name);
  // await prisma.user.create({ data: { name } });
  const db = await getDB();
  await db.update(({ users }) => {
    users.push({ id: users.length + 1, name });
  });

  return reload({ revalidate: [getUsers.key] });
});

const removeUserById = action(async (id: number) => {
  'use server';
  const db = await getDB();
  await db.update(({ users }) => {
    const index = users.findIndex((user) => user.id === id);
    users.splice(index, 1);
  });

  return reload({ revalidate: [getUsers.key] });
});

const getDate = cache(async () => {
  'use server';
  await new Promise((r) => setTimeout(r, 1000));

  // get Time from server hh:mm:ss
  return new Date().toLocaleTimeString();
}, 'getDate');

export const route = {
  preload() {
    getDate();
    getUsers();
  },
} satisfies RouteDefinition;

export default function Home(props: RouteSectionProps) {
  const date = createAsync(() => getDate());
  const users = createAsync(() => getUsers());
  const createUserSubmit = useAction(createUser);
  const submission = useSubmission(createUser);

  const isAdding = () => submission.pending && submission.input.at(0);

  let ref!: HTMLFormElement;

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Hello world!
      </h1>

      <form
        ref={ref}
        onSubmit={(e) => {
          e.preventDefault();

          createUserSubmit(new FormData(e.currentTarget));
          ref.reset();
        }}
      >
        <label for="name" class="block text-left">
          Name:
        </label>
        <input
          type="text"
          name="name"
          class="border border-gray-300 rounded-md p-2 w-full mt-2"
        />
        <button type="submit" class="bg-sky-600 text-white rounded-md p-2 mt-4">
          Create User
        </button>
      </form>
      <For each={users()}>
        {(user) => (
          <div class="text-left mt-4">
            <p>
              <strong>User:</strong> {user.name}
            </p>
            <form action={removeUserById.with(user.id)} method="post">
              <Button type="submit">Remove</Button>
            </form>
          </div>
        )}
      </For>
      <Show when={isAdding()} keyed>
        <div class="text-left mt-4">
          <p>
            <strong>User:</strong>{' '}
            {submission.input?.at(0)?.get('name')! as string}
          </p>
          <form method="post">
            <Button type="submit" disabled={!!isAdding()}>
              Remove
            </Button>
          </form>
        </div>
      </Show>

      <p class="text-xl my-4">Today is {date()}</p>

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
        <span>Home</span>
        {' - '}
        <A href="/about" class="text-sky-600 hover:underline">
          About Page
        </A>{' '}
      </p>
    </main>
  );
}
