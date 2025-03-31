import { useNavigate } from "react-router-dom";

const BotonVolver = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
    >
      ⬅ Volver Atrás
    </button>
  );
};

export default BotonVolver;
