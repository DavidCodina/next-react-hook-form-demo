import { SCTitle } from './styles'
const defaultElement = 'h1'

interface ITitle {
  as?: React.ElementType
  children?: React.ReactNode
  className?: string
  color?: string
  style?: React.CSSProperties
}

/* =============================================================================
                                Title
============================================================================= */
// {...props} might include a color prop, which should be any valid value
// for CSS.Properties color.

export const Title = ({
  as = defaultElement,
  children,
  className = '',
  color = '',
  style = {}
}: ITitle) => {
  return (
    <SCTitle as={as} className={className} color={color} style={style}>
      {children}
    </SCTitle>
  )
}
