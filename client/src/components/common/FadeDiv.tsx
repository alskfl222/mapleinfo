import { Children, ReactNode } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface PropsType {
  children: ReactNode | null;
}

export default function FadeDiv({ children }: PropsType) {
  if (children) {
    return (
      <AnimatePresence>
        <Container
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Children.map(children, (child) => {
            return child;
          })}
        </Container>
      </AnimatePresence>
    );
  } else {
    return <></>;
  }
}

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
`