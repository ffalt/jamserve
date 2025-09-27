var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let MediaTagRawRVA2Channel = class MediaTagRawRVA2Channel {
};
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawRVA2Channel.prototype, "type", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawRVA2Channel.prototype, "adjustment", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", Number)
], MediaTagRawRVA2Channel.prototype, "peak", void 0);
MediaTagRawRVA2Channel = __decorate([
    ResultType()
], MediaTagRawRVA2Channel);
export { MediaTagRawRVA2Channel };
let MediaTagRawRVA = class MediaTagRawRVA {
};
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawRVA.prototype, "right", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawRVA.prototype, "left", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", Number)
], MediaTagRawRVA.prototype, "peakRight", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", Number)
], MediaTagRawRVA.prototype, "peakLeft", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", Number)
], MediaTagRawRVA.prototype, "rightBack", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", Number)
], MediaTagRawRVA.prototype, "leftBack", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", Number)
], MediaTagRawRVA.prototype, "peakRightBack", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", Number)
], MediaTagRawRVA.prototype, "peakLeftBack", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", Number)
], MediaTagRawRVA.prototype, "center", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", Number)
], MediaTagRawRVA.prototype, "peakCenter", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", Number)
], MediaTagRawRVA.prototype, "bass", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", Number)
], MediaTagRawRVA.prototype, "peakBass", void 0);
MediaTagRawRVA = __decorate([
    ResultType()
], MediaTagRawRVA);
export { MediaTagRawRVA };
let MediaTagRawReplayGainAdjustment = class MediaTagRawReplayGainAdjustment {
};
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawReplayGainAdjustment.prototype, "peak", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawReplayGainAdjustment.prototype, "radioAdjustment", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawReplayGainAdjustment.prototype, "audiophileAdjustment", void 0);
MediaTagRawReplayGainAdjustment = __decorate([
    ResultType()
], MediaTagRawReplayGainAdjustment);
export { MediaTagRawReplayGainAdjustment };
let MediaTagRawSynchronisedLyricsEvent = class MediaTagRawSynchronisedLyricsEvent {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawSynchronisedLyricsEvent.prototype, "text", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawSynchronisedLyricsEvent.prototype, "timestamp", void 0);
MediaTagRawSynchronisedLyricsEvent = __decorate([
    ResultType()
], MediaTagRawSynchronisedLyricsEvent);
export { MediaTagRawSynchronisedLyricsEvent };
let MediaTagRawBin = class MediaTagRawBin {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawBin.prototype, "bin", void 0);
MediaTagRawBin = __decorate([
    ResultType()
], MediaTagRawBin);
export { MediaTagRawBin };
let MediaTagRawIdBin = class MediaTagRawIdBin {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawIdBin.prototype, "id", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawIdBin.prototype, "bin", void 0);
MediaTagRawIdBin = __decorate([
    ResultType()
], MediaTagRawIdBin);
export { MediaTagRawIdBin };
let MediaTagRawChapterToc = class MediaTagRawChapterToc {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawChapterToc.prototype, "id", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Boolean)
], MediaTagRawChapterToc.prototype, "ordered", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Boolean)
], MediaTagRawChapterToc.prototype, "topLevel", void 0);
__decorate([
    ObjectField(() => [String]),
    __metadata("design:type", Array)
], MediaTagRawChapterToc.prototype, "children", void 0);
MediaTagRawChapterToc = __decorate([
    ResultType()
], MediaTagRawChapterToc);
export { MediaTagRawChapterToc };
let MediaTagRawChapter = class MediaTagRawChapter {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawChapter.prototype, "id", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawChapter.prototype, "start", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawChapter.prototype, "end", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawChapter.prototype, "offset", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawChapter.prototype, "offsetEnd", void 0);
MediaTagRawChapter = __decorate([
    ResultType()
], MediaTagRawChapter);
export { MediaTagRawChapter };
let MediaTagRawPopularimeter = class MediaTagRawPopularimeter {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawPopularimeter.prototype, "email", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawPopularimeter.prototype, "rating", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawPopularimeter.prototype, "count", void 0);
MediaTagRawPopularimeter = __decorate([
    ResultType()
], MediaTagRawPopularimeter);
export { MediaTagRawPopularimeter };
let MediaTagRawLangDescText = class MediaTagRawLangDescText {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawLangDescText.prototype, "id", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawLangDescText.prototype, "language", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawLangDescText.prototype, "text", void 0);
MediaTagRawLangDescText = __decorate([
    ResultType()
], MediaTagRawLangDescText);
export { MediaTagRawLangDescText };
let MediaTagRawIdText = class MediaTagRawIdText {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawIdText.prototype, "id", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawIdText.prototype, "text", void 0);
MediaTagRawIdText = __decorate([
    ResultType()
], MediaTagRawIdText);
export { MediaTagRawIdText };
let MediaTagRawLink = class MediaTagRawLink {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawLink.prototype, "url", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawLink.prototype, "id", void 0);
__decorate([
    ObjectField(() => [String]),
    __metadata("design:type", Array)
], MediaTagRawLink.prototype, "additional", void 0);
MediaTagRawLink = __decorate([
    ResultType()
], MediaTagRawLink);
export { MediaTagRawLink };
let MediaTagRawGEOB = class MediaTagRawGEOB {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawGEOB.prototype, "filename", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawGEOB.prototype, "mimeType", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawGEOB.prototype, "contentDescription", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawGEOB.prototype, "bin", void 0);
MediaTagRawGEOB = __decorate([
    ResultType()
], MediaTagRawGEOB);
export { MediaTagRawGEOB };
let MediaTagRawNumber = class MediaTagRawNumber {
};
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawNumber.prototype, "num", void 0);
MediaTagRawNumber = __decorate([
    ResultType()
], MediaTagRawNumber);
export { MediaTagRawNumber };
let MediaTagRawBool = class MediaTagRawBool {
};
__decorate([
    ObjectField(),
    __metadata("design:type", Boolean)
], MediaTagRawBool.prototype, "bool", void 0);
MediaTagRawBool = __decorate([
    ResultType()
], MediaTagRawBool);
export { MediaTagRawBool };
let MediaTagRawTextList = class MediaTagRawTextList {
};
__decorate([
    ObjectField(() => [String]),
    __metadata("design:type", Array)
], MediaTagRawTextList.prototype, "list", void 0);
MediaTagRawTextList = __decorate([
    ResultType()
], MediaTagRawTextList);
export { MediaTagRawTextList };
let MediaTagRawPic = class MediaTagRawPic {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawPic.prototype, "description", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawPic.prototype, "pictureType", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", String)
], MediaTagRawPic.prototype, "url", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", String)
], MediaTagRawPic.prototype, "bin", void 0);
__decorate([
    ObjectField({ nullable: true }),
    __metadata("design:type", String)
], MediaTagRawPic.prototype, "mimeType", void 0);
MediaTagRawPic = __decorate([
    ResultType()
], MediaTagRawPic);
export { MediaTagRawPic };
let MediaTagRawAudioEncryption = class MediaTagRawAudioEncryption {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawAudioEncryption.prototype, "id", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawAudioEncryption.prototype, "previewStart", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawAudioEncryption.prototype, "previewLength", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawAudioEncryption.prototype, "bin", void 0);
MediaTagRawAudioEncryption = __decorate([
    ResultType()
], MediaTagRawAudioEncryption);
export { MediaTagRawAudioEncryption };
let MediaTagRawEventTimingCodesEvent = class MediaTagRawEventTimingCodesEvent {
};
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawEventTimingCodesEvent.prototype, "type", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawEventTimingCodesEvent.prototype, "timestamp", void 0);
MediaTagRawEventTimingCodesEvent = __decorate([
    ResultType()
], MediaTagRawEventTimingCodesEvent);
export { MediaTagRawEventTimingCodesEvent };
let MediaTagRawSynchronisedLyrics = class MediaTagRawSynchronisedLyrics {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawSynchronisedLyrics.prototype, "id", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawSynchronisedLyrics.prototype, "language", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawSynchronisedLyrics.prototype, "timestampFormat", void 0);
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawSynchronisedLyrics.prototype, "contentType", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameSynchronisedLyricsEvent]),
    __metadata("design:type", Array)
], MediaTagRawSynchronisedLyrics.prototype, "events", void 0);
MediaTagRawSynchronisedLyrics = __decorate([
    ResultType()
], MediaTagRawSynchronisedLyrics);
export { MediaTagRawSynchronisedLyrics };
let MediaTagRawText = class MediaTagRawText {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawText.prototype, "text", void 0);
MediaTagRawText = __decorate([
    ResultType()
], MediaTagRawText);
export { MediaTagRawText };
let MediaTagRawRVA2 = class MediaTagRawRVA2 {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawRVA2.prototype, "id", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameRVA2Channel]),
    __metadata("design:type", Array)
], MediaTagRawRVA2.prototype, "channels", void 0);
MediaTagRawRVA2 = __decorate([
    ResultType()
], MediaTagRawRVA2);
export { MediaTagRawRVA2 };
let MediaTagRawEventTimingCodes = class MediaTagRawEventTimingCodes {
};
__decorate([
    ObjectField(),
    __metadata("design:type", Number)
], MediaTagRawEventTimingCodes.prototype, "format", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameEventTimingCodesEvent]),
    __metadata("design:type", Array)
], MediaTagRawEventTimingCodes.prototype, "events", void 0);
MediaTagRawEventTimingCodes = __decorate([
    ResultType()
], MediaTagRawEventTimingCodes);
export { MediaTagRawEventTimingCodes };
let MediaTagRawFrame = class MediaTagRawFrame {
};
__decorate([
    ObjectField(),
    __metadata("design:type", String)
], MediaTagRawFrame.prototype, "id", void 0);
__decorate([
    ObjectField(() => Object),
    __metadata("design:type", Object)
], MediaTagRawFrame.prototype, "value", void 0);
__decorate([
    ObjectField(() => [Object], { nullable: true }),
    __metadata("design:type", Array)
], MediaTagRawFrame.prototype, "subframes", void 0);
MediaTagRawFrame = __decorate([
    ResultType({ description: 'Media Raw Tag Frame' })
], MediaTagRawFrame);
export { MediaTagRawFrame };
let MediaTagRawFrameText = class MediaTagRawFrameText extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawText, { description: 'Text content' }),
    __metadata("design:type", MediaTagRawText)
], MediaTagRawFrameText.prototype, "value", void 0);
MediaTagRawFrameText = __decorate([
    ResultType({ description: 'Media Raw Tag Text Frame' })
], MediaTagRawFrameText);
export { MediaTagRawFrameText };
let MediaTagRawFrameTextList = class MediaTagRawFrameTextList extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawTextList),
    __metadata("design:type", MediaTagRawTextList)
], MediaTagRawFrameTextList.prototype, "value", void 0);
MediaTagRawFrameTextList = __decorate([
    ResultType({ description: 'Media Raw Tag TextList Frame' })
], MediaTagRawFrameTextList);
export { MediaTagRawFrameTextList };
let MediaTagRawFrameRVA = class MediaTagRawFrameRVA extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawRVA),
    __metadata("design:type", MediaTagRawRVA)
], MediaTagRawFrameRVA.prototype, "value", void 0);
MediaTagRawFrameRVA = __decorate([
    ResultType({ description: 'Media Raw Tag RVA Frame' })
], MediaTagRawFrameRVA);
export { MediaTagRawFrameRVA };
let MediaTagRawFrameRVA2 = class MediaTagRawFrameRVA2 extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawRVA2),
    __metadata("design:type", MediaTagRawRVA2)
], MediaTagRawFrameRVA2.prototype, "value", void 0);
MediaTagRawFrameRVA2 = __decorate([
    ResultType({ description: 'Media Raw Tag RVA2 Frame' })
], MediaTagRawFrameRVA2);
export { MediaTagRawFrameRVA2 };
let MediaTagRawFrameEventTimingCodes = class MediaTagRawFrameEventTimingCodes extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawEventTimingCodes),
    __metadata("design:type", MediaTagRawEventTimingCodes)
], MediaTagRawFrameEventTimingCodes.prototype, "value", void 0);
MediaTagRawFrameEventTimingCodes = __decorate([
    ResultType({ description: 'Media Raw Tag EventTimingCodes Frame' })
], MediaTagRawFrameEventTimingCodes);
export { MediaTagRawFrameEventTimingCodes };
let MediaTagRawFrameReplayGainAdjustment = class MediaTagRawFrameReplayGainAdjustment extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawReplayGainAdjustment),
    __metadata("design:type", MediaTagRawReplayGainAdjustment)
], MediaTagRawFrameReplayGainAdjustment.prototype, "value", void 0);
MediaTagRawFrameReplayGainAdjustment = __decorate([
    ResultType({ description: 'Media Raw Tag ReplayGainAdjustment Frame' })
], MediaTagRawFrameReplayGainAdjustment);
export { MediaTagRawFrameReplayGainAdjustment };
let MediaTagRawFrameChapterToc = class MediaTagRawFrameChapterToc extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawChapterToc),
    __metadata("design:type", MediaTagRawChapterToc)
], MediaTagRawFrameChapterToc.prototype, "value", void 0);
MediaTagRawFrameChapterToc = __decorate([
    ResultType({ description: 'Media Raw Tag ChapterToc Frame' })
], MediaTagRawFrameChapterToc);
export { MediaTagRawFrameChapterToc };
let MediaTagRawFrameLangDescText = class MediaTagRawFrameLangDescText extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawLangDescText),
    __metadata("design:type", MediaTagRawLangDescText)
], MediaTagRawFrameLangDescText.prototype, "value", void 0);
MediaTagRawFrameLangDescText = __decorate([
    ResultType({ description: 'Media Raw Tag LangDescText Frame' })
], MediaTagRawFrameLangDescText);
export { MediaTagRawFrameLangDescText };
let MediaTagRawFrameGEOB = class MediaTagRawFrameGEOB extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawGEOB),
    __metadata("design:type", MediaTagRawGEOB)
], MediaTagRawFrameGEOB.prototype, "value", void 0);
MediaTagRawFrameGEOB = __decorate([
    ResultType({ description: 'Media Raw Tag GEOB Frame' })
], MediaTagRawFrameGEOB);
export { MediaTagRawFrameGEOB };
let MediaTagRawFrameIdText = class MediaTagRawFrameIdText extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawIdText),
    __metadata("design:type", MediaTagRawIdText)
], MediaTagRawFrameIdText.prototype, "value", void 0);
MediaTagRawFrameIdText = __decorate([
    ResultType({ description: 'Media Raw Tag IdText Frame' })
], MediaTagRawFrameIdText);
export { MediaTagRawFrameIdText };
let MediaTagRawFramePic = class MediaTagRawFramePic extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawPic),
    __metadata("design:type", MediaTagRawPic)
], MediaTagRawFramePic.prototype, "value", void 0);
MediaTagRawFramePic = __decorate([
    ResultType({ description: 'Media Raw Tag Pic Frame' })
], MediaTagRawFramePic);
export { MediaTagRawFramePic };
let MediaTagRawFrameChapter = class MediaTagRawFrameChapter extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawChapter),
    __metadata("design:type", MediaTagRawChapter)
], MediaTagRawFrameChapter.prototype, "value", void 0);
MediaTagRawFrameChapter = __decorate([
    ResultType({ description: 'Media Raw Tag Chapter Frame' })
], MediaTagRawFrameChapter);
export { MediaTagRawFrameChapter };
let MediaTagRawFrameBool = class MediaTagRawFrameBool extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawBool),
    __metadata("design:type", MediaTagRawBool)
], MediaTagRawFrameBool.prototype, "value", void 0);
MediaTagRawFrameBool = __decorate([
    ResultType({ description: 'Media Raw Tag Bool Frame' })
], MediaTagRawFrameBool);
export { MediaTagRawFrameBool };
let MediaTagRawFrameSynchronisedLyrics = class MediaTagRawFrameSynchronisedLyrics extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawSynchronisedLyrics),
    __metadata("design:type", MediaTagRawSynchronisedLyrics)
], MediaTagRawFrameSynchronisedLyrics.prototype, "value", void 0);
MediaTagRawFrameSynchronisedLyrics = __decorate([
    ResultType({ description: 'Media Raw Tag SynchronisedLyrics Frame' })
], MediaTagRawFrameSynchronisedLyrics);
export { MediaTagRawFrameSynchronisedLyrics };
let MediaTagRawFrameLink = class MediaTagRawFrameLink extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawLink),
    __metadata("design:type", MediaTagRawLink)
], MediaTagRawFrameLink.prototype, "value", void 0);
MediaTagRawFrameLink = __decorate([
    ResultType({ description: 'Media Raw Tag Link Frame' })
], MediaTagRawFrameLink);
export { MediaTagRawFrameLink };
let MediaTagRawFrameNumber = class MediaTagRawFrameNumber extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawNumber),
    __metadata("design:type", MediaTagRawNumber)
], MediaTagRawFrameNumber.prototype, "value", void 0);
MediaTagRawFrameNumber = __decorate([
    ResultType({ description: 'Media Raw Tag Num Frame' })
], MediaTagRawFrameNumber);
export { MediaTagRawFrameNumber };
let MediaTagRawFramePopularimeter = class MediaTagRawFramePopularimeter extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawPopularimeter),
    __metadata("design:type", MediaTagRawPopularimeter)
], MediaTagRawFramePopularimeter.prototype, "value", void 0);
MediaTagRawFramePopularimeter = __decorate([
    ResultType({ description: 'Media Raw Tag Popularimeter Frame' })
], MediaTagRawFramePopularimeter);
export { MediaTagRawFramePopularimeter };
let MediaTagRawFrameAudioEncryption = class MediaTagRawFrameAudioEncryption extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawAudioEncryption),
    __metadata("design:type", MediaTagRawAudioEncryption)
], MediaTagRawFrameAudioEncryption.prototype, "value", void 0);
MediaTagRawFrameAudioEncryption = __decorate([
    ResultType({ description: 'Media Raw Tag AudioEncryption Frame' })
], MediaTagRawFrameAudioEncryption);
export { MediaTagRawFrameAudioEncryption };
let MediaTagRawFrameBin = class MediaTagRawFrameBin extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawBin),
    __metadata("design:type", MediaTagRawBin)
], MediaTagRawFrameBin.prototype, "value", void 0);
MediaTagRawFrameBin = __decorate([
    ResultType({ description: 'Media Raw Tag Bin Frame' })
], MediaTagRawFrameBin);
export { MediaTagRawFrameBin };
let MediaTagRawFrameIdBin = class MediaTagRawFrameIdBin extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawIdBin),
    __metadata("design:type", MediaTagRawIdBin)
], MediaTagRawFrameIdBin.prototype, "value", void 0);
MediaTagRawFrameIdBin = __decorate([
    ResultType({ description: 'Media Raw Tag IdBin Frame' })
], MediaTagRawFrameIdBin);
export { MediaTagRawFrameIdBin };
let MediaTagRawFrameSynchronisedLyricsEvent = class MediaTagRawFrameSynchronisedLyricsEvent extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawSynchronisedLyricsEvent),
    __metadata("design:type", MediaTagRawSynchronisedLyricsEvent)
], MediaTagRawFrameSynchronisedLyricsEvent.prototype, "value", void 0);
MediaTagRawFrameSynchronisedLyricsEvent = __decorate([
    ResultType({ description: 'Media Raw Tag SynchronisedLyricsEvent Frame' })
], MediaTagRawFrameSynchronisedLyricsEvent);
export { MediaTagRawFrameSynchronisedLyricsEvent };
let MediaTagRawFrameEventTimingCodesEvent = class MediaTagRawFrameEventTimingCodesEvent extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawEventTimingCodesEvent),
    __metadata("design:type", MediaTagRawEventTimingCodesEvent)
], MediaTagRawFrameEventTimingCodesEvent.prototype, "value", void 0);
MediaTagRawFrameEventTimingCodesEvent = __decorate([
    ResultType({ description: 'Media Raw Tag EventTimingCodesEvent Frame' })
], MediaTagRawFrameEventTimingCodesEvent);
export { MediaTagRawFrameEventTimingCodesEvent };
let MediaTagRawFrameRVA2Channel = class MediaTagRawFrameRVA2Channel extends MediaTagRawFrame {
};
__decorate([
    ObjectField(() => MediaTagRawRVA2Channel),
    __metadata("design:type", MediaTagRawRVA2Channel)
], MediaTagRawFrameRVA2Channel.prototype, "value", void 0);
MediaTagRawFrameRVA2Channel = __decorate([
    ResultType({ description: 'Media Raw Tag RVA2Channel Frame' })
], MediaTagRawFrameRVA2Channel);
export { MediaTagRawFrameRVA2Channel };
let MediaTagRawFrames = class MediaTagRawFrames {
};
__decorate([
    ObjectField(() => [MediaTagRawFrameAudioEncryption], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "AENC", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFramePic], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "APIC", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "ASPI", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "BUF", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "CDM", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameChapter], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "CHAP", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "CM1", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameNumber], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "CNT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameLangDescText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "COM", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameLangDescText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "COMM", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "COMR", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameAudioEncryption], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "CRA", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "CRM", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameChapterToc], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "CTOC", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "ENCR", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "EQU", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "EQUA", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameEventTimingCodes], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "ETC", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameEventTimingCodes], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "ETCO", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameGEOB], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "GEO", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameGEOB], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "GEOB", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "GRID", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "GRP1", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameTextList], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "IPL", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameTextList], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "IPLS", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameLink], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "LINK", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameLink], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "LNK", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "MCDI", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "MLL", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "MLLT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "MVNM", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "MVIN", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "NCO", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "NCON", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "OWNE", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameNumber], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "PCNT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameNumber], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "PCS", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameNumber], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "PCST", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFramePic], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "PIC", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFramePopularimeter], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "POP", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFramePopularimeter], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "POPM", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "POSS", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameIdBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "PRI", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameIdBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "PRIV", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "RBUF", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "REV", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameReplayGainAdjustment], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "RGAD", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameRVA], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "RVA", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameRVA2], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "RVA2", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameRVA], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "RVAD", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "RVRB", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "SEEK", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "SIGN", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameSynchronisedLyricsEvent], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "SLT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "STC", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameSynchronisedLyrics], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "SYLT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "SYTC", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TAL", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TALB", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TBP", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TBPM", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TCM", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBool], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TCMP", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TCO", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TCOM", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TCON", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TCOP", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBool], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TCP", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TCR", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TDA", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TDAT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TDES", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TDLY", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TDOR", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TDR", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TDEN", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TDRC", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TDRL", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TDS", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TDTG", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TDY", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TEN", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TENC", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TEXT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TFLT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TGID", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TID", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TIM", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TIME", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameTextList], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TIPL", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TIT1", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TIT2", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TIT3", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TKE", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TKEY", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TKWD", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TLA", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TLAN", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TLE", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TLEN", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameTextList], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TMCL", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TMED", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TMOO", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TMT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TOA", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TOAL", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TOF", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TOFN", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TOL", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TOLY", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TOPE", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TOR", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TORY", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TOT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TOWN", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TP1", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TP2", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TP3", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TP4", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TPA", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TPB", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TPE1", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TPE2", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TPE3", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TPE4", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TPOS", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TPRO", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TPUB", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TRC", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TRCK", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TRD", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TRDA", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TRK", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TRSN", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TRSO", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TS2", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSA", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSC", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSI", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSIZ", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSO2", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSOA", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSOC", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSOP", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSOT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSST", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSP", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSRC", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSS", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TSSE", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TST", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TT1", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TT2", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TT3", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TXT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameIdText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TXX", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameIdText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TXXX", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TYE", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "TYER", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameIdText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "UFI", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameIdText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "UFID", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameLangDescText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "ULT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "USER", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameLangDescText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "USLT", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WAF", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WAR", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WAS", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WCM", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WCOM", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WCOP", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WCP", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WFD", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WFED", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WOAF", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WOAR", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WOAS", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WORS", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WPAY", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WPB", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WPUB", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameIdText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WXX", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "WXXX", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "XDOR", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameBin], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "XHD3", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "XSOA", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "XSOP", void 0);
__decorate([
    ObjectField(() => [MediaTagRawFrameText], { nullable: true, description: 'Frames' }),
    __metadata("design:type", Array)
], MediaTagRawFrames.prototype, "XSOT", void 0);
MediaTagRawFrames = __decorate([
    ResultType({ description: 'Media Raw Tag Frames' })
], MediaTagRawFrames);
export { MediaTagRawFrames };
//# sourceMappingURL=raw.model.js.map