export function extractAlbumName(name: string): string {
	const result = name
		.replace(/\(((\d\d\d\d)|(\d* ?cds)|(cd ?\d*)|(disc ?\d*)|(disc ?\d*:.*)|(bonus.*)|(.*edition)|(.*retail)|(\d* of \d*)|(eps?|bootleg|deluxe|promo|single|lp|limited edition|retro|ost|uvs|demp|demos|remastered|remix|live|remixes|vinyl|collection|maxi|bonus disc))\)/gi, '')
		.replace(/\[((\d\d\d\d)|(\d* ?cds)|(cd ?\d*)|(disc ?\d*)|(disc ?\d*:.*)|(bonus.*)|(.*edition)|(.*retail)|(\d* of \d*)|(eps?|bootleg|deluxe|promo|single|lp|limited edition|retro|ost|uvs|demp|demos|remastered|remix|live|remixes|vinyl|collection|maxi|bonus disc))\]/gi, '')
		.replace(/-? cd\d*/gi, '')
		.trim();
	if (result.length === 0) {
		return name.trim();
	}
	return result;
}
