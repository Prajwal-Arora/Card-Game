import React, {  useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setLocalStore } from '../../../common/localStorage'
import { apiHandler } from '../../../services/apiService/axios'
import { getLoggedIn } from '../../../services/apiService/userServices'
import { setUserName } from '../../../store/reducer/walletReducer'
import { useAppDispatch } from '../../../store/store'
import { BsFillEyeFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";

const Login = () => {
  let history = useHistory();
  const [passwordShown, setPasswordShown] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useAppDispatch();

  const handleHideShow = () => {
    setPasswordShown(!passwordShown)
  }


  const { handleSubmit, handleChange, values, errors,touched,handleBlur,dirty,isValid } = useFormik({
    initialValues: {
      userName: '',
      password: '',
    },

    validationSchema: Yup.object({
      userName: Yup.string().trim().required("* User Name is required").matches(/^\S*$/, '* Username cannot contain white space'),
      password: Yup
        .string()
        .trim()
        .matches(/^\S*$/, '* Password cannot contain white space')
        .required('* Please Enter your password')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})/,
          "* Must Contain 4 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
    }),
    onSubmit: (values: any) => {
      handleLogin(values)
    },

  });


  const handleLogin = async (values: any) => {
    setDisabled(true)
    await apiHandler(
      () => getLoggedIn(values.userName, values.password), {
      onSuccess: (response: any) => {
        toast(response.msg)
        setLocalStore('userName', values.userName)
        dispatch(setUserName(values.userName))
        history.push('/create-room')
      },
      onError: (error: any) => {
        toast(error.response.data.msg)
      },
    }
    );
    setDisabled(false)
  }

  return (
    <div className='signup-form'>
      <Container>
        <form onSubmit={handleSubmit}>
          <div>
            <h3 className=' text-center signup-txt'>
              LOGIN
            </h3>
            <div className="relative flex-auto">
              <div className='my-3'>
                <div className="text-lg  signup-txt">USERNAME</div>
                <input
                  name="userName"
                  type="text"
                  onBlur={handleBlur}
                  placeholder="Enter username"
                  className={`w-100 px-2 py-2 input-bg text-primary`}
                  onChange={handleChange}
                  value={values.userName}
                  id="userName"
                />
                {errors.userName && touched.userName &&
                  <span className='error-txt'>{errors.userName}</span>
                }
              </div>
              <div className='my-3'>
                <div className="text-lg  signup-txt">PASSWORD</div>
                <div className='position-relative'>
                  <input
                    // {...formik.getFieldProps('password')}
                    name="password"
                    onBlur={handleBlur}
                    type={passwordShown ? "text" : "password"}
                    placeholder="Enter Password"
                    className={`w-100 px-2 py-2 input-bg text-primary`}
                    // onChange={(e) => setUserPassword(e.currentTarget.value)}
                    onChange={handleChange}
                    value={values.password}
                    id="password"
                  />
                  <div className='password_hide_show' onClick={handleHideShow}>
                    {
                      passwordShown ?
                        <BsFillEyeFill /> :
                        <BsFillEyeSlashFill />
                    }
                  </div>
                  {errors.password  && touched.password &&
                    <span className='error-txt'>{errors.password}</span>}
                </div>
              </div>
              <div className='text-center mt-4'>
                {!disabled ? <button
                  className="custom-btn "
                  type="submit"
                  disabled={!(dirty && isValid)}

                >
                  LOG IN NOW
                </button> :
                  <button className="custom-btn not-allowed" disabled>
                    LOGGING
                  </button>
                }
              </div>
              <div className='text-center my-3'>
                <Link
                  className="text-decoration-none"
                  to={{
                    pathname: "/",
                  }}
                >
                  <button
                    className="btn-text-login"
                    id="modal"
                  >
                    BACK TO HOME
                  </button>
                </Link>
              </div>
              <div className='text-center  text-decoration-underline'>
                <Link to='/signup' className='text-white'> Sign up your account</Link>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  )
}

export default Login