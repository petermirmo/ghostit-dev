import React, { Component } from 'react'
import langingPageBackground from './langing_page.jpeg'
import logo from './logo.png'
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

    // User's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

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
              style={{ marginTop: '5px' }}
              required
            />
            <hr style={styles.hr} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <hr style={styles.hr} />
            <input
              className="submit-colorful"
              value="Sign In"
              type="submit"
              style={{ marginBottom: '5px' }}
            />
          </form>

          <br />
          <p
            className="login-switch"
            onClick={() => this.setState({ loginForm: false })}
            style={{ width: '70%' }}
          >
            Dont have an account? Get started here!
          </p>
        </div>
      )
    } else {
      form = (
        <div id="registerForm" style={{ textAlign: 'center' }}>
          <form
            className="form-box"
            action="api/auth/email/register"
            method="post"
          >
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              style={{ marginTop: '5px' }}
              required
            />
            <hr style={styles.hr} />
            <input type="text" name="email" placeholder="Email" required />
            <hr style={styles.hr} />
            <input type="text" name="website" placeholder="Website" required />
            <hr style={styles.hr} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <hr style={styles.hr} />
            <input
              name="timezone"
              placeholder="Timezone"
              value={userTimezone}
              style={{ display: 'none' }}
              readOnly="true"
            />
            <input
              className="submit-colorful"
              type="submit"
              value="Register"
              style={{ marginBottom: '5px' }}
            />
          </form>

          <br />
          <p
            className="login-switch"
            onClick={() => this.setState({ loginForm: true })}
            style={{ width: '50%' }}
          >
            Have an account? Sign in!
          </p>
        </div>
      )
    }

    return (
      <div>
        <div className="landing-page">
          <img
            src={langingPageBackground}
            alt="Landing Page"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
          />
          <div className="container">
            <h1>Find Out How We Can Get You Even More Traffic</h1>
            <h5>
              Have you talked to anyone at Ghostit about our newest addition to
              our offering? We are currently building out our very own ads
              platform that will allow you to take your target audience and make
              your content even more powerful.
            </h5>
            <button>Talk to us to get this feature!</button>
          </div>
        </div>
        <div className="login-background">
          <img src={logo} />
          <div className="login-box">{form}</div>
        </div>
      </div>
    )
  }
}

export default Login
