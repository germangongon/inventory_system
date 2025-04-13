import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const BotonVolver = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium mb-6"
    >
      <ArrowLeftIcon className="w-4 h-4" />
      <span>Volver Atrás</span>
    </button>
  );
};

export default BotonVolver;
