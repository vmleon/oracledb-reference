# Oracle Database Reference

This repository is a reference for SQL and PL/SQL on Oracle Database.

It mainly use [Oracle Database Free](https://container-registry.oracle.com/ords/f?p=113:4:106400253224037:::4:P4_REPOSITORY,AI_REPOSITORY,AI_REPOSITORY_NAME,P4_REPOSITORY_NAME,P4_EULA_ID,P4_BUSINESS_AREA_ID:1863,1863,Oracle%20Database%20Free,Oracle%20Database%20Free,1,0&cs=37IPjmISICL3s0qChwV7EiEH9KxXQpPaf3inido3YaT6mvL78fWQQSgZAyUDX5rnjjDm1y3yxbFB-DZ8Nhol0ig) run in a container.

## Requirements

You need:

- SQLcl
- Podman
- jq
- Node.js

## Get Started

```bash
npm i -g zx
```

```bash
cd scripts/ && npm install && cd ..
```

```bash
zx scripts/init.mjs
```

```bash
export ORAREF_DB_PASSWORD="$(jq -r .db_password ~/.config/configstore/oraref.json)"
```

Download the container image.

```bash
podman pull container-registry.oracle.com/database/free:latest
```

Run Oracle Database (latest) on a container.

> NOTE: if you did this step before,then run this:
>
> ```bash
> podman start oraref
> ```

```bash
podman run --name oraref \
    -d \
    -p 1521:1521 \
    -v $(pwd)/data:/opt/oracle/oradata \
    container-registry.oracle.com/database/free:latest
```

Wait for the database to be on STATUS `(healthy)` instead of `(starting)`.

```bash
podman ps | grep oraref
```

```bash
podman exec oraref ./setPassword.sh $ORAREF_DB_PASSWORD
```

## Connect

To connect to the database at the `CDB$ROOT` level as `sysdba`

```bash
sql sys/$ORAREF_DB_PASSWORD@localhost:1521/FREE as sysdba
```

To connect as non `sysdba` at the `CDB$ROOT` level

```bash
sql system/$ORAREF_DB_PASSWORD@localhost:1521/FREE
```

To connect to the default Pluggable Database (`PDB`) within the `FREE` Database:

```bash
sql pdbadmin/$ORAREF_DB_PASSWORD@localhost:1521/FREEPDB1
```

```sql
select banner_full from v$version;
```

## Sample Data

Using the official GitHub repository [db-sample-schemas](https://github.com/oracle-samples/db-sample-schemas).

Go to [db-sample-schemas/releases](https://github.com/oracle-samples/db-sample-schemas/releases) and download the latest zip.

Unzip the content in the `samples` folder for this repository.

Example of installation for the `human_resources` schema.

At the time of creating this README, the version is 23.3. Adjust folder name according to the current version.

```bash
cd samples/db-sample-schemas-23.3/human_resources
```

Connect with the database:

```bash
sql pdbadmin/$ORAREF_DB_PASSWORD@localhost:1521/FREEPDB1
```

> NOTE: modify hr_install.sql on a copy of the file called `hr_install_cdb.sql` so the schema is called `C##HR` instead of `HR`.

Install hr_install_cdb.sql

```bash
@hr_install_cdb.sql
```

Answer the questions:

- Enter a password for the user HR: WHATEVER_PASSWORD_YOU_WANT
- Enter a tablespace for HR [USERS]: [ENTER]
- Do you want to overwrite the schema, if it already exists? [YES|no]: [ENTER]

Come back to the root folder:

```bash
cd ../../..
```

Test the human_resources schema:

Connect with the database:

```bash
sql sys/$ORAREF_DB_PASSWORD@localhost:1521/FREE as sysdba
```

Set the session pointing to `C##HR`.

```sql
ALTER SESSION SET CURRENT_SCHEMA=C##HR;
```

Select any of the tables.

```sql
SELECT * FROM departments;
```

Exit SQLcl.

```sql
EXIT;
```

## Clean up

```bash
podman stop oraref
```

> Delete the container if needed:
>
> ```bash
> podman rm oraref
> ```
>
> ```bash
> zx scripts/clean.mjs
> ```
>
> If you ever loss the password, reset with `podman exec oraref ./setPassword.sh $ORAREF_DB_PASSWORD`
