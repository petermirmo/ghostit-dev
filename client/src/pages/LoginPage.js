import React, { Component } from 'react'
import '../css/theme.css'

const styles = {
  cursorPointer: {
    cursor: 'pointer',
  },
  hr: {
    border: '2px solid #eeeeef',
    width: '90%',
  },
}

class Login extends Component {
  state = {
    loginForm: true,
  }
  render() {
    const { loginForm } = this.state
    let form
    if (loginForm) {
      form = (
        <div id="loginForm">
          <form className="form-box" action="/api/auth/login" method="post">
            <input
              id="emailLoginInput"
              type="text"
              name="email"
              placeholder="Email"
            />
            <hr style={styles.hr} />
            <input type="password" name="password" placeholder="Password" />
            <input className="submit-colorful" value="Sign In" type="submit" />
          </form>

          <br />
          <p
            onClick={() => this.setState({ loginForm: false })}
            style={styles.cursorPointer}
          >
            Dont have an account? Get started here!
          </p>
        </div>
      )
    } else {
      form = (
        <div id="registerForm">
          <form
            className="form-box"
            action="api/auth/email/register"
            method="post"
          >
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
            />
            <hr style={styles.hr} />
            <input type="text" name="email" placeholder="Email" />
            <hr style={styles.hr} />
            <input type="text" name="website" placeholder="Website" />
            <hr style={styles.hr} />
            <input type="password" name="password" placeholder="Password" />
            <hr style={styles.hr} />

            <input className="submit-colorful" type="submit" value="Register" />
          </form>

          <br />
          <p
            onClick={() => this.setState({ loginForm: true })}
            style={styles.cursorPointer}
          >
            Have an account? Sign in!
          </p>
        </div>
      )
    }
    return (
      <div className="login-background">
        <div className="login-box">
          {form}
        </div>
      </div>
    )
  }
}

export default Login
