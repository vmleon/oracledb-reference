# Oracle Database Reference

This repository is a reference for SQL and PL/SQL on Oracle Database.

It mainly use [Oracle Database Free](https://container-registry.oracle.com/ords/f?p=113:4:106400253224037:::4:P4_REPOSITORY,AI_REPOSITORY,AI_REPOSITORY_NAME,P4_REPOSITORY_NAME,P4_EULA_ID,P4_BUSINESS_AREA_ID:1863,1863,Oracle%20Database%20Free,Oracle%20Database%20Free,1,0&cs=37IPjmISICL3s0qChwV7EiEH9KxXQpPaf3inido3YaT6mvL78fWQQSgZAyUDX5rnjjDm1y3yxbFB-DZ8Nhol0ig) run in a container.

## Requirements

You need:

- SQLcl
- Podman
- jq

## Get Started

All the values like passwords, etc are keep in `env.json`. You need to create the file from the template the first time you get the project.

```bash
cp env.json.template env.json
```

Generate passwords with OpenSSL:

```bash
openssl rand -base64 16
```

Fill the information on `env.json`.

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
    -e ORACLE_PWD="$(jq -r .db_password env.json)" \
    -v $(pwd)/data:/opt/oracle/oradata \
    container-registry.oracle.com/database/free:latest
```

## Connect

To connect to the database at the `CDB$ROOT` level as `sysdba`

```bash
sql sys/$(jq -r .db_password env.json)@localhost:1521/FREE as sysdba
```

To connect as non `sysdba` at the `CDB$ROOT` level

```bash
sql system/$(jq -r .db_password env.json)@localhost:1521/FREE
```

To connect to the default Pluggable Database (`PDB`) within the `FREE` Database:

```bash
sql pdbadmin/$(jq -r .db_password env.json)@localhost:1521/FREEPDB1
```

```sql
select banner_full from v$version;
```
