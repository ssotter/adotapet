import Container from "../components/Layout/Container";

export default function ReceivedRequests() {
  return (
    <Container>
      <h1 className="text-2xl font-semibold">Solicitações recebidas</h1>
      <p className="text-gray-600 text-sm">
        Aprove ou rejeite pedidos de visita.
      </p>

      <div className="mt-6 p-4 rounded-2xl border bg-white text-sm text-gray-500">
        (Próximo passo) Listar /my/received-visit-requests + botões aprovar/rejeitar.
      </div>
    </Container>
  );
}
