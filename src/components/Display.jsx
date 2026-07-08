import styled from 'styled-components';

const DisplayPanel = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: ${({ theme }) => theme.spacing.md};
  text-align: right;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSizeDisplay};
  min-height: 60px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default function Display({ value }) {
  return <DisplayPanel aria-label="Display" role="status">{value || '0'}</DisplayPanel>;
}
