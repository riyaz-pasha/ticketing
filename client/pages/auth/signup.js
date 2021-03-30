import { useState } from 'react';
import axios from "axios";
import useRequest from '../../hooks/useRequest';

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { errors, doRequest } = useRequest({
        url: "/api/users/signup",
        method: "post",
        body: { email, password }
    });

    const onSubmit = async (event) => {
        event.preventDefault();

        doRequest();
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email</label>
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Sign up</button>
        </form>
    )
}

export default Signup
