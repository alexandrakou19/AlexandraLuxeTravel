import * as migration_20261018_121741_initial from './20261018_121741_initial';
import * as migration_20261018_142745_blob_object_key from './20261018_142745_blob_object_key';

export const migrations = [
  {
    up: migration_20261018_121741_initial.up,
    down: migration_20261018_121741_initial.down,
    name: '20261018_121741_initial',
  },
  {
    up: migration_20261018_142745_blob_object_key.up,
    down: migration_20261018_142745_blob_object_key.down,
    name: '20261018_142745_blob_object_key'
  },
];
