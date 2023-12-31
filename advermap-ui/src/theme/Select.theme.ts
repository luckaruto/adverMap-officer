import { focusBorderColorSecondary } from './globalStyles.ts'

export const CustomSelect = {
  variants: {
    outline: {
      field: {
        borderColor: 'gray.400',
        _focus: {
          borderColor: focusBorderColorSecondary,
          boxShadow: `0 0 0 1px ${focusBorderColorSecondary}`
        }
      }
    },
    filled: {
      field: {
        _focus: {
          borderColor: focusBorderColorSecondary,
          boxShadow: `0 0 0 1px ${focusBorderColorSecondary}`
        }
      }
    },
    flushed: {
      field: {
        _focus: {
          borderColor: focusBorderColorSecondary,
          boxShadow: `0 1px 0 0 ${focusBorderColorSecondary}`
        }
      }
    }
  }
}
