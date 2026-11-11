import HeroFilm from "@/components/home/HeroFilm";
import Statement from "@/components/home/Statement";
import Estate from "@/components/home/Estate";
import GalleryHorizontal from "@/components/home/GalleryHorizontal";
import StackCarousel from "@/components/home/StackCarousel";
import Suites from "@/components/home/Suites";
import StayFeatures from "@/components/home/StayFeatures";
import Restaurant from "@/components/home/Restaurant";
import DayTimeline from "@/components/home/DayTimeline";
import LocationSection from "@/components/home/LocationSection";
import GuestNotes from "@/components/home/GuestNotes";
import BlogTeaser from "@/components/home/BlogTeaser";
import HomeFaq from "@/components/home/HomeFaq";
import ClosingCTA from "@/components/home/ClosingCTA";
import GuestStories from "@/components/home/GuestStories";
import { getPlaylistVideos, getYouTubePlaylistUrl } from "@/lib/youtube";
import { getDisplayReviews } from "@/lib/googleReviews";

export default async function HomePage() {
  const { reviews, mapsUrl } = await getDisplayReviews();
  const videos = await getPlaylistVideos(6);
  const playlistUrl = getYouTubePlaylistUrl();

  return (
    <>
      <HeroFilm />
      <Statement />
      <Estate />
      <GalleryHorizontal />
      <StackCarousel />
      <Suites />
      <StayFeatures />
      <Restaurant />
      <DayTimeline />
      <GuestStories videos={videos} playlistUrl={playlistUrl} />
      <LocationSection />
      <GuestNotes reviews={reviews} googleMapsUrl={mapsUrl} />
      <BlogTeaser />
      <HomeFaq />
      <ClosingCTA />
    </>
  );
}
