import {DBElastic} from './db-elastic';

export class TestElastic {
	database: DBElastic;
	name = 'elastic';

	constructor() {
		this.database = new DBElastic(
			{
				host: 'localhost:9200',
				indexPrefix: 'jamtest',
				indexRefresh: 'true' // important for the tests! otherwise, async index changes are not immediately applied and therefor invisible in a following tests
			}
		);
	}

	async setup() {
		await this.database.open();
		await this.database.drop();
		await this.database.check();
	}

	async cleanup() {
		await this.database.drop();
		await this.database.close();
	}
}
