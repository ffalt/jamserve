import request from 'request';
import {logger} from '../../../utils/logger';
import {WebserviceClient} from '../../../utils/webservice-client';
import {GpodderPodcast, GpodderTag} from './gpodder-rest-data';

const log = logger('GPodderClient');

export interface GpodderClientConfig {
	mygpo: { baseurl: string };
	'mygpo-feedservice': { baseurl: string };
	update_timeout: number;
	valid_until: number; //custom - not in response
}

export class GpodderClient extends WebserviceClient {
	clientConfig: GpodderClientConfig | undefined;

	constructor(userAgent: string) {
		super(1, 1000, userAgent);
	}

	protected async parseResult<T>(response: request.Response, body: string): Promise<T | undefined> {
		if (response.statusCode === 404) {
			return Promise.resolve(undefined);
		}
		return super.parseResult<T>(response, body);
	}

	async validateClientConfig(): Promise<GpodderClientConfig> {
		const now = Date.now();
		if (this.clientConfig && this.clientConfig.valid_until > now) {
			return this.clientConfig;
		}
		const url = `https://gpodder.net/clientconfig.json`;
		log.info('requesting', url);
		const data = await this.getJson<GpodderClientConfig>(url);
		const isValid = data && data.mygpo?.baseurl && data['mygpo-feedservice'].baseurl && (!isNaN(data.update_timeout));
		if (!isValid) {
			throw new Error('Gpodder API has changed & can not be used with this server version');
		}
		this.clientConfig = {...data, valid_until: data.update_timeout + now};
		return this.clientConfig;
	}

	async top(amount: number): Promise<Array<GpodderPodcast>> {
		const config = await this.validateClientConfig();
		const url = `${config.mygpo.baseurl}toplist/${amount}.json`;
		log.info('requesting', url);
		const data = (await this.getJson<Array<GpodderPodcast>>(url)) || [];
		return data.map(d => this.transform(d));
	}

	async tags(amount: number): Promise<Array<GpodderTag>> {
		const config = await this.validateClientConfig();
		const url = `${config.mygpo.baseurl}api/2/tags/${amount}.json`;
		log.info('requesting', url);
		return ((await this.getJson<Array<GpodderTag>>(url)) || [])
			.filter(d => !!d.tag);
	}

	async byTag(tag: string, amount: number): Promise<Array<GpodderPodcast>> {
		const config = await this.validateClientConfig();
		const url = `${config.mygpo.baseurl}api/2/tag/${encodeURIComponent(tag)}/${amount}.json`;
		log.info('requesting', url);
		const data = (await this.getJson<Array<GpodderPodcast>>(url)) || [];
		return data.map(d => this.transform(d));
	}

	async search(name: string): Promise<Array<GpodderPodcast>> {
		const config = await this.validateClientConfig();
		const url = `${config.mygpo.baseurl}search.json?q=${encodeURIComponent(name)}`;
		log.info('requesting', url);
		const data = (await this.getJson<Array<GpodderPodcast>>(url)) || [];
		return data.map(d => this.transform(d));
	}

	private ensureHTTPS(url: string): string {
		if (url && url.toLowerCase().startsWith('http:')) {
			return 'https:' + url.slice(5);
		} else if (url && url.toLowerCase().startsWith('https:')) {
			return url;
		} else {
			return '';
		}
	}

	private transform(d: GpodderPodcast): GpodderPodcast {
		return {
			...d,
			url: this.ensureHTTPS(d.url),
			logo_url: this.ensureHTTPS(d.logo_url),
			scaled_logo_url: this.ensureHTTPS(d.scaled_logo_url),
			website: this.ensureHTTPS(d.website),
			mygpo_link: this.ensureHTTPS(d.mygpo_link)
		};
	}
}