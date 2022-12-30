// Server imports...

// Third-party imports
import { Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  useFieldArray
} from 'react-hook-form'

import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTriangleExclamation,
  faTrash
} from '@fortawesome/free-solid-svg-icons'

// Custom imports
import { sleep } from 'utils'
import { FunFont, HR } from 'components'
import styles from 'styles/HomePage.module.scss'

type FormValues = {
  fullName: {
    firstName: string
    lastName: string
  }
  email: string
  password: string
  confirmPassword: string
  age: string
  file: '' | FileList
  country: string
  pets: { name: string }[]
  body: string
}

const defaultValues: FormValues = {
  fullName: {
    firstName: '',
    lastName: ''
  },
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  file: '',
  country: '',
  pets: [],
  body: ''
}

/* ========================================================================
                              FormDemoPage
======================================================================== */
// This form is a series of random fields for demoing react-hook-form v7.

const FormDemoPage = () => {
  const router = useRouter()

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    setError,
    getValues,
    trigger,
    // setFocus,
    // watch,
    control,
    formState: {
      // dirtyFields,
      errors,
      isValid,
      touchedFields,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful
      // isDirty,
      // isValidating
    }
  } = useForm<FormValues>({
    // delayError: 1000,
    defaultValues: defaultValues,
    mode: 'all'
    // criteriaMode: 'all',
    // shouldUseNativeValidation: true
  })

  // Derived state.
  const password = getValues('password')
  const confirmPasswordTouched = touchedFields?.confirmPassword

  /* ======================
      useFieldArray()
  ====================== */

  const { fields, append, prepend, remove } = useFieldArray({
    control,
    name: 'pets'
  })

  /* ======================
    touchAllFormElements()
  ====================== */
  // A helper to work around potentially needing all form
  // elements to have been touched. This is useful prior
  // to calling trigger() when wanting to show validation
  // UI without actually sumbitting the form. react-hook-form
  // does not actually expose a function like this.

  const touchAllFormElements = (formElement?: HTMLFormElement) => {
    const form = formElement || document.querySelector('form')
    const activeElement = document.activeElement as HTMLElement

    if (form && form.elements) {
      for (let i = 0; i < form.elements.length; i++) {
        const element = form.elements[i] as HTMLElement
        element.focus()
      }
    }

    // Set focus back on the original element.
    if (activeElement) {
      activeElement.focus()
    }
  }

  /* ======================
      validateName()
  ====================== */

  const validateName = (value: string) => {
    // await sleep(3000) // Test isValidating...
    if (typeof value === 'string' && value.trim() === '') {
      return 'The name must be more than empty spaces.'
    }

    if (typeof value === 'string' && value.length <= 1) {
      return 'The name must be greater than one character.'
    }

    return true
  }

  /* ======================
  validateConfirmPassword()
  ====================== */

  const validateConfirmPassword = (value: string) => {
    const values = getValues()

    if (errors?.password) {
      return 'Fix password field (above) then ensure the passwords match.'
    }

    if (value !== values?.password) {
      return 'The passwords must match.'
    }

    return true
  }

  /* ======================
      validateAge()
  ====================== */

  const validateAge = (value: string) => {
    const isNum = (v: any) => typeof v === 'number' && !isNaN(v)
    // Technically, value will still be a string, so what we really want to check is
    // if it can be transformed into a number. Here we're using Number() and not parseFloat().
    // Why? Because parseFloat() is more forgiving such that it will coerce '123abc' to 123.
    const valueIsNumeric = isNum(Number(value))

    if (!valueIsNumeric) {
      return "That's not a number."
    }
    return true
  }

  /* ======================
      validateFileList()
  ====================== */

  const validateFileList = (value: FileList | '') => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Normally, when we select a file from the computer, we would
    // do this to get the FileList:
    //
    //   const files = e?.target?.files
    //
    // react-hook-form is smart enough to do that for us
    // such that the value will already be a FileList.
    // Thus what we need to do is check if there is a value.
    //
    ///////////////////////////////////////////////////////////////////////////

    if (!value) {
      return 'A file is required.'
    }

    if (value instanceof FileList) {
      const file = value[0]

      if (!file || !(file instanceof File)) {
        return 'A file is required.'
      }
    }

    // If the file needs to be an image, or have other criteria, do those checks here.
    return true
  }

  /* ======================
        onSubmit()
  ====================== */

  const onSubmit: SubmitHandler<FormValues> = async (_data, _e) => {
    try {
      await sleep(2000) // await API call

      // Randomly generate a boolean value to serve as the condition
      // that triggers the simulation of a failed API call.
      const isRandomEmailError = Boolean(Math.round(Math.random()))
      if (isRandomEmailError) {
        const mockAxiosError = {
          message: 'Request failed',
          response: {
            data: {
              data: null,
              message: 'Request failed.',
              success: false,
              errors: {
                email: 'That email is taken. Try again.'
              }
            }
          }
        }
        throw mockAxiosError
      }
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        const formErrors = err?.response?.data?.errors

        // For any potential form errors that might be expected from the
        // API call, check data.errors.someFieldName and programmatically
        // set the associated field's error.
        if (formErrors?.email) {
          setError('email', {
            message: formErrors.email,
            type: 'custom'
          })
        }
      }
      return false
    }
  }

  /* ======================
        onError()
  ====================== */

  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    console.log({ errors, e })
    toast.error('Please correct form validation errors!')
  }

  /* ======================
        useEffect()
  ====================== */
  // useEffect() that runs after form submission attempt.

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      reset(undefined, {})
      toast.success('Form validation success!')
    } else if (isSubmitted && !isSubmitSuccessful) {
      toast.error('Unable to submit the form!')
    }
  }, [isSubmitted, isSubmitSuccessful, reset])

  /* ======================
        useEffect()
  ====================== */
  // useEffect() to validate confirmPassword whenever password changes.

  useEffect(() => {
    if (confirmPasswordTouched) {
      trigger(['confirmPassword'])
    }
  }, [password, confirmPasswordTouched, trigger])

  /* ======================
        renderForm()
  ====================== */

  const renderForm = () => {
    return (
      <Fragment>
        <section className='d-flex justify-content-center mb-3'>
          <div className='btn-group shadow-sm'>
            <button
              className='btn btn-secondary btn-sm fw-bold'
              onClick={() => {
                const options = {
                  shouldDirty: true,
                  shouldValidate: true,
                  shouldTouch: true
                }
                // You could do this, but the docs indicate that it's less performant.
                // setValue('fullName', { firstName: 'Joe', lastName: 'Bazooka' }, options)
                setValue('fullName.firstName', 'Joe', options)
                setValue('fullName.lastName', 'Bazooka', options)
                setValue('email', 'joe@example.com', options)
                setValue('password', '12345678', options)
                setValue('confirmPassword', '12345678', options)
                setValue('age', '12', options)
                setValue('country', 'USA', options)
                setValue('body', 'Testing 123...', options)
              }}
              style={{ minWidth: 150 }}
            >
              Set Values
            </button>

            <button
              className='btn btn-primary btn-sm fw-bold'
              onClick={async () => {
                touchAllFormElements()
                const _formIsValid = await trigger() // => true | false
              }}
              style={{ minWidth: 150 }}
            >
              Validate
            </button>

            <button
              className='btn btn-danger btn-sm fw-bold'
              onClick={() => {
                reset(undefined, {})
              }}
              style={{ minWidth: 150 }}
            >
              Reset Form
            </button>
          </div>
        </section>

        <form
          className='mx-auto mb-3 p-3 border border-primary rounded-3'
          style={{ backgroundColor: '#fafafa', maxWidth: 800 }}
        >
          <div className='mb-3'>
            <label htmlFor='firstName' className='form-label'>
              First Name <sup className='text-danger'>*</sup>
            </label>

            <input
              autoComplete='off'
              className={`form-control form-control-sm${
                !(touchedFields?.fullName?.firstName || isSubmitted)
                  ? ''
                  : errors?.fullName?.firstName
                  ? ' is-invalid'
                  : ' is-valid'
              }`}
              id='firstName'
              placeholder='First Name...'
              spellCheck={false}
              type='text'
              // Spreads name, onBlur, onChange, and a ref
              {...register('fullName.firstName', {
                required: {
                  value: true,
                  message: 'First name is required.'
                },
                validate: validateName
              })}
            />

            <div className='invalid-feedback'>
              {errors?.fullName?.firstName?.message}
            </div>
          </div>

          <div className='mb-3'>
            <label htmlFor='lastName' className='form-label'>
              Last Name <sup className='text-danger'>*</sup>
            </label>

            <input
              autoComplete='off'
              className={`form-control form-control-sm${
                !(touchedFields?.fullName?.lastName || isSubmitted)
                  ? ''
                  : errors?.fullName?.lastName
                  ? ' is-invalid'
                  : ' is-valid'
              }`}
              id='lastName'
              placeholder='Last Name...'
              spellCheck={false}
              type='text'
              {...register('fullName.lastName', {
                required: 'Last name is required.',
                validate: validateName
              })}
            />

            <div className='invalid-feedback'>
              {errors?.fullName?.lastName?.message}
            </div>
          </div>

          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email <sup className='text-danger'>*</sup>
            </label>

            <input
              autoComplete='off'
              className={`form-control form-control-sm${
                !(touchedFields?.email || isSubmitted)
                  ? ''
                  : errors?.email
                  ? ' is-invalid'
                  : ' is-valid'
              }`}
              id='email'
              placeholder='Email...'
              spellCheck={false}
              type='email' // Doesn't really matter since we're not using HTML5 constraint API.
              {...register('email', {
                required: 'An email is required',
                pattern: {
                  // This regex is taken directly from:
                  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#basic_validation
                  // However, you may still need to turn off ESLint's: no-useless-escape
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                  message: 'A valid email is required.'
                }
              })}
            />

            <div className='invalid-feedback'>{errors?.email?.message}</div>
          </div>

          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
              Password <sup className='text-danger'>*</sup>
            </label>

            <input
              autoComplete='off'
              className={`form-control form-control-sm${
                !(touchedFields?.password || isSubmitted)
                  ? ''
                  : errors?.password
                  ? ' is-invalid'
                  : ' is-valid'
              }`}
              id='password'
              placeholder='Password...'
              spellCheck={false}
              type='text'
              {...register('password', {
                required: 'A password is required',
                minLength: {
                  value: 8,
                  message: 'The password must be at least 8 characters long.'
                }
              })}
            />

            <div className='invalid-feedback'>{errors?.password?.message}</div>
          </div>

          <div className='mb-3'>
            <label htmlFor='confirmPassword' className='form-label'>
              Confirm Password <sup className='text-danger'>*</sup>
            </label>

            <input
              autoComplete='off'
              className={`form-control form-control-sm${
                !(touchedFields?.confirmPassword || isSubmitted)
                  ? ''
                  : errors?.confirmPassword
                  ? ' is-invalid'
                  : ' is-valid'
              }`}
              id='confirmPassword'
              placeholder='Confirm Password...'
              spellCheck={false}
              type='text'
              {...register('confirmPassword', {
                required: 'Password confirmation is required.',
                validate: validateConfirmPassword
              })}
            />

            <div className='invalid-feedback'>
              {errors?.confirmPassword?.message}
            </div>
          </div>

          <div className='mb-3'>
            <label htmlFor='age' className='form-label'>
              Age <sup className='text-danger'>*</sup>
            </label>

            <input
              autoComplete='off'
              className={`form-control form-control-sm${
                !(touchedFields?.age || isSubmitted)
                  ? ''
                  : errors?.age
                  ? ' is-invalid'
                  : ' is-valid'
              }`}
              id='age'
              min={0} // Only affects spinner
              max={129} // Only affects spinner
              placeholder='Age...'
              spellCheck={false}
              type='number'
              {...register('age', {
                required: 'Age is required',
                // What this actually does is transform the string value into type number or NaN.
                // However, doing it here messes with the regex pattern validation.
                // valueAsNumber: true,
                min: {
                  value: 0,
                  message: "The value can't be less than 0."
                },
                max: {
                  value: 129,
                  message: "The value can't be greater than 129."
                },

                // While the min/max configuration properties get pretty close to what we want,
                // we can nail it down even further with a very specific regex pattern.
                pattern: {
                  ///////////////////////////////////////////////////////////////////////////
                  //
                  // Floats with no leading zeros: /^(0|-?[1-9][0-9]*)(\.[0-9]+)?$/
                  //   Allow 0 or 1-9 followed by any other digit zero or more times: (0|[1-9][0-9]*)
                  //   Then optionally allow . followed by 0-9 one or more times:     (\.[0-9]+)?
                  //
                  // Age v1: Allow 0, or any 1-3 digit number, excluding leading zeros:                 /^(0|[1-9][0-9]{0,2})$/
                  // Age v2: Allow 0, or any 3 digit number between 1 and 129, excluding leading zeros: /^(0|[1-9][0-9]?|1[0-2][0-9])$/
                  //
                  ///////////////////////////////////////////////////////////////////////////
                  value: /^(0|[1-9][0-9]?|1[0-2][0-9])$/,
                  message: 'A valid age is required.'
                },

                // The above regex pattern should be sufficient, but just to be extra sure, we
                // can pass the value into validateAge(), which will convert the string value
                // to a number, and check if it's valid as an actual number. In other words,
                // even though the value is a string we want to check if it has the POTENTIAL
                // to be a valid number type. This is important since we'll likely be transforming
                // it prior to sending to an API.
                validate: validateAge
              })}
            />

            <div className='invalid-feedback'>{errors?.age?.message}</div>
          </div>

          <div className='mb-3'>
            <label htmlFor='file' className='form-label'>
              File <sup className='text-danger'>*</sup>
            </label>

            <input
              // autoComplete='off'
              accept='image/png, image/jpeg, image/jpg'
              className={`form-control form-control-sm${
                !(touchedFields?.file || isSubmitted)
                  ? ''
                  : errors?.file
                  ? ' is-invalid'
                  : ' is-valid'
              }`}
              id='file'
              placeholder='File...'
              // spellCheck={false}
              type='file'
              {...register('file', {
                ///////////////////////////////////////////////////////////////////////////
                //
                // This will not work because react-hook-form is smart enough to know that
                // the value should be a FileList.
                //
                //   required: 'File is required',
                //
                // Thus it will generally be truthy, unless we programmatically replace
                // the file with ''. What we really need is a way to check if there is a
                // FileList, and if the FileList has a File: validateFileList.
                //
                // However, in that case the final value is still '' or FileList. What we actually
                // want is to extract the File itself. Unfortunately, setValueAs only applies to
                // text inputs. This means that we must remember that the value is a FileList, and
                // then pick the actual file off of it in the onSubmit, prior to sending an API request.
                //
                ///////////////////////////////////////////////////////////////////////////
                validate: validateFileList
              })}
            />

            <div className='invalid-feedback'>{errors?.file?.message}</div>
          </div>

          <div className='mb-3'>
            <label htmlFor='age' className='form-label'>
              Country <sup className='text-danger'>*</sup>
            </label>

            <select
              className={`form-select form-select-sm${
                !(touchedFields?.country || isSubmitted)
                  ? ''
                  : errors?.country
                  ? ' is-invalid'
                  : ' is-valid'
              }`}
              id='country'
              {...register('country', {
                required: 'Country is required'
              })}
            >
              <option value=''></option>
              <option value='USA'>United States</option>
              <option value='CA'>Canada</option>
              <option value='UK'>United Kingdom</option>
            </select>

            <div className='invalid-feedback'>{errors?.country?.message}</div>
          </div>

          <section>
            <label htmlFor='age' className='form-label'>
              Pets
            </label>

            {Array.isArray(fields) && fields.length === 0 && (
              <div className='form-text text-center mb-3'>
                If you have pets, you can add them here.
              </div>
            )}

            {fields.map((field, index) => {
              return (
                <div key={field.id} className='mb-3'>
                  <div className='input-group'>
                    <input
                      autoComplete='off'
                      // className='form-control form-control-sm'

                      className={`form-control form-control-sm${
                        !(touchedFields?.pets?.[index] || isSubmitted)
                          ? ''
                          : errors?.pets?.[index]
                          ? ' is-invalid'
                          : ' is-valid'
                      }`}
                      placeholder='Pet name...'
                      spellCheck={false}
                      type='text'
                      {...register(`pets.${index}.name`, {
                        required: 'The pet name is required.'
                      })}
                    />

                    <button
                      onClick={() => remove(index)}
                      className='btn btn-outline-secondary btn-sm fw-bold bg-white-unimportant'
                      title='Remove pet'
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>

                  <div
                    className={`invalid-feedback${
                      (touchedFields?.pets?.[index] || isSubmitted) &&
                      errors?.pets?.[index]
                        ? ' d-block'
                        : ''
                    }`}
                  >
                    {errors?.pets?.[index]?.name?.message} ({index})
                  </div>
                </div>
              )
            })}
          </section>

          <div className='d-flex justify-content-center'>
            <div className='btn-group mb-3'>
              <button
                className='btn btn-outline-secondary btn-sm fw-bold bg-white-unimportant'
                onClick={() => {
                  prepend({ name: '' })
                }}
                style={{ minWidth: 125 }}
                type='button'
              >
                Prepend Pet
              </button>

              <button
                className='btn btn-outline-secondary btn-sm fw-bold bg-white-unimportant'
                onClick={() => {
                  append({ name: '' })
                }}
                style={{ minWidth: 125 }}
                type='button'
              >
                Append Pet
              </button>
            </div>
          </div>

          <div className='mb-3'>
            <label htmlFor='body' className='form-label'>
              Body <sup className='text-danger'>*</sup>
            </label>

            <textarea
              autoComplete='off'
              className={`form-control form-control-sm${
                !(touchedFields?.body || isSubmitted)
                  ? ''
                  : errors?.body
                  ? ' is-invalid'
                  : ' is-valid'
              }`}
              id='body'
              placeholder='Description...'
              spellCheck={false}
              style={{ height: 150 }}
              {...register('body', {})}
            />

            <div className='invalid-feedback'>{errors?.body?.message}</div>
          </div>

          {isSubmitting ? (
            <button
              className='d-block w-100 btn btn-success btn-sm fw-bold'
              disabled
              type='button'
            >
              <span
                aria-hidden='true'
                className='spinner-border spinner-border-sm me-2'
                role='status'
              ></span>
              Submitting...
            </button>
          ) : (
            <button
              className='d-block w-100 btn btn-success btn-sm fw-bold'
              // We could do this: disabled={!isValid}, but I prefer
              disabled={isSubmitted && !isValid ? true : false}
              // onClick={(() => { return handleSubmit(onSubmit, onError) })()}
              onClick={handleSubmit(onSubmit, onError)}
              type='button'
            >
              {isSubmitted && !isValid ? (
                <Fragment>
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    style={{ marginRight: 5 }}
                  />{' '}
                  Please Fix Errors...
                </Fragment>
              ) : (
                'Submit'
              )}
            </button>
          )}
        </form>
      </Fragment>
    )
  }

  /* ======================
          return 
  ====================== */

  return (
    <Fragment>
      <Head>
        <title>Form Demo</title>
        <meta name='description' content='Create Todo' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main} style={{ minHeight: '100vh' }}>
        <FunFont style={{ margin: '15px auto', textAlign: 'center' }}>
          Form Demo
        </FunFont>

        <HR style={{ marginBottom: 50 }} />

        {renderForm()}
      </main>
    </Fragment>
  )
}

export default FormDemoPage
