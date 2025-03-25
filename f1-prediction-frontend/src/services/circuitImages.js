// src/utils/circuitImages.js

const CIRCUIT_IMAGES = {
    // Circuitos actualizados para temporada 2023-2024
    bahrain: {
      name: "Bahrain International Circuit",
      wiki: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Bahrain_International_Circuit.svg/800px-Bahrain_International_Circuit.svg.png",
      f1: "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png"
    },
    jeddah: {
      name: "Jeddah Corniche Circuit",
      wiki: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Jeddah_Street_Circuit_2021.svg/800px-Jeddah_Street_Circuit_2021.svg.png",
      f1: "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Jeddah_Circuit.png"
    },
    monaco: {
      name: "Circuit de Monaco",
      wiki: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Circuit_de_Monaco.svg/800px-Circuit_de_Monaco.svg.png",
      f1: "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monaco_Circuit.png"
    },
    // [...] Añadir todos los circuitos restantes
    default: {
      name: "Default Circuit",
      wiki: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png",
      f1: "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Default_Circuit.png"
    }
  };
  
  export const getCircuitImage = (circuitId, type = 'f1') => {
    const circuit = CIRCUIT_IMAGES[circuitId?.toLowerCase()] || CIRCUIT_IMAGES.default;
    return circuit[type] || circuit.f1; // Siempre fallback a imagen F1
  };
  
  // Opcional: Exportar lista para selectores
  export const CIRCUIT_OPTIONS = Object.entries(CIRCUIT_IMAGES).map(([id, data]) => ({
    id,
    name: data.name
  }));