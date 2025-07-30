import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Perform login logic (validation/auth etc)

    // After successful login:
    alert("Login successful!");
    navigate('/'); // ✅ redirects to homepage
  };

  return (
    <form onSubmit={handleLogin}>
      {/* your form elements here */}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
