import { getCircuitImage } from '../utils/circuitImages';

const RaceDetails = ({ raceInfo }) => {
  const [currentImage, setCurrentImage] = useState(
    getCircuitImage(raceInfo?.Circuit?.circuitId)
  );

  return (
    <CardMedia
      component="img"
      image={currentImage}
      alt={`Mapa del ${raceInfo?.Circuit?.circuitName || 'circuito'}`}
      sx={{ width: '100%', height: 400, objectFit: 'contain' }}
      onError={() => {
        // Fallback a WikiMedia si falla F1
        setCurrentImage(getCircuitImage(
          raceInfo?.Circuit?.circuitId, 
          'wiki'
        ));
      }}
    />
  );
};