import HeroFilm from "@/components/home/HeroFilm";
import Statement from "@/components/home/Statement";
import BuildingExplorer from "@/components/home/BuildingExplorer";
import Estate from "@/components/home/Estate";
import CoverFlowGallery from "@/components/home/CoverFlowGallery";
import Suites from "@/components/home/Suites";
import StayFeatures from "@/components/home/StayFeatures";
import Restaurant from "@/components/home/Restaurant";
import BalconyView from "@/components/home/BalconyView";
import LocationSection from "@/components/home/LocationSection";
import GuestNotes from "@/components/home/GuestNotes";
import BlogTeaser from "@/components/home/BlogTeaser";
import HomeFaq from "@/components/home/HomeFaq";
import ClosingCTA from "@/components/home/ClosingCTA";
import { getDisplayReviews } from "@/lib/googleReviews";

export default async function HomePage() {
  const { reviews, mapsUrl } = await getDisplayReviews();
  return (
    <>
      <HeroFilm />
      <Statement />
      <BuildingExplorer />
      <Estate />
      <CoverFlowGallery />
      <Suites />
      <StayFeatures />
      <Restaurant />
      <BalconyView />
      <LocationSection />
      <GuestNotes reviews={reviews} googleMapsUrl={mapsUrl} />
      <BlogTeaser />
      <HomeFaq />
      <ClosingCTA />
    </>
  );
}
