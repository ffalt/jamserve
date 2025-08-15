import bcrypt from 'bcrypt';

export async function bcryptPassword(password: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const saltRounds = 10;
		bcrypt.hash(password, saltRounds, (error, hashAndSalt) => {
			if (error) {
				reject(error);
			} else {
				// bcrypt stores salt & version concatenated to the hash
				resolve(hashAndSalt);
			}
		});
	});
}

export async function bcryptComparePassword(password: string, hashAndSalt: string): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		bcrypt.compare(password, hashAndSalt, (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
}
