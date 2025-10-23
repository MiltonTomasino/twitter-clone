const prisma = require("../db/prisma");

module.exports.getUserByUsername = async (username) => {
    return prisma.user.findUnique({ where: { username } });
}

module.exports.getUserById = async (id) => {
    return prisma.user.findUnique({ where: { id } });
}

