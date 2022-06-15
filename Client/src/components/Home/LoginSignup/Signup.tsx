import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { apiHandler } from '../../../services/apiService/axios'
import { getSigin } from '../../../services/apiService/userServices'
import { BsFillEyeFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { setLocalStore } from '../../../common/localStorage'
import { useAppDispatch } from '../../../store/store'
import { setUserName } from '../../../store/reducer/walletReducer'

const Signup = () => {
  let history = useHistory();
  const dispatch = useAppDispatch();
  const [disabled, setDisabled] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  const handleHideShow = () => {
    setPasswordShown(!passwordShown)
  }

  const { handleSubmit, handleChange, values, errors, touched, handleBlur, dirty, isValid } = useFormik({
    initialValues: {
      userName: '',
      userEmail: '',
      password: '',
    },

    validationSchema: Yup.object({
      userName: Yup.string().trim().max(18,"* Username too long,Maximum 18 character allowed").matches(/^\S*$/, '* Username cannot contain white space').required("* User Name is required"),
      userEmail: Yup.string().trim().email("* Email is not valid").required("* Email is required"),
      password: Yup
        .string().trim()
        .required('* Please Enter your password')
        .matches(/^\S*$/, '* Password cannot contain white space')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})/,
          "* Must Contain 4 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
    }),
    onSubmit: (values: any) => {
      handleSignup(values)
    },

  });

  const handleSignup = async (values: any) => {
    setDisabled(true)
    await apiHandler(
      () => getSigin(values.userName,values.userEmail, values.password), {
      onSuccess: async (response: any) => {
        toast("Signup Successfull")
        setLocalStore('userName', values.userName)
        dispatch(setUserName(values.userName))
        history.push('/create-room')
        setDisabled(false)
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
              SIGNUP
            </h3>
            <div className="relative flex-auto">
              <div className='my-3'>
                <div className="text-lg signup-txt">USERNAME</div>
                <input
                  name="userName"
                  type="text"
                  value={values.userName}
                  onBlur={handleBlur}
                  placeholder="Enter username"
                  onChange={handleChange}
                  className={`w-100 px-2 py-2 input-bg text-primary`}
                  id="userName"
                />
                {errors.userName && touched.userName &&
                  <span className='error-txt'>{errors.userName}</span>
                }
              </div>
              <div className='my-3'>
                <div className="text-lg  signup-txt">EMAIL</div>
                <input
                  name="userEmail"
                  type="email"
                  onBlur={handleBlur}
                  value={values.userEmail}
                  placeholder="Enter email"
                  onChange={handleChange}
                  className={`w-100 px-2 py-2 input-bg text-primary`}
                  id="userEmail"
                />
                {errors.userEmail && touched.userEmail &&
                  <span className='error-txt'>{errors.userEmail}</span>
                }
              </div>
              <div className='my-3'>
                <div className="text-lg  signup-txt">PASSWORD</div>
                <div className='position-relative'>
                  <input
                    name="password"
                    type={passwordShown ? "text" : "password"}
                    placeholder="Enter Password"
                    onBlur={handleBlur}
                    value={values.password}
                    onChange={handleChange}
                    className={`w-100 px-2 py-2 input-bg text-primary`}
                    id="password"
                  />
                  <div className='password_hide_show' onClick={handleHideShow}>
                    {
                      passwordShown ?
                        <BsFillEyeFill /> :
                        <BsFillEyeSlashFill />
                    }
                  </div>
                  {errors.password && touched.password &&
                    <span className='error-txt'>{errors.password}</span>
                  }
                </div>
              </div>
              <div className='text-center mt-4'>
                {!disabled ?
                  <button
                    type="submit"
                    className={`custom-btn `}
                    disabled={!(dirty && isValid)}
                  >
                    SIGN UP NOW
                  </button> :
                  <button className='not-allowed custom-btn' disabled>
                    SIGNING UP
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
                <Link to='/login' className='text-white'> Login in your account</Link>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  )
}

export default Signup