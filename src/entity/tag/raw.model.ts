import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType()
export class MediaTagRawRVA2Channel {
	@ObjectField()
	type!: number;

	@ObjectField()
	adjustment!: number;

	@ObjectField({ nullable: true })
	peak?: number;
}

@ResultType()
export class MediaTagRawRVA {
	@ObjectField()
	right!: number;

	@ObjectField()
	left!: number;

	@ObjectField({ nullable: true })
	peakRight?: number;

	@ObjectField({ nullable: true })
	peakLeft?: number;

	@ObjectField({ nullable: true })
	rightBack?: number;

	@ObjectField({ nullable: true })
	leftBack?: number;

	@ObjectField({ nullable: true })
	peakRightBack?: number;

	@ObjectField({ nullable: true })
	peakLeftBack?: number;

	@ObjectField({ nullable: true })
	center?: number;

	@ObjectField({ nullable: true })
	peakCenter?: number;

	@ObjectField({ nullable: true })
	bass?: number;

	@ObjectField({ nullable: true })
	peakBass?: number;
}

@ResultType()
export class MediaTagRawReplayGainAdjustment {
	@ObjectField()
	peak!: number;

	@ObjectField()
	radioAdjustment!: number;

	@ObjectField()
	audiophileAdjustment!: number;
}

@ResultType()
export class MediaTagRawSynchronisedLyricsEvent {
	@ObjectField()
	text!: string;

	@ObjectField()
	timestamp!: number;
}

@ResultType()
export class MediaTagRawBin {
	@ObjectField()
	bin!: string;
}

@ResultType()
export class MediaTagRawIdBin {
	@ObjectField()
	id!: string;

	@ObjectField()
	bin!: string;
}

@ResultType()
export class MediaTagRawChapterToc {
	@ObjectField()
	id!: string;

	@ObjectField()
	ordered!: boolean;

	@ObjectField()
	topLevel!: boolean;

	@ObjectField(() => [String])
	children!: Array<string>;
}

@ResultType()
export class MediaTagRawChapter {
	@ObjectField()
	id!: string;

	@ObjectField()
	start!: number;

	@ObjectField()
	end!: number;

	@ObjectField()
	offset!: number;

	@ObjectField()
	offsetEnd!: number;
}

@ResultType()
export class MediaTagRawPopularimeter {
	@ObjectField()
	email!: string;

	@ObjectField()
	rating!: number;

	@ObjectField()
	count!: number;
}

@ResultType()
export class MediaTagRawLangDescText {
	@ObjectField()
	id!: string;

	@ObjectField()
	language!: string;

	@ObjectField()
	text!: string;
}

@ResultType()
export class MediaTagRawIdText {
	@ObjectField()
	id!: string;

	@ObjectField()
	text!: string;
}

@ResultType()
export class MediaTagRawLink {
	@ObjectField()
	url!: string;

	@ObjectField()
	id!: string;

	@ObjectField(() => [String])
	additional!: Array<string>;
}

@ResultType()
export class MediaTagRawGEOB {
	@ObjectField()
	filename!: string;

	@ObjectField()
	mimeType!: string;

	@ObjectField()
	contentDescription!: string;

	@ObjectField()
	bin!: string;
}

@ResultType()
export class MediaTagRawNumber {
	@ObjectField()
	num!: number;
}

@ResultType()
export class MediaTagRawBool {
	@ObjectField()
	bool!: boolean;
}

@ResultType()
export class MediaTagRawTextList {
	@ObjectField(() => [String])
	list!: Array<string>;
}

@ResultType()
export class MediaTagRawPic {
	@ObjectField()
	description!: string;

	@ObjectField()
	pictureType!: number;

	@ObjectField({ nullable: true })
	url?: string;

	@ObjectField({ nullable: true })
	bin?: string;

	@ObjectField({ nullable: true })
	mimeType?: string;
}

@ResultType()
export class MediaTagRawAudioEncryption {
	@ObjectField()
	id!: string;

	@ObjectField()
	previewStart!: number;

	@ObjectField()
	previewLength!: number;

	@ObjectField()
	bin!: string;
}

@ResultType()
export class MediaTagRawEventTimingCodesEvent {
	@ObjectField()
	type!: number;

	@ObjectField()
	timestamp!: number;
}

@ResultType()
export class MediaTagRawSynchronisedLyrics {
	@ObjectField()
	id!: string;

	@ObjectField()
	language!: string;

	@ObjectField()
	timestampFormat!: number;

	@ObjectField()
	contentType!: number;

	@ObjectField(() => [MediaTagRawFrameSynchronisedLyricsEvent])
	events!: Array<MediaTagRawFrameSynchronisedLyricsEvent>;
}

@ResultType()
export class MediaTagRawText {
	@ObjectField()
	text!: string;
}

@ResultType()
export class MediaTagRawRVA2 {
	@ObjectField()
	id!: string;

	@ObjectField(() => [MediaTagRawFrameRVA2Channel])
	channels!: Array<MediaTagRawFrameRVA2Channel>;
}

@ResultType()
export class MediaTagRawEventTimingCodes {
	@ObjectField()
	format!: number;

	@ObjectField(() => [MediaTagRawFrameEventTimingCodesEvent])
	events!: Array<MediaTagRawFrameEventTimingCodesEvent>;
}

@ResultType({ description: 'Media Raw Tag Frame' })
export class MediaTagRawFrame {
	@ObjectField()
	id!: string;

	@ObjectField(() => Object)
	value!: unknown;

	@ObjectField(() => [Object], { nullable: true })
	subframes?: Array<MediaTagRawFrame>;
}

@ResultType({ description: 'Media Raw Tag Text Frame' })
export class MediaTagRawFrameText extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawText, { description: 'Text content' })
	value!: MediaTagRawText;
}

@ResultType({ description: 'Media Raw Tag TextList Frame' })
export class MediaTagRawFrameTextList extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawTextList)
	value!: MediaTagRawTextList;
}

@ResultType({ description: 'Media Raw Tag RVA Frame' })
export class MediaTagRawFrameRVA extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawRVA)
	value!: MediaTagRawRVA;
}

@ResultType({ description: 'Media Raw Tag RVA2 Frame' })
export class MediaTagRawFrameRVA2 extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawRVA2)
	value!: MediaTagRawRVA2;
}

@ResultType({ description: 'Media Raw Tag EventTimingCodes Frame' })
export class MediaTagRawFrameEventTimingCodes extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawEventTimingCodes)
	value!: MediaTagRawEventTimingCodes;
}

@ResultType({ description: 'Media Raw Tag ReplayGainAdjustment Frame' })
export class MediaTagRawFrameReplayGainAdjustment extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawReplayGainAdjustment)
	value!: MediaTagRawReplayGainAdjustment;
}

@ResultType({ description: 'Media Raw Tag ChapterToc Frame' })
export class MediaTagRawFrameChapterToc extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawChapterToc)
	value!: MediaTagRawChapterToc;
}

@ResultType({ description: 'Media Raw Tag LangDescText Frame' })
export class MediaTagRawFrameLangDescText extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawLangDescText)
	value!: MediaTagRawLangDescText;
}

@ResultType({ description: 'Media Raw Tag GEOB Frame' })
export class MediaTagRawFrameGEOB extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawGEOB)
	value!: MediaTagRawGEOB;
}

@ResultType({ description: 'Media Raw Tag IdText Frame' })
export class MediaTagRawFrameIdText extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawIdText)
	value!: MediaTagRawIdText;
}

@ResultType({ description: 'Media Raw Tag Pic Frame' })
export class MediaTagRawFramePic extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawPic)
	value!: MediaTagRawPic;
}

@ResultType({ description: 'Media Raw Tag Chapter Frame' })
export class MediaTagRawFrameChapter extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawChapter)
	value!: MediaTagRawChapter;
}

@ResultType({ description: 'Media Raw Tag Bool Frame' })
export class MediaTagRawFrameBool extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawBool)
	value!: MediaTagRawBool;
}

@ResultType({ description: 'Media Raw Tag SynchronisedLyrics Frame' })
export class MediaTagRawFrameSynchronisedLyrics extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawSynchronisedLyrics)
	value!: MediaTagRawSynchronisedLyrics;
}

@ResultType({ description: 'Media Raw Tag Link Frame' })
export class MediaTagRawFrameLink extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawLink)
	value!: MediaTagRawLink;
}

@ResultType({ description: 'Media Raw Tag Num Frame' })
export class MediaTagRawFrameNumber extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawNumber)
	value!: MediaTagRawNumber;
}

@ResultType({ description: 'Media Raw Tag Popularimeter Frame' })
export class MediaTagRawFramePopularimeter extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawPopularimeter)
	value!: MediaTagRawPopularimeter;
}

@ResultType({ description: 'Media Raw Tag AudioEncryption Frame' })
export class MediaTagRawFrameAudioEncryption extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawAudioEncryption)
	value!: MediaTagRawAudioEncryption;
}

@ResultType({ description: 'Media Raw Tag Bin Frame' })
export class MediaTagRawFrameBin extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawBin)
	value!: MediaTagRawBin;
}

@ResultType({ description: 'Media Raw Tag IdBin Frame' })
export class MediaTagRawFrameIdBin extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawIdBin)
	value!: MediaTagRawIdBin;
}

@ResultType({ description: 'Media Raw Tag SynchronisedLyricsEvent Frame' })
export class MediaTagRawFrameSynchronisedLyricsEvent extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawSynchronisedLyricsEvent)
	value!: MediaTagRawSynchronisedLyricsEvent;
}

@ResultType({ description: 'Media Raw Tag EventTimingCodesEvent Frame' })
export class MediaTagRawFrameEventTimingCodesEvent extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawEventTimingCodesEvent)
	value!: MediaTagRawEventTimingCodesEvent;
}

@ResultType({ description: 'Media Raw Tag RVA2Channel Frame' })
export class MediaTagRawFrameRVA2Channel extends MediaTagRawFrame {
	@ObjectField(() => MediaTagRawRVA2Channel)
	value!: MediaTagRawRVA2Channel;
}

@ResultType({ description: 'Media Raw Tag Frames' })
export class MediaTagRawFrames {
	[key: string]: Array<MediaTagRawFrame> | undefined;

	@ObjectField(() => [MediaTagRawFrameAudioEncryption], { nullable: true, description: 'Frames' })
	AENC?: Array<MediaTagRawFrameAudioEncryption>;

	@ObjectField(() => [MediaTagRawFramePic], { nullable: true, description: 'Frames' })
	APIC?: Array<MediaTagRawFramePic>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	ASPI?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	BUF?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	CDM?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameChapter], { nullable: true, description: 'Frames' })
	CHAP?: Array<MediaTagRawFrameChapter>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	CM1?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameNumber], { nullable: true, description: 'Frames' })
	CNT?: Array<MediaTagRawFrameNumber>;

	@ObjectField(() => [MediaTagRawFrameLangDescText], { nullable: true, description: 'Frames' })
	COM?: Array<MediaTagRawFrameLangDescText>;

	@ObjectField(() => [MediaTagRawFrameLangDescText], { nullable: true, description: 'Frames' })
	COMM?: Array<MediaTagRawFrameLangDescText>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	COMR?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameAudioEncryption], { nullable: true, description: 'Frames' })
	CRA?: Array<MediaTagRawFrameAudioEncryption>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	CRM?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameChapterToc], { nullable: true, description: 'Frames' })
	CTOC?: Array<MediaTagRawFrameChapterToc>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	ENCR?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	EQU?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	EQUA?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameEventTimingCodes], { nullable: true, description: 'Frames' })
	ETC?: Array<MediaTagRawFrameEventTimingCodes>;

	@ObjectField(() => [MediaTagRawFrameEventTimingCodes], { nullable: true, description: 'Frames' })
	ETCO?: Array<MediaTagRawFrameEventTimingCodes>;

	@ObjectField(() => [MediaTagRawFrameGEOB], { nullable: true, description: 'Frames' })
	GEO?: Array<MediaTagRawFrameGEOB>;

	@ObjectField(() => [MediaTagRawFrameGEOB], { nullable: true, description: 'Frames' })
	GEOB?: Array<MediaTagRawFrameGEOB>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	GRID?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	GRP1?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameTextList], { nullable: true, description: 'Frames' })
	IPL?: Array<MediaTagRawFrameTextList>;

	@ObjectField(() => [MediaTagRawFrameTextList], { nullable: true, description: 'Frames' })
	IPLS?: Array<MediaTagRawFrameTextList>;

	@ObjectField(() => [MediaTagRawFrameLink], { nullable: true, description: 'Frames' })
	LINK?: Array<MediaTagRawFrameLink>;

	@ObjectField(() => [MediaTagRawFrameLink], { nullable: true, description: 'Frames' })
	LNK?: Array<MediaTagRawFrameLink>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	MCDI?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	MLL?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	MLLT?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	MVNM?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	MVIN?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	NCO?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	NCON?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	OWNE?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameNumber], { nullable: true, description: 'Frames' })
	PCNT?: Array<MediaTagRawFrameNumber>;

	@ObjectField(() => [MediaTagRawFrameNumber], { nullable: true, description: 'Frames' })
	PCS?: Array<MediaTagRawFrameNumber>;

	@ObjectField(() => [MediaTagRawFrameNumber], { nullable: true, description: 'Frames' })
	PCST?: Array<MediaTagRawFrameNumber>;

	@ObjectField(() => [MediaTagRawFramePic], { nullable: true, description: 'Frames' })
	PIC?: Array<MediaTagRawFramePic>;

	@ObjectField(() => [MediaTagRawFramePopularimeter], { nullable: true, description: 'Frames' })
	POP?: Array<MediaTagRawFramePopularimeter>;

	@ObjectField(() => [MediaTagRawFramePopularimeter], { nullable: true, description: 'Frames' })
	POPM?: Array<MediaTagRawFramePopularimeter>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	POSS?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameIdBin], { nullable: true, description: 'Frames' })
	PRI?: Array<MediaTagRawFrameIdBin>;

	@ObjectField(() => [MediaTagRawFrameIdBin], { nullable: true, description: 'Frames' })
	PRIV?: Array<MediaTagRawFrameIdBin>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	RBUF?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	REV?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameReplayGainAdjustment], { nullable: true, description: 'Frames' })
	RGAD?: Array<MediaTagRawFrameReplayGainAdjustment>;

	@ObjectField(() => [MediaTagRawFrameRVA], { nullable: true, description: 'Frames' })
	RVA?: Array<MediaTagRawFrameRVA>;

	@ObjectField(() => [MediaTagRawFrameRVA2], { nullable: true, description: 'Frames' })
	RVA2?: Array<MediaTagRawFrameRVA2>;

	@ObjectField(() => [MediaTagRawFrameRVA], { nullable: true, description: 'Frames' })
	RVAD?: Array<MediaTagRawFrameRVA>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	RVRB?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	SEEK?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	SIGN?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameSynchronisedLyricsEvent], { nullable: true, description: 'Frames' })
	SLT?: Array<MediaTagRawFrameSynchronisedLyricsEvent>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	STC?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameSynchronisedLyrics], { nullable: true, description: 'Frames' })
	SYLT?: Array<MediaTagRawFrameSynchronisedLyrics>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	SYTC?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TAL?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TALB?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TBP?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TBPM?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TCM?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameBool], { nullable: true, description: 'Frames' })
	TCMP?: Array<MediaTagRawFrameBool>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TCO?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TCOM?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TCON?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TCOP?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameBool], { nullable: true, description: 'Frames' })
	TCP?: Array<MediaTagRawFrameBool>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TCR?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TDA?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TDAT?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TDES?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TDLY?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TDOR?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TDR?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TDEN?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TDRC?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TDRL?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TDS?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TDTG?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TDY?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TEN?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TENC?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TEXT?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TFLT?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TGID?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TID?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TIM?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TIME?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameTextList], { nullable: true, description: 'Frames' })
	TIPL?: Array<MediaTagRawFrameTextList>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TIT1?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TIT2?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TIT3?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TKE?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TKEY?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	TKWD?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TLA?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TLAN?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TLE?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TLEN?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameTextList], { nullable: true, description: 'Frames' })
	TMCL?: Array<MediaTagRawFrameTextList>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TMED?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TMOO?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TMT?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TOA?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TOAL?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TOF?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TOFN?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TOL?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TOLY?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TOPE?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TOR?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TORY?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TOT?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TOWN?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TP1?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TP2?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TP3?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TP4?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TPA?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TPB?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TPE1?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TPE2?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TPE3?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TPE4?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TPOS?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TPRO?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TPUB?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TRC?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TRCK?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TRD?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TRDA?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TRK?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TRSN?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TRSO?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TS2?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSA?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSC?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSI?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSIZ?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSO2?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSOA?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSOC?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSOP?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSOT?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSST?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSP?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSRC?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSS?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TSSE?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TST?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TT1?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TT2?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TT3?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TXT?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameIdText], { nullable: true, description: 'Frames' })
	TXX?: Array<MediaTagRawFrameIdText>;

	@ObjectField(() => [MediaTagRawFrameIdText], { nullable: true, description: 'Frames' })
	TXXX?: Array<MediaTagRawFrameIdText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TYE?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	TYER?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameIdText], { nullable: true, description: 'Frames' })
	UFI?: Array<MediaTagRawFrameIdText>;

	@ObjectField(() => [MediaTagRawFrameIdText], { nullable: true, description: 'Frames' })
	UFID?: Array<MediaTagRawFrameIdText>;

	@ObjectField(() => [MediaTagRawFrameLangDescText], { nullable: true, description: 'Frames' })
	ULT?: Array<MediaTagRawFrameLangDescText>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	USER?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameLangDescText], { nullable: true, description: 'Frames' })
	USLT?: Array<MediaTagRawFrameLangDescText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WAF?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WAR?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WAS?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WCM?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WCOM?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WCOP?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WCP?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WFD?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WFED?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WOAF?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WOAR?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WOAS?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WORS?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WPAY?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WPB?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WPUB?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameIdText], { nullable: true, description: 'Frames' })
	WXX?: Array<MediaTagRawFrameIdText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	WXXX?: Array<MediaTagRawFrameIdText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	XDOR?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' })
	XHD3?: Array<MediaTagRawFrameBin>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	XSOA?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	XSOP?: Array<MediaTagRawFrameText>;

	@ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' })
	XSOT?: Array<MediaTagRawFrameText>;
}
