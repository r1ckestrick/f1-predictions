// 📌 Función para formatear la fecha de "YYYY-MM-DD" a un formato más amigable
export const formatDate = (dateStr) => {
    if (!dateStr) return "Fecha no disponible";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("es-ES", options);
  };
