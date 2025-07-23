// app.config.ts
export default defineAppConfig({
  icon: {
    size: '20px', // default <Icon> size applied
    class: 'icon', // default <Icon> class applied
  },
  ui: {
    button: {
      slots: {
        base: 'cursor-pointer inline-flex items-center justify-center font-semibold disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:!bg-gray disabled:!text-disabled',
      },
      variants: {
        size: {
          xs: {
            base: 'h-[22px] text-[10px] leading-0 font-normal',
          },
          sm: {
            base: 'h-[30px]',
          },
          md: {
            base: 'h-[36px]',
          },
          lg: {
            base: 'h-[44px]',
          },
          xl: {
            base: 'h-[56px]',
          },
        },
      },
      defaultVariants: {
        color: 'primary',
        size: 'md',
        variant: 'solid',
      },
    },
    input: {
      slots: {
        base: 'rounded-[4px]',
      },
      variants: {
        size: {
          md: {
            base: 'h-[36px]',
          },
          lg: {
            base: 'h-[44px]',
          },
          xl: {
            base: 'h-[52px]',
          },
        },
      },
      defaultVariants: {
        size: 'md',
      },
    },
    inputMenu: {
      slots: {
        base: 'rounded-[4px]',
      },
      variants: {
        size: {
          md: {
            base: 'h-[36px]',
          },
          lg: {
            base: 'h-[44px]',
          },
          xl: {
            base: 'h-[52px]',
          },
        },
      },
      defaultVariants: {
        size: 'md',
      },
    },
    select: {
      slots: {
        base: 'rounded-[4px]',
      },
      variants: {
        size: {
          sm: {
            base: 'h-[36px]',
          },
          md: {
            base: 'h-[40px]',
          },
          lg: {
            base: 'h-[44px]',
          },
          xl: {
            base: 'h-[52px]',
          },
        },
      },
      defaultVariants: {
        size: 'sm',
      },
    },
    link: {
      base: 'focus-visible:outline-primary underline text-primary cursor-pointer',
      variants: {
        active: {
          true: 'underline',
          false: 'text-primary',
        },
        disabled: {
          true: 'cursor-not-allowed opacity-75',
        },
      },
      compoundVariants: [
        {
          active: false,
          disabled: false,
          class: ['hover:text-default', 'transition-colors'],
        },
      ],
    },
    radioGroup: {
      slots: {
        base: 'border border-primary',
      },
      variants: {
        size: {
          sm: {
            base: 'size-5',
            indicator: 'after:size-3 after:bg-primary',
          },
          md: {
            base: 'size-6',
            indicator: 'after:size-3 after:bg-primary',
          },
          lg: {
            base: 'size-8',
            indicator: 'after:size-5 after:bg-primary',
          },
          xl: {
            base: 'size-10',
            indicator: 'after:size-6 after:bg-primary',
          },
        },
      },
    },
    checkbox: {
      slots: {
        base: 'rounded-[2px]',
      },
      variants: {
        size: {
          xl: {
            base: 'size-6',
          },
        },
      },
      defaultVariants: {
        size: 'xl',
      },
    },
    stepper: {
      slots: {},
      variants: {
        size: {
          xs: {
            trigger: 'size-5',
          },
        },
      },
      defaultVariants: {
        size: 'xs',
      },
    },
    switch: {
      slots: {
        base: 'bg-success',
      },
      variants: {
        size: {
          md: {
            base: 'w-20',
            thumb:
              'size-5 data-[state=unchecked]:translate-x-14 data-[state=checked]:ltr:-translate-x-0',
          },
        },
      },
      defaultVariants: {
        size: 'md',
        color: 'success',
      },
    },
  },
})
