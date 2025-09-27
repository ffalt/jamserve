import bcrypt from 'bcrypt';
export async function bcryptPassword(password) {
    return new Promise((resolve, reject) => {
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (error, hashAndSalt) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(hashAndSalt);
            }
        });
    });
}
export async function bcryptComparePassword(password, hashAndSalt) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashAndSalt, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
//# sourceMappingURL=bcrypt.js.map