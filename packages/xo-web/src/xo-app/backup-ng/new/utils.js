import Icon from 'icon'
import PropTypes from 'prop-types'
import React from 'react'
import { injectState, provideState } from '@julien-f/freactal'

export const FormGroup = props => <div {...props} className='form-group' />
export const Input = props => <input {...props} className='form-control' />
export const Ul = props => <ul {...props} className='list-group' />
export const Li = props => <li {...props} className='list-group-item' />

export const getRandomId = () =>
  Math.random()
    .toString(36)
    .slice(2)

export const Number = [
  provideState({
    effects: {
      onChange: (_, { target: { value } }) => (state, props) => {
        if (value === '') {
          return
        }
        props.onChange(+value)
      },
    },
  }),
  injectState,
  ({ effects, state, value }) => (
    <Input
      type='number'
      onChange={effects.onChange}
      value={String(value)}
      min='0'
    />
  ),
].reduceRight((value, decorator) => decorator(value))

Number.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

export const FormFeedback = ({
  showError,
  error,
  component: Component,
  ...props
}) => (
  <div>
    <Component
      {...props}
      style={
        showError === undefined
          ? undefined
          : {
              borderColor: showError ? 'red' : 'green',
              ...props.style,
            }
      }
    />
    {showError && (
      <span className='text-danger'>
        <Icon icon='alarm' /> {error}
      </span>
    )}
  </div>
)

FormFeedback.propTypes = {
  component: PropTypes.node.isRequired,
  error: PropTypes.node.isRequired,
  showError: PropTypes.bool,
}
