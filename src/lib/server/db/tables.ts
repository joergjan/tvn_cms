export const auth_user = `
CREATE TABLE IF NOT EXISTS auth_user (
    id TEXT PRIMARY KEY
    name TEXT NOT NULL
    email TEXT NOT NULL
);
`;

export const user_key = `
CREATE TABLE IF NOT EXISTS user_key (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES auth_user(id),
    hashed_password TEXT
);
`;

export const user_session = `
CREATE TABLE IF NOT EXISTS user_session (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES auth_user(id),
    active_expires BIGINT NOT NULL,
    idle_expires BIGINT NOT NULL
);
`;

export const riege = `
CREATE TABLE IF NOT EXISTS riege (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    age TEXT
);
`;

export const person = `
CREATE TABLE IF NOT EXISTS person (
    id SERIAL PRIMARY KEY,
    firstName TEXT NOT NULL,
    name TEXT NOT NULL,
    isVorstand BOOLEAN NOT NULL,
    email TEXT NOT NULL,
    roleId INT
);
`;

export const trainingszeit = `
CREATE TABLE IF NOT EXISTS trainingszeit (
    id SERIAL PRIMARY KEY,
    riegeId INT NOT NULL REFERENCES riege(id) ON DELETE CASCADE,
    weekdayId INT,
    from TIME NOT NULL,
    to TIME NOT NULL
);
`;

export const weekday = `
CREATE TABLE IF NOT EXISTS weekday (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);
`;

export const personriege = `
CREATE TABLE IF NOT EXISTS personriege (
    personId INT NOT NULL REFERENCES person(id) ON DELETE CASCADE,
    riegeId INT NOT NULL REFERENCES riege(id) ON DELETE CASCADE,
    PRIMARY KEY (personId, riegeId)
);
`;
