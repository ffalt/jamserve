import bcrypt from 'bcrypt';
export async function bcryptPassword(password) {
    return new Promise((resolve, reject) => {
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hashAndSalt) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(hashAndSalt);
            }
        });
    });
}
export async function bcryptComparePassword(password, hashAndSalt) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashAndSalt, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
}
//# sourceMappingURL=bcrypt.js.map