import fs from 'node:fs';
import path from 'node:path';
import { injectable } from 'inversify';
import { LandscapeArtistNode, LandscapeData, LandscapeGenreNode } from './landscape.model.js';
import { LandscapeParameters } from './landscape.parameters.js';
import { Orm } from '../../modules/engine/services/orm.service.js';

interface NoiseCoord {
	x: number;
	y: number;
}

interface LandscapeCache {
	data: LandscapeData;
	cachedAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

function simpleHash(string_: string): number {
	let h = 0;
	for (const ch of string_) {
		h = Math.trunc(Math.imul(31, h) + (ch.codePointAt(0) ?? 0));
	}
	return Math.abs(h);
}

function normalizeGenreName(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replaceAll(/\s*\([^)]*\)/g, '')
		.replaceAll(/\s*\[[^\]]*\]/g, '');
}

@injectable()
export class LandscapeService {
	private cacheMap = new Map<string, LandscapeCache>();
	private noiseData: Record<string, NoiseCoord> | undefined;

	private loadNoiseData(): Record<string, NoiseCoord> {
		if (!this.noiseData) {
			const filePath = path.resolve('./static/autotagging/every-noise-genres.json');
			const raw = fs.readFileSync(filePath, 'utf8');
			this.noiseData = JSON.parse(raw) as Record<string, NoiseCoord>;
		}
		return this.noiseData;
	}

	private matchNoiseCoord(name: string, noiseMap: Record<string, NoiseCoord>): NoiseCoord | undefined {
		const normalized = normalizeGenreName(name);
		// exact match
		if (Object.hasOwn(noiseMap, normalized)) {
			return noiseMap[normalized];
		}
		// strip trailing "s" (plural)
		const singular = normalized.slice(0, -1);
		if (normalized.endsWith('s') && Object.hasOwn(noiseMap, singular)) {
			return noiseMap[singular];
		}
		// check if any ENAO name contains the local name
		for (const [key, value] of Object.entries(noiseMap)) {
			if (key.includes(normalized)) {
				return value;
			}
		}
		return undefined;
	}

	clearCache(): void {
		this.cacheMap.clear();
	}

	async getLandscape(orm: Orm, parameters?: LandscapeParameters): Promise<LandscapeData> {
		const cacheKey = [
			parameters?.ignoreUnknownGenres ? '1' : '0',
			parameters?.artistsWithAlbumsOnly ? '1' : '0',
			parameters?.ignoreUnpositionedArtists ? '1' : '0',
			parameters?.minGenreTrackCount ?? 0,
			parameters?.minGenreArtistCount ?? 0,
			parameters?.minArtistTrackCount ?? 0
		].join(':');
		const now = Date.now();
		const cached = this.cacheMap.get(cacheKey);
		if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
			return cached.data;
		}
		const data = await this.build(orm, parameters);
		this.cacheMap.set(cacheKey, { data, cachedAt: now });
		return data;
	}

	private async build(orm: Orm, parameters?: LandscapeParameters): Promise<LandscapeData> {
		const noiseMap = this.loadNoiseData();

		// Load all genres
		const ormGenres = await orm.Genre.find({});
		const genreNodes: Array<LandscapeGenreNode> = [];
		const genreNoiseMap = new Map<string, NoiseCoord>();
		let matchedCount = 0;

		for (const g of ormGenres) {
			const trackCount = await g.tracks.count();
			const artistCount = await g.artists.count();
			const albumCount = await g.albums.count();
			const coord = this.matchNoiseCoord(g.name, noiseMap);
			if (coord) {
				matchedCount++;
				genreNoiseMap.set(g.id, coord);
			}
			if (!coord && parameters?.ignoreUnknownGenres) {
				continue;
			}
			if (parameters?.minGenreTrackCount !== undefined && trackCount < parameters.minGenreTrackCount) {
				continue;
			}
			if (parameters?.minGenreArtistCount !== undefined && artistCount < parameters.minGenreArtistCount) {
				continue;
			}
			genreNodes.push({
				id: g.id,
				name: g.name,
				trackCount,
				artistCount,
				albumCount,
				noiseX: coord?.x,
				noiseY: coord?.y
			});
		}

		// Load all artists
		const ormArtists = await orm.Artist.find({});
		const artistNodes: Array<LandscapeArtistNode> = [];
		const jitter = 0.012;

		for (const a of ormArtists) {
			const genres = await a.genres.getItems();
			const genreIDs = genres.map(g => g.id);
			const albumCount = await a.albums.count();
			const trackCount = await a.tracks.count();

			if (albumCount === 0 && parameters?.artistsWithAlbumsOnly) {
				continue;
			}
			if (parameters?.minArtistTrackCount !== undefined && trackCount < parameters.minArtistTrackCount) {
				continue;
			}

			// Compute centroid from matched genre positions
			const matchedCoords = genreIDs
				.map(id => genreNoiseMap.get(id))
				.filter((c): c is NoiseCoord => c !== undefined);

			let noiseX: number | undefined;
			let noiseY: number | undefined;

			if (matchedCoords.length > 0) {
				const cx = matchedCoords.reduce((s, c) => s + c.x, 0) / matchedCoords.length;
				const cy = matchedCoords.reduce((s, c) => s + c.y, 0) / matchedCoords.length;
				const hash = simpleHash(a.id);
				noiseX = cx + ((hash % 1000) / 1000 - 0.5) * jitter * 2;
				noiseY = cy + (((hash >> 10) % 1000) / 1000 - 0.5) * jitter * 2;
			}

			if (noiseX === undefined && parameters?.ignoreUnpositionedArtists) {
				continue;
			}

			artistNodes.push({
				id: a.id,
				name: a.name,
				albumCount,
				trackCount,
				genreIDs,
				noiseX,
				noiseY
			});
		}

		const noiseMatchRate = ormGenres.length > 0 ? matchedCount / ormGenres.length : 0;

		return {
			genres: genreNodes,
			artists: artistNodes,
			noiseMatchRate
		};
	}
}
