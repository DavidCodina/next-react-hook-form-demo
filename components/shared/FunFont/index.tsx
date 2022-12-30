import { SCFunFont } from './styles'
import { IFunFont } from './types'

/* =============================================================================
                              FunFont
============================================================================= */

export const FunFont = ({
  as = 'h1',
  borderColor = '#409',
  children,
  className = '',
  color = '#fff',
  style = {}
}: IFunFont) => {
  /* ======================
          return
  ====================== */

  return (
    <SCFunFont
      as={as}
      borderColor={borderColor}
      className={className}
      color={color}
      style={{ fontFamily: 'Luckiest Guy', ...style }}
    >
      {children}
    </SCFunFont>
  )
}
