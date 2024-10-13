import { JSONFilePreset, JSONFileSyncPreset } from 'lowdb/node';

export const getDB = () => {
  return JSONFilePreset<{
    users: { id: number; name: string }[];
  }>('db.json', {
    users: [],
  });
};
