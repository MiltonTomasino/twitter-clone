import { useState } from "react"
import "../styles/form.css"

function Register() {

    const [error, setError] = useState([]);
    const [form, setForm] = useState({
        username: "",
        password: ""
    })

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        console.log("Form info: ", form);
        
    };

    async function registerUser(e) {

        e.preventDefault();

        try {
            const res = await fetch("/api/user/register", {
                method: "POST",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(form)
            });

            if (!res.ok) {
                const data = await res.json();
                console.log("error registering: ", data.error);
                setError(data.error);
                return
            }

            window.location.href = "/login";

        } catch (error) {
            console.error("Error registering user: ", error);
            setError([{ msg: "Something went wrong. Please try again."}]);
        }
    }

    return (
        <div className='form-body'>
            <h1>Register User</h1>
            <form className="form-container" onSubmit={registerUser}>
                {error.length > 0 && (
                    <div className="info error">
                        {error.map((err, idx) => (
                            <small key={idx}>{err.msg}</small>
                        ))}
                    </div>
                )}
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
                <button type="submit">Register</button>
                <a href="/login">Return to login.</a>
            </form>
        </div>
    )
}

export default Register