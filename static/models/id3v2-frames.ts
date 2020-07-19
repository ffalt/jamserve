export declare namespace ID3v2Frames {

	export interface Frame {
		id: string;
		value: any;
		subframes?: Array<Frame>;
	}

	export interface IdAscii extends Frame {
		value: {
			id: string;
			text: string;
		};
	}

	export interface LangDescText extends Frame {
		value: {
			language: string;
			id: string; // description
			text: string;
		};
	}

	export interface Pic extends Frame {
		value: {
			description: string;
			pictureType: number;
			url?: string;
			bin?: string;
			mimeType?: string;
		};
	}

	export interface Bin extends Frame {
		value: {
			bin: string;
		};
	}

	export interface Num extends Frame {
		value: {
			num: number;
		};
	}

	export interface RVA extends Frame {
		value: {
			right: number;
			left: number;
			peakRight?: number;
			peakLeft?: number;
			rightBack?: number;
			leftBack?: number;
			peakRightBack?: number;
			peakLeftBack?: number;
			center?: number;
			peakCenter?: number;
			bass?: number;
			peakBass?: number;
		};
	}

	export interface RVA2Channel extends Frame {
		value: {
			type: number;
			adjustment: number;
			peak?: number;
		};
	}

	export interface RVA2 extends Frame {
		value: {
			id: string;
			channels: Array<RVA2Channel>;
		};
	}

	export interface Popularimeter extends Frame {
		value: {
			rating: number;
			count: number;
			email: string;
		};
	}

	export interface Bool extends Frame {
		value: {
			bool: boolean;
		};
	}

	export interface AudioEncryption extends Frame {
		value: {
			id: string;
			previewStart: number;
			previewLength: number;
			bin: string;
		};
	}

	export interface Link extends Frame {
		value: {
			url: string;
			id: string;
			additional: Array<string>;
		};
	}

	export interface EventTimingCodes extends Frame {
		value: {
			format: number;
			events: Array<EventTimingCodesEvent>;
		};
	}

	export interface EventTimingCodesEvent extends Frame {
		value: {
			type: number;
			timestamp: number;
		};
	}

	export interface SynchronisedLyrics extends Frame {
		value: {
			id: string;
			language: string;
			timestampFormat: number;
			contentType: number;
			events: Array<SynchronisedLyricsEvent>;
		};
	}

	export interface SynchronisedLyricsEvent extends Frame {
		value: {
			timestamp: number;
			text: string;
		};
	}

	export interface GEOB extends Frame {
		value: {
			filename: string;
			mimeType: string;
			contentDescription: string;
			bin: string;
		};
	}

	export interface ReplayGainAdjustment extends Frame {
		value: {
			peak: number;
			radioAdjustment: number;
			audiophileAdjustment: number;
		};
	}

	export interface ChapterToc extends Frame {
		value: {
			id: string;
			ordered: boolean;
			topLevel: boolean;
			children: Array<string>;
		};
	}

	export interface Chapter extends Frame {
		value: {
			id: string;
			start: number;
			end: number;
			offset: number;
			offsetEnd: number;
		};
	}

	export interface IdBin extends Frame {
		value: {
			id: string;
			bin: string;
		};
	}

	export interface IdText extends Frame {
		value: {
			id: string;
			text: string;
		};
	}

	export interface Ascii extends Frame {
		value: {
			text: string;
		};
	}

	export interface Text extends Frame {
		value: {
			text: string;
		};
	}

	export interface TextList extends Frame {
		value: {
			list: Array<string>;
		};
	}

	export interface Frames {
		[name: string]: Array<Frame> | undefined;

		'AENC'?: Array<AudioEncryption>;
		'APIC'?: Array<Pic>;
		'ASPI'?: Array<Bin>;
		'BUF'?: Array<Bin>;
		'CDM'?: Array<Bin>;
		'CHAP'?: Array<Chapter>;
		'CM1'?: Array<Text>;
		'CNT'?: Array<Num>;
		'COM'?: Array<LangDescText>;
		'COMM'?: Array<LangDescText>;
		'COMR'?: Array<Bin>;
		'CRA'?: Array<AudioEncryption>;
		'CRM'?: Array<Bin>;
		'CTOC'?: Array<ChapterToc>;
		'ENCR'?: Array<Bin>;
		'EQU'?: Array<Bin>;
		'EQUA'?: Array<Bin>;
		'ETC'?: Array<EventTimingCodes>;
		'ETCO'?: Array<EventTimingCodes>;
		'GEO'?: Array<GEOB>;
		'GEOB'?: Array<GEOB>;
		'GRID'?: Array<Bin>;
		'GRP1'?: Array<Text>;
		'IPL'?: Array<TextList>;
		'IPLS'?: Array<TextList>;
		'LINK'?: Array<Link>;
		'LNK'?: Array<Link>;
		'MCDI'?: Array<Bin>;
		'MLL'?: Array<Bin>;
		'MLLT'?: Array<Bin>;
		'MVNM'?: Array<Text>;
		'MVIN'?: Array<Text>;
		'NCO'?: Array<Bin>;
		'NCON'?: Array<Bin>;
		'OWNE'?: Array<Bin>;
		'PCNT'?: Array<Num>;
		'PCS'?: Array<Num>;
		'PCST'?: Array<Num>;
		'PIC'?: Array<Pic>;
		'POP'?: Array<Popularimeter>;
		'POPM'?: Array<Popularimeter>;
		'POSS'?: Array<Bin>;
		'PRI'?: Array<IdBin>;
		'PRIV'?: Array<IdBin>;
		'RBUF'?: Array<Bin>;
		'REV'?: Array<Bin>;
		'RGAD'?: Array<ReplayGainAdjustment>;
		'RVA'?: Array<RVA>;
		'RVA2'?: Array<RVA2>;
		'RVAD'?: Array<RVA>;
		'RVRB'?: Array<Bin>;
		'SEEK'?: Array<Bin>;
		'SIGN'?: Array<Bin>;
		'SLT'?: Array<SynchronisedLyricsEvent>;
		'STC'?: Array<Bin>;
		'SYLT'?: Array<SynchronisedLyrics>;
		'SYTC'?: Array<Bin>;
		'TAL'?: Array<Text>;
		'TALB'?: Array<Text>;
		'TBP'?: Array<Text>;
		'TBPM'?: Array<Text>;
		'TCM'?: Array<Text>;
		'TCMP'?: Array<Bool>;
		'TCO'?: Array<Text>;
		'TCOM'?: Array<Text>;
		'TCON'?: Array<Text>;
		'TCOP'?: Array<Text>;
		'TCP'?: Array<Bool>;
		'TCR'?: Array<Text>;
		'TDA'?: Array<Text>;
		'TDAT'?: Array<Text>;
		'TDES'?: Array<Text>;
		'TDLY'?: Array<Text>;
		'TDOR'?: Array<Text>;
		'TDR'?: Array<Text>;
		'TDEN'?: Array<Text>;
		'TDRC'?: Array<Text>;
		'TDRL'?: Array<Text>;
		'TDS'?: Array<Text>;
		'TDTG'?: Array<Text>;
		'TDY'?: Array<Text>;
		'TEN'?: Array<Text>;
		'TENC'?: Array<Text>;
		'TEXT'?: Array<Text>;
		'TFLT'?: Array<Text>;
		'TGID'?: Array<Text>;
		'TID'?: Array<Text>;
		'TIM'?: Array<Text>;
		'TIME'?: Array<Text>;
		'TIPL'?: Array<TextList>;
		'TIT1'?: Array<Text>;
		'TIT2'?: Array<Text>;
		'TIT3'?: Array<Text>;
		'TKE'?: Array<Text>;
		'TKEY'?: Array<Text>;
		'TKWD'?: Array<Bin>;
		'TLA'?: Array<Text>;
		'TLAN'?: Array<Text>;
		'TLE'?: Array<Text>;
		'TLEN'?: Array<Text>;
		'TMCL'?: Array<TextList>;
		'TMED'?: Array<Text>;
		'TMOO'?: Array<Text>;
		'TMT'?: Array<Text>;
		'TOA'?: Array<Text>;
		'TOAL'?: Array<Text>;
		'TOF'?: Array<Text>;
		'TOFN'?: Array<Text>;
		'TOL'?: Array<Text>;
		'TOLY'?: Array<Text>;
		'TOPE'?: Array<Text>;
		'TOR'?: Array<Text>;
		'TORY'?: Array<Text>;
		'TOT'?: Array<Text>;
		'TOWN'?: Array<Text>;
		'TP1'?: Array<Text>;
		'TP2'?: Array<Text>;
		'TP3'?: Array<Text>;
		'TP4'?: Array<Text>;
		'TPA'?: Array<Text>;
		'TPB'?: Array<Text>;
		'TPE1'?: Array<Text>;
		'TPE2'?: Array<Text>;
		'TPE3'?: Array<Text>;
		'TPE4'?: Array<Text>;
		'TPOS'?: Array<Text>;
		'TPRO'?: Array<Text>;
		'TPUB'?: Array<Text>;
		'TRC'?: Array<Text>;
		'TRCK'?: Array<Text>;
		'TRD'?: Array<Text>;
		'TRDA'?: Array<Text>;
		'TRK'?: Array<Text>;
		'TRSN'?: Array<Text>;
		'TRSO'?: Array<Text>;
		'TS2'?: Array<Text>;
		'TSA'?: Array<Text>;
		'TSC'?: Array<Text>;
		'TSI'?: Array<Text>;
		'TSIZ'?: Array<Text>;
		'TSO2'?: Array<Text>;
		'TSOA'?: Array<Text>;
		'TSOC'?: Array<Text>;
		'TSOP'?: Array<Text>;
		'TSOT'?: Array<Text>;
		'TSST'?: Array<Text>;
		'TSP'?: Array<Text>;
		'TSRC'?: Array<Text>;
		'TSS'?: Array<Text>;
		'TSSE'?: Array<Text>;
		'TST'?: Array<Text>;
		'TT1'?: Array<Text>;
		'TT2'?: Array<Text>;
		'TT3'?: Array<Text>;
		'TXT'?: Array<Text>;
		'TXX'?: Array<IdText>;
		'TXXX'?: Array<IdText>;
		'TYE'?: Array<Text>;
		'TYER'?: Array<Text>;
		'UFI'?: Array<IdAscii>;
		'UFID'?: Array<IdAscii>;
		'ULT'?: Array<LangDescText>;
		'USER'?: Array<Bin>;
		'USLT'?: Array<LangDescText>;
		'WAF'?: Array<Ascii>;
		'WAR'?: Array<Ascii>;
		'WAS'?: Array<Ascii>;
		'WCM'?: Array<Ascii>;
		'WCOM'?: Array<Ascii>;
		'WCOP'?: Array<Ascii>;
		'WCP'?: Array<Ascii>;
		'WFD'?: Array<Text>;
		'WFED'?: Array<Text>;
		'WOAF'?: Array<Ascii>;
		'WOAR'?: Array<Ascii>;
		'WOAS'?: Array<Ascii>;
		'WORS'?: Array<Ascii>;
		'WPAY'?: Array<Ascii>;
		'WPB'?: Array<Ascii>;
		'WPUB'?: Array<Ascii>;
		'WXX'?: Array<IdText>;
		'WXXX'?: Array<IdText>;
		'XDOR'?: Array<Text>;
		'XHD3'?: Array<Bin>;
		'XSOA'?: Array<Text>;
		'XSOP'?: Array<Text>;
		'XSOT'?: Array<Text>;
	}

}
