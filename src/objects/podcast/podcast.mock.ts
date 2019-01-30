import {Podcast} from './podcast.model';
import {PodcastStatus} from '../../model/jam-types';
import {DBObjectType} from '../../db/db.types';

export function mockPodcast(): Podcast {
	return {
		id: '',
		type: DBObjectType.podcast,
		url: 'https://example.org/feeds/podcastID1.xml',
		created: 1543495268,
		lastCheck: 1543495269,
		status: PodcastStatus.new,
		errorMessage: 'an error message',
		tag: {
			title: 'a title',
			link: 'https://example.org/podcastID1',
			author: 'an author',
			description: 'a description',
			generator: 'a generator',
			image: 'podcastID1.jpg',
			categories: ['category1', 'category2']
		}
	};
}

export function mockPodcast2(): Podcast {
	return {
		id: '',
		type: DBObjectType.podcast,
		url: 'https://example.org/feeds/podcastID2.xml',
		created: 1443495268,
		lastCheck: 1443495269,
		status: PodcastStatus.completed,
		errorMessage: 'second error message',
		tag: {
			title: 'second title',
			link: 'https://example.org/podcastID2',
			author: 'second author',
			description: 'second description',
			generator: 'second generator',
			image: 'podcastID2.jpg',
			categories: ['category3', 'category4']
		}
	};
}


export function mockPodcastXML(): { feed: string, nrOfItems: number } {
	// https://raw.githubusercontent.com/danmactough/node-feedparser/master/test/feeds/rss2sample.xml
	return {
		nrOfItems: 4,
		feed: `<?xml version="1.0"?>
<rss version="2.0">
   <channel>
      <title>Liftoff News</title>
      <link>http://liftoff.msfc.nasa.gov/</link>
      <description>Liftoff to Space Exploration.</description>
      <language>en-us</language>
      <pubDate>Tue, 10 Jun 2003 04:00:00 GMT</pubDate>
      <lastBuildDate>Tue, 10 Jun 2003 09:41:01 GMT</lastBuildDate>
      <docs>http://blogs.law.harvard.edu/tech/rss</docs>
      <generator>Weblog Editor 2.0</generator>
      <managingEditor>editor@example.com</managingEditor>
      <webMaster>webmaster@example.com</webMaster>
      <item>
         <title>Star City</title>
         <author>writer@example.com (Writer)</author>
         <link>http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp</link>
         <description>How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia's &lt;a href="http://howe.iki.rssi.ru/GCTC/gctc_e.htm"&gt;Star City&lt;/a&gt;.</description>
         <pubDate>Tue, 03 Jun 2003 09:39:21 GMT</pubDate>
         <guid>http://liftoff.msfc.nasa.gov/2003/06/03.html#item573</guid>
      </item>
      <item>
         <description>Sky watchers in Europe, Asia, and parts of Alaska and Canada will experience a &lt;a href="http://science.nasa.gov/headlines/y2003/30may_solareclipse.htm"&gt;partial eclipse of the Sun&lt;/a&gt; on Saturday, May 31st.</description>
         <pubDate>Fri, 30 May 2003 11:06:42 GMT</pubDate>
         <guid>http://liftoff.msfc.nasa.gov/2003/05/30.html#item572</guid>
      </item>
      <item>
         <title>The Engine That Does More</title>
         <link>http://liftoff.msfc.nasa.gov/news/2003/news-VASIMR.asp</link>
         <description>Before man travels to Mars, NASA hopes to design new engines that will let us fly through the Solar System more quickly.  The proposed VASIMR engine would do that.</description>
         <pubDate>Tue, 27 May 2003 08:37:32 GMT</pubDate>
         <guid>http://liftoff.msfc.nasa.gov/2003/05/27.html#item571</guid>
      </item>
      <item>
         <title>Astronauts' Dirty Laundry</title>
         <link>http://liftoff.msfc.nasa.gov/news/2003/news-laundry.asp</link>
         <description>Compared to earlier spacecraft, the International Space Station has many luxuries, but laundry facilities are not one of them.  Instead, astronauts have other options.</description>
         <pubDate>Tue, 20 May 2003 08:56:02 GMT</pubDate>
         <guid>http://liftoff.msfc.nasa.gov/2003/05/20.html#item570</guid>
      </item>
   </channel>
</rss>`
	};
}
