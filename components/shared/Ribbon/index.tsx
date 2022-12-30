import React from 'react'
import { SCRibbonContainer } from './styles'

/* =============================================================================
                              Ribbon
============================================================================= */

export const Ribbon = ({ children }: any) => {
  return (
    <SCRibbonContainer>
      <div className='ms-ribbon'>{children} </div>
    </SCRibbonContainer>
  )
}
