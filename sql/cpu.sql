SELECT
    S.SID
    || ' - '
    || VSESS.MODULE "SID - MODULE",
    DB_CPU.VALUE    AS "DB CPU"
FROM
    (
        SELECT
            DISTINCT SID
        FROM
            V$SESS_TIME_MODEL
    )         S,
    (
        SELECT
            SID,
            VALUE
        FROM
            V$SESS_TIME_MODEL
        WHERE
            STAT_NAME = 'DB CPU'
    )         DB_CPU,
    V$SESSION VSESS
WHERE
    DB_CPU.SID (+) = S.SID
    AND S.SID = VSESS.SID
    AND NVL(DB_CPU.VALUE, 0) > 0
    AND VSESS.MODULE IS NOT NULL;