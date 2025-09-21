import React from "react";
import { useState } from "react";
import useSigninAuth from "./SigninAuth";
// handleSignIn,
//     loading,
//     error,
//     success,
//     setError,
//     setSuccess
function SignupForm() {

    const { handleSignIn, loading, error, success } = useSigninAuth();
    
    // State for form inputs
    const [username, setUsername] = useState("yawar");
    const [password, setPassword] = useState("1234");

    // Handle form submission
    const onSubmit = async (e) => {
        e.preventDefault();
        await handleSignIn(username, password);
    };
    
    return(
        <div className="container">
        <div className="form-container">
            <div className="form-title">
                <h2>Welcome to</h2>
                <h3>AI Career Guidance</h3>
                <p className="paragraph">Your Personal AI Assistance</p>
            </div>
            
            <h4 className="mb-4">Sign In</h4>
            
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="username" 
                        placeholder="prerna" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="form-text">Enter your username to sign in.</div>
                </div>
                
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="rememberMe"/>
                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                </div>
                
                <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
                
                {/* Error message */}
                {error && (
                    <div className="alert alert-danger mt-4">
                        {error}
                    </div>
                )}
                
                {/* Success message */}
                {success && (
                    <div className="alert alert-success mt-3">
                        {success}
                    </div>
                )}
                
                <div className="text-center mt-3">
                    <span>Don't have an account? </span>
                    <a href="#" className="text-primary">Sign up</a>
                </div>
            </form>
        </div>
    </div>
    )
}
export default SignupForm;