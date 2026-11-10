import { getPlaylistVideos, getYouTubePlaylistUrl } from "@/lib/youtube";
import GuestStories from "@/components/home/GuestStories";

export const metadata = {
  title: "Guest Stories",
  description:
    "Guest stories and property videos from Twin Towers by Defoy, Pahalgam.",
};

export default async function StoriesPage() {
  const videos = await getPlaylistVideos(12);
  const playlistUrl = getYouTubePlaylistUrl();

  return (
    <main className="py-20 md:py-28">
      <GuestStories
        videos={videos}
        playlistUrl={playlistUrl}
        title="Kashmir through their eyes."
        description="A closer look at the stays, moments and experiences shared by our guests."
      />
    </main>
  );
}
