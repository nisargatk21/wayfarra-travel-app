import { useState, useEffect } from 'react';
import { Routes, Route, useLocation as useRouterLocation, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TravelCompanion from './components/TravelCompanion';
import LocationPicker from './components/LocationPicker';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Destination from './pages/Destination';
import Planner from './pages/Planner';
import { useLocation as useGeoLocation, LOCATION_STATUS } from './hooks/useLocation';
import { getDestinationById } from './data/destinations';

function ScrollToTop() {
  const { pathname } = useRouterLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function DestinationCompanionWrapper({ id }) {
  const destination = getDestinationById(id);
  return <TravelCompanion destination={destination} />;
}

function PlannerCompanionWrapper() {
  // Planner keeps its selected destination in sync with the URL, so the
  // chat can read the same ?destination= param and stay aware of whatever
  // the person has currently chosen in the form.
  const [searchParams] = useSearchParams();
  const destination = getDestinationById(searchParams.get('destination'));
  return <TravelCompanion destination={destination} />;
}

export default function App() {
  const routerLocation = useRouterLocation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const geo = useGeoLocation();

  const isHome = routerLocation.pathname === '/';
  const isDestination = routerLocation.pathname.startsWith('/destination/');
  const isPlanner = routerLocation.pathname.startsWith('/plan');

  async function handleDetect() {
    await geo.detect();
  }

  function renderCompanion() {
    if (isDestination) {
      const destinationId = routerLocation.pathname.split('/')[2];
      return <DestinationCompanionWrapper id={destinationId} />;
    }
    if (isPlanner) return <PlannerCompanionWrapper />;
    return <TravelCompanion destination={null} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar
        transparent={isHome}
        onUseLocation={() => setPickerOpen(true)}
        locationLabel={geo.status === LOCATION_STATUS.SUCCESS ? geo.place : null}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={routerLocation} key={routerLocation.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/destination/:id" element={<Destination />} />
            <Route path="/plan" element={<Planner />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />

      {renderCompanion()}

      <AnimatePresence>
        {pickerOpen && (
          <LocationPicker
            status={geo.status}
            place={geo.place}
            onDetect={handleDetect}
            onManualSelect={(r) => {
              geo.setManual(r.name, { lat: r.lat, lng: r.lng });
              setPickerOpen(false);
            }}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
