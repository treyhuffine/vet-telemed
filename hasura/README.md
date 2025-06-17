## Process for local development

Note: Ask for the `dumps` folder. This is gitignored.

1. `docker compose up -d`
2. If you want a history of data (it will include seeds and migrated data that was added to staging): `gunzip -c ./dumps/2024-05-22T13_36Z.sql.gz | docker exec -i bounce-hasura-postgres-1 psql -U postgres -d postgres`. Note that you may need to change the backup file name.
3. `yarn hasura:metamigrate:local`
4. `yarn hasura:migrate:local`
5. It you don't use the postgres backup: `yarn hasura:seed:local`
6. `yarn hasura:metareload:local`
7. Go to `http://localhost:8080` and use password `localsecret123`

Shutdown: `docker compose down`
Shutdown and delete all data: `docker compose down -v`

If you want to use the docker instance as your local database, you'll need to update the values in `.env.development`:

- `GRAPHQL_URL=http://localhost:8080/v1/graphql`
- `HASURA_GRAPHQL_ADMIN_SECRET=localsecret123`

If you need to generate new types from the local instance, from the root of the project run the commands `yarn codegen:client:local` and `yarn codegen:server:local`

## Updating a view to remove column

**Try to do this very sparingly**. Especially once we have a mobile app or something that is difficult to deploy, removing a column can break live queries.

The goal is to remove a column and make updates without needing to undo metadata we want to keep around foreign key relationships to the view.

Steps:

#### 1. Create a manual migration and drop the user_profiles column

```
yarn hasura:local migrate create drop_view_user_profiles --database-name default
```

Then the migration up query

```
DROP VIEW IF EXISTS user_profiles CASCADE;
```

#### 2. Re-initialize the view without the columns that you're deleting

Create another manual migration as trying to do it through hasura will error

```
yarn hasura:local migrate create create_or_replace_view_user_profiles --database-name default
```

Fill in the user_profiles fields

```
CREATE
OR REPLACE VIEW "public"."user_profiles" AS
SELECT
  users.id,
  ....
```

Create without hte fields that you want deleted

#### 3. Run the migration

```
yarn hasura:migrate:local
```

#### 4. Clean and apply the metadata to local hasura

Remove any data manually from the metadata of the view you changed (here, `user_profiles`)

```
yarn hasura:metamigrate:local
```

You may need to check for inconcistensies

```
yarn hasura:local metadata ic list
```

#### 5. Delete columns through migrations. Add any new columns if desired.

Delete the columns in the original table using local migration console that are no longer needed. Add any new columns if desired.

#### 6. Rebuild the view with new columns

Run the create or replace view as a local migration with the new columns

## TODO

- Should local be the default for developing?
