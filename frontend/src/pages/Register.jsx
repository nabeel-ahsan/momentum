import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  const postData = async () => {
    setLoading(true);
    const url = "http://localhost:3000/auth/signup";
    try {
      const response = await fetch(url, {
        method: "POST",

        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),

        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      console.log(response.status);
      const data = await response.json();
      if (response.ok) {
        toast.success(`${name} successfully registered`);
        setName("");
        setEmail("");
        setPassword("");

        navigate("/login");
      } else {
        alert(data.message || "Error creating user!");
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("Error occured!");
    } finally {
      setLoading(false);
    }
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const validateForm = () => {
    if (name === "" || email === "" || password === "") {
      toast.error("Invalid Form Input!");

      return false;
    } else if (!email.includes("@")) {
      toast.error("Invalid Form Input!");

      return false;
    } else if (password.length < 6) {
      toast.error("Invalid Form Input!");

      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await postData();
    }
  };

  return (
    <div className="form">
      <div>
        <h1>User Registration</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="label">Name</label>
        <input
          onChange={handleName}
          className="input"
          value={name}
          type="text"
          placeholder="John Doe"
        />

        <label className="label">Email</label>
        <input
          onChange={handleEmail}
          className="input"
          value={email}
          type="email"
          placeholder="johndoe@example.com"
        />

        <label className="label">Password</label>
        <input
          onChange={handlePassword}
          className="input"
          value={password}
          type="password"
          placeholder="must be atleast 6 characters"
        />

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Register;
