import { useParams } from "react-router-dom";
import Container from "../components/Layout/Container";

export default function PostDetail() {
  const { id } = useParams();

  return (
    <Container>
      <h1 className="text-2xl font-semibold">Detalhe do anúncio</h1>
      <p className="text-gray-600 text-sm">Post: {id}</p>

      <div className="mt-6 p-4 rounded-2xl border bg-white text-sm text-gray-500">
        (Próximo passo) Galeria + dados + solicitar visita + ver contato.
      </div>
    </Container>
  );
}
