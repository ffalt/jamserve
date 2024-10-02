import { Field, ObjectType } from 'type-graphql';
import { Track } from '../track/track.js';
import { Episode } from '../episode/episode.js';
import { DBObjectType } from '../../types/enums.js';

export class Waveform {
	obj!: Track | Episode;
	objType!: DBObjectType;
}

@ObjectType()
export class WaveformQL extends Waveform {
	@Field(() => String, { nullable: true })
	json!: string | undefined;

	@Field(() => String, { nullable: true })
	svg!: (width: number) => string | undefined;
}
