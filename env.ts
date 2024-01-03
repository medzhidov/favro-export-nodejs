import yargs from "yargs";

const env = {
    organizationId: yargs(process.argv).argv.organizationId,
    email: yargs(process.argv).argv.email,
    token: yargs(process.argv).argv.token,
};

if (!env.organizationId) {
    console.error('--organizationId is required param');
    process.exit();
}

if (!env.email) {
    console.error('--email is required param');
    process.exit();
}

if (!env.token) {
    console.error('--token is required param');
    process.exit();
}

export default env;
