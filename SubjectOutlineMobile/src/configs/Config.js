import secrets from "./Secret";

const sharedENV = {
    CLIENT_ID: secrets.CLIENT_ID,
    CLIENT_SECRET: secrets.CLIENT_SECRET,
    FIREBASE_API: secrets.FIREBASE_API,
    FIREBASE_RTDB_URL: secrets.FIREBASE_RTDB_URL,
    MAILGUN_API: secrets.MAILGUN_API,
    MAILGUN_DOMAIN: secrets.MAILGUN_DOMAIN,
}

const ENV = {
    dev: {
        ...sharedENV,
        BASE_URL: secrets.DEV_BASE_URL,
    },
    staging: {
        ...sharedENV,
        BASE_URL: secrets.STAGING_BASE_URL,
    },
    prod: {
        ...sharedENV,
        BASE_URL: secrets.PROD_BASE_URL,
    },
};

export default getENV = (env = '') => {
    if (env === null || env === undefined || env === '') return ENV.dev;
    if (env.indexOf('dev') !== -1) return ENV.dev;
    if (env.indexOf('staging') !== -1) return ENV.staging;
    if (env.indexOf('prod') !== -1) return ENV.prod;
};
