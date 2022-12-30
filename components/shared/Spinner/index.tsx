interface ISpinner {
  className?: string
  containerClassName?: string
  containerStyle?: React.CSSProperties
  size?: string | number
  style?: React.CSSProperties
  useContainer?: boolean
  variant?: string
}

// Helper for object literals.
function isEmpty(obj: any) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false
    }
  }
  return true
}

/* =============================================================================
                                Spinner
============================================================================= */

// useContainer = false by default. However, configuring containerClasses or containerStyle,
// will still cause the spinner to render with a <div> wrapper.
// In the absence of any other styling, the spinner will default to the currentColor
// of the parent element.
export const Spinner = ({
  className = '',
  containerClassName = '',
  containerStyle = {},
  size = 50,
  style = {},
  useContainer = false,
  variant = ''
}: ISpinner) => {
  const setSpinnerClasses = () => {
    if (variant && className) {
      return `spinner-border text-${variant} ${className}`
    }

    if (variant && !className) {
      return `spinner-border text-${variant}`
    }

    if (!variant && className) {
      return `spinner-border ${className}`
    }

    // Same as: if (!variant && !classes){ return `spinner-border`; }
    return 'spinner-border'
  }

  /* ======================

  ====================== */

  const renderSpinner = () => {
    if (useContainer || containerClassName || !isEmpty(containerStyle)) {
      return (
        <div className={containerClassName} style={containerStyle}>
          <div
            className={setSpinnerClasses()}
            style={{ width: size, height: size, ...style }}
            role='status'
          >
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      )
    }

    /* ======================
          return
    ====================== */

    return (
      <div
        className={setSpinnerClasses()}
        style={{ width: size, height: size, ...style }}
        role='status'
      >
        <span className='visually-hidden'>Loading...</span>
      </div>
    )
  }

  return renderSpinner()
}
