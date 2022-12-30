import styled from 'styled-components'

export const SCTitle = styled.div`
  --color: ${({ color }) => (color ? color : '#00b5e2')};
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: var(--color);
  color: #fff;
  font-family: Poppins;
  font-size: 40px;
  font-weight: 900;
  letter-spacing: 1px;
  line-height: 1;
  margin: 0;
  text-shadow: 0 1px 0 hsl(174, 5%, 86%), 0 2px 0 hsl(174, 5%, 84%),
    0 3px 0 hsl(174, 5%, 82%), 0 4px 0 hsl(174, 5%, 80%),
    0 5px 0 hsl(174, 5%, 78%), 0 6px 0 hsl(174, 5%, 76%),
    0 7px 0 hsl(174, 5%, 74%), 0 8px 0 hsl(174, 5%, 72%), 0 9px 0 var(--color),
    /* shadows */ 0px 10px 2px rgba(16, 16, 16, 0.2),
    0px 12px 4px rgba(16, 16, 16, 0.2);
  text-transform: uppercase;

  @media (max-width: 400px) {
    font-size: 32px;
  }
`
