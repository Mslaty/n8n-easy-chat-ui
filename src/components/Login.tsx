// src/components/Login.tsx
import React, { useState, FormEvent } from 'react';
import './Login.css'; // Asegúrate de tener estilos básicos

// Interfaz para las props del componente Login
interface LoginProps {
    // Función que se llamará cuando el login sea exitoso
    // Recibe el nombre de usuario y la URL del webhook correspondiente
    onLogin: (username: string, webhookUrl: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    // Estado para el nombre de usuario
    const [username, setUsername] = useState<string>('');
    // Estado para la contraseña
    const [password, setPassword] = useState<string>('');
    // Estado para mensajes de error durante el login
    const [error, setError] = useState<string | null>(null);
    // Estado para indicar si la petición de login está en curso
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Manejador para el envío del formulario de login
    const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevenir recarga de la página
        setError(null); // Limpiar errores previos

        // Validación simple
        if (!username.trim() || !password.trim()) {
            setError('Por favor, introduce tu usuario y contraseña.');
            return;
        }

        setIsLoading(true); // Indicar que la carga ha comenzado

        try {
            // Construir la URL de la API de login (asume que el backend corre en el mismo origen o usa CORS)
            // Si el backend corre en un puerto diferente (ej. 5000) en desarrollo, ajusta la URL:
            // const apiUrl = 'http://localhost:5000/api/login';
            const apiUrl = '/api/login'; // Usa ruta relativa si está en el mismo origen

            // Realizar la petición POST al backend
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                // 'include' es crucial para que las cookies de sesión se envíen y reciban
                credentials: 'include',
            });

            // Procesar la respuesta del backend
            const responseData = await response.json();

            if (response.ok) {
                // ¡Login exitoso!
                console.log('Login successful:', responseData);

                // Extraer el nombre de usuario confirmado por el backend (puede ser diferente en formato)
                const loggedInUsername = responseData.user?.name || username; // Usar el nombre de la respuesta si existe

                // Construir la URL del webhook para este usuario
                // Asume que la ruta del webhook en el backend es /webhook/chat/<username>
                // Usamos toLowerCase() para consistencia, asumiendo que la ruta backend también lo espera así
                const webhookUrl = `${window.location.origin}/webhook/chat/${username.toLowerCase()}`;

                // Llamar a la función onLogin pasada como prop con los datos necesarios
                onLogin(loggedInUsername, webhookUrl);

            } else {
                // Hubo un error en el login (ej. credenciales incorrectas)
                setError(responseData.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
                console.error('Login failed:', responseData);
            }

        } catch (err) {
            // Error de red o al procesar la petición/respuesta
            console.error('Network or processing error during login:', err);
            setError('No se pudo conectar con el servidor. Verifica tu conexión.');
        } finally {
            // Asegurarse de que el estado de carga se desactive al finalizar
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLoginSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        // Permitir autocompletar usuario
                        autoComplete="username"
                        required // Validación HTML básica
                        disabled={isLoading} // Deshabilitar mientras carga
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // Usar 'current-password' para gestores de contraseñas
                        autoComplete="current-password"
                        required
                        disabled={isLoading}
                    />
                </div>

                {/* Mostrar mensajes de error si existen */}
                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
            </form>
            {/* Puedes añadir un pie de página o enlaces si es necesario */}
            {/* <p className="login-footer">¿No tienes cuenta? <a href="/register">Regístrate</a></p> */}
        </div>
    );
};

export default Login;
