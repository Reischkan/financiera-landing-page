'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { Container, Title, Paragraph, PrimaryButton } from '@/components/StyledComponents';

const NotFoundContainer = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 0;
`;

const ErrorCode = styled.h2`
  font-size: 6rem;
  font-weight: 700;
  color: #4299e1;
  margin-bottom: 1rem;
  line-height: 1;
`;

const NotFoundTitle = styled(Title)`
  margin-bottom: 1rem;
`;

const NotFoundDescription = styled(Paragraph)`
  max-width: 500px;
  margin-bottom: 2rem;
`;

export default function NotFound() {
  return (
    <Container>
      <NotFoundContainer>
        <ErrorCode>404</ErrorCode>
        <NotFoundTitle>Página no encontrada</NotFoundTitle>
        <NotFoundDescription>
          Lo sentimos, la página que buscas no existe o ha sido movida.
          Por favor, verifica la URL o regresa a la página de inicio.
        </NotFoundDescription>
        <Link href="/" passHref>
          <PrimaryButton as="a">
            Volver al inicio
          </PrimaryButton>
        </Link>
      </NotFoundContainer>
    </Container>
  );
} 