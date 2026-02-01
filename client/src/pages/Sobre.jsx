import Container from "../components/Layout/Container";

export default function Sobre() {
  return (
    <Container>
      <div className="max-w-3xl mx-auto py-8">
        <div className="rounded-2xl border bg-white p-6">
          <h1 className="text-2xl font-semibold">Sobre o Projeto</h1>

          <p className="mt-4 text-gray-700 leading-relaxed">
            O <span className="font-semibold">AdotaPet</span> é um Trabalho de
            Conclusão de Curso (TCC) desenvolvido no âmbito da Pós-Graduação em
            Desenvolvimento Full Stack pela <span className="font-semibold">PUC-RS</span>,
            com o objetivo de aplicar, na prática, os conhecimentos adquiridos ao
            longo da formação por meio do desenvolvimento de uma plataforma web
            com propósito social.
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            A ideia do projeto surgiu após a grande enchente que atingiu o Rio
            Grande do Sul em maio de 2024, um evento que evidenciou um problema
            significativo enfrentado por diversas cidades do estado: o grande
            número de pets que se perderam de seus tutores em meio à situação de
            emergência.
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Diante desse cenário, o AdotaPet foi concebido como uma plataforma
            digital voltada à adoção responsável de pets, além de apoiar a
            divulgação de animais perdidos ou encontrados. A proposta é oferecer
            uma solução acessível, simples e centrada no usuário, conectando
            pessoas e contribuindo para minimizar os impactos sociais observados
            naquele período.
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Este projeto representa a união entre aprendizado acadêmico,
            tecnologia e responsabilidade social, demonstrando como soluções
            digitais podem ser aplicadas para enfrentar problemas reais da
            sociedade contemporânea.
          </p>

          <div className="mt-8 border-t pt-4">
            <p className="font-medium text-gray-800">
              Sergio Llopart Sotter
            </p>
            <p className="text-sm text-gray-600">
              Formando em Pós-Graduação em Desenvolvimento Full Stack – PUC-RS
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Fevereiro de 2026
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
