import { useState } from 'react';
import "../styles/form.css"

function Login() {

    const [error, setError] = useState("");
    const [form, setForm] = useState({
        username: "",
        password: ""
    })

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        }); 
    };

    async function logInUser(e) {
        e.preventDefault();

        try {
            const res = await fetch("/api/user/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(form)
            })

            if (!res.ok) {
                const data = await res.json();
                setError(data.error);
                return;
            }

            window.location.href = "/";

        } catch (error) {
            console.error("Login error: ", error);
            setError("Something went wrong. Please try again.");
        }

    }


    return (
        <div className='form-body'>
            <h1>User Log In</h1>
            <form className="form-container" onSubmit={logInUser}>
                {error && <div className="info error">
                    {error}
                </div>}
                <div className="form-info">
                    <span><label htmlFor="username">Username:</label></span>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={(e) => handleChange(e)}
                        required />
                </div>
                <div className="form-info">
                    <span><label htmlFor="password">Password:</label></span>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={(e) => handleChange(e)}
                        required />
                </div>
                <button type="submit">Login</button>
                <a href="/register">Dont have an account? Register here.</a>
            </form>
        </div>
    )
}

export default Login