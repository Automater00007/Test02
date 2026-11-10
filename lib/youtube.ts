import 'server-only';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

interface YouTubePlaylistItem {
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    resourceId?: { videoId?: string };
    thumbnails?: {
      maxres?: { url?: string };
      standard?: { url?: string };
      high?: { url?: string };
      medium?: { url?: string };
    };
  };
}

interface YouTubePlaylistResponse {
  items?: YouTubePlaylistItem[];
  error?: { message?: string };
}

export async function getPlaylistVideos(maxResults = 6): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID;

  if (!apiKey || !playlistId) {
    return [];
  }

  const safeMaxResults = Math.min(Math.max(maxResults, 1), 50);

  const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('maxResults', String(safeMaxResults));
  url.searchParams.set('playlistId', playlistId);
  url.searchParams.set('key', apiKey);

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error('YouTube Data API request failed:', response.status);
      return [];
    }

    const data = (await response.json()) as YouTubePlaylistResponse;

    if (!Array.isArray(data.items)) {
      return [];
    }

    return data.items
      .map((item) => {
        const snippet = item.snippet;
        const videoId = snippet?.resourceId?.videoId;
        if (!videoId) return null;

        const thumbnail =
          snippet.thumbnails?.maxres?.url ||
          snippet.thumbnails?.standard?.url ||
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        return {
          id: videoId,
          title: snippet.title || 'Guest story',
          description: snippet.description || '',
          thumbnail,
          publishedAt: snippet.publishedAt || '',
        };
      })
      .filter((video): video is YouTubeVideo => video !== null);
  } catch (error) {
    console.error('Unable to fetch YouTube playlist:', error);
    return [];
  }
}

export function getYouTubePlaylistUrl(): string {
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID;
  if (!playlistId) return 'https://www.youtube.com/';
  return `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`;
}
