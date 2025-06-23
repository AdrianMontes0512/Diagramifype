import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Code, GitBranch, Database, Cloud, Zap, Users, X } from 'lucide-react';
import logo from '../assets/logo.png';
import { Login, Register } from '../services/auth';

export default function FacePage() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.maxWidth = '100vw';
    document.documentElement.style.maxWidth = '100vw';
    return () => {
      document.body.style.overflow = '';
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
      document.body.style.maxWidth = '';
      document.documentElement.style.maxWidth = '';
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await Login({ user_id: loginEmail, password: loginPassword });
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        setShowLoginModal(false);
        navigate('/mainPage');
      }
    } catch (error) {
      alert('Usuario o contraseña incorrectos');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await Register({ user_id: signupEmail, password: signupPassword });
      if (data) {
        setShowSignupModal(false);
        alert('Registro exitoso! Ahora puedes iniciar sesión.');
      }
    } catch (error) {
      alert('Error en el registro');
    }
  };

  const features = [
    {
      icon: <Code size={48} />,
      title: "Código a Diagramas",
      description: "Convierte tu código JSON en diagramas visuales automáticamente"
    },
    {
      icon: <Database size={48} />,
      title: "Entidad-Relación",
      description: "Genera diagramas ER profesionales a partir de tus estructuras de datos"
    },
    {
      icon: <Cloud size={48} />,
      title: "Arquitecturas AWS",
      description: "Visualiza arquitecturas de soluciones usando servicios de Amazon Web Services"
    },
    {
      icon: <GitBranch size={48} />,
      title: "Flujos de Trabajo",
      description: "Crea diagramas de flujo complejos de manera simple y eficiente"
    },
    {
      icon: <Zap size={48} />,
      title: "Generación Rápida",
      description: "Transforma tu código en diagramas profesionales en segundos"
    },
    {
      icon: <Users size={48} />,
      title: "Colaboración",
      description: "Comparte y exporta tus diagramas para trabajar en equipo"
    }
  ];

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      <div 
        className={`min-h-screen w-screen overflow-x-hidden ${(showLoginModal || showSignupModal) ? 'blur-sm' : ''}`}
        style={{
          backgroundColor: '#f8f9fa',
          backgroundImage: `
            linear-gradient(rgba(200, 200, 200, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 200, 200, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          position: 'relative',
          maxWidth: '100vw',
          boxSizing: 'border-box',
        }}
      >
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src={logo} alt="Diagramify" className="h-20 w-auto mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Diagramifype</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-gray-600  text-white px-6 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#0066CC' }}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setShowSignupModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Registrarse
              </button>
            
            </div>
          </div>
        </div>
      </header>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Transforma tu <span style={{ color: '#0066CC' }}>Código</span> en 
            <br />
            <span style={{ color: '#0066CC' }}>Diagramas Profesionales</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Convierte automáticamente tu código JSON y estructuras de datos en 
            diagramas de arquitecturas AWS.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: '#0066CC' }}
            >
              Comenzar Gratis
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('features');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gray-200 hover:bg-gray-300 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Ver Características
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                De Código a Diagrama en Segundos
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Simplemente pega tu código JSON y observa cómo se transforma 
                automáticamente en diagramas profesionales listos para presentar.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#0066CC' }}></div>
                  <span className="text-gray-700">Soporte para JSON </span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#0066CC' }}></div>
                  <span className="text-gray-700">Diagramas profesionales</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#0066CC' }}></div>
                  <span className="text-gray-700">Arquitecturas de AWS</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#0066CC' }}></div>
                  <span className="text-gray-700">Exportación en múltiples formatos</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <pre className="text-green-400 text-sm">
{`with Diagram("Clustered Web Services", show=False):
    dns = Route53("dns")
    lb = ELB("lb")

    with Cluster("Services"):
        svc_group = [ECS("web1"),
                     ECS("web2"),
                     ECS("web3")]

    with Cluster("DB Cluster"):
        db_primary = RDS("userdb")
        db_primary - [RDS("userdb ro")]

    memcached = ElastiCache("memcached")

    dns >> lb >> svc_group
    svc_group >> db_primary
    svc_group >> memcached`}
              </pre>
              <div className="mt-4 text-center">
                <span className="text-blue-400">↓ Se convierte en ↓</span>
              </div>
              <div className="mt-4 bg-white rounded p-4">
                <div className="text-xs text-gray-800 text-center">
                  📊 Diagrama arquitectura solucion.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Características Poderosas
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para crear diagramas profesionales 
              a partir de tu código existente.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center mb-4" style={{ color: '#0066CC' }}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para Revolucionar tus Diagramas?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Únete a miles de desarrolladores que ya están creando 
            diagramas profesionales de manera eficiente.
          </p>
          <button
            onClick={() => setShowSignupModal(true)}
            className="text-white px-10 py-4 rounded-lg text-xl font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: '#0066CC' }}
          >
            Empezar Ahora - Es Gratis
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={logo} alt="Diagramify" className="h-8 w-auto mr-3" />
              <span className="text-xl font-bold">Diagramify</span>
            </div>
            <p className="text-gray-400">
              © 2025 Diagramify. Transformando código en visualizaciones.
            </p>
          </div>
        </div>
      </footer>
      </div>     
      {showLoginModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-300"
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-gray-200 transform transition-all duration-300 animate-in slide-in-from-bottom-4 zoom-in-95"
            style={{
              animation: 'slideInUp 0.4s ease-out'
            }}
          >
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-black hover:text-gray-700 p-1 transition-all duration-200 hover:scale-110"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-6 animate-in fade-in slide-in-from-top-2 duration-500 delay-150">
              <img src={logo} alt="Diagramify" className="h-16 w-auto mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
              <p className="text-gray-600 mt-2">Accede a tu cuenta de Diagramify</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 text-gray-900 placeholder-gray-500"
                />
              </div>
              <button
                type="submit"
                className="w-full text-white py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90 hover:scale-[1.02] shadow-lg"
                style={{ backgroundColor: '#0066CC' }}
              >
                Iniciar Sesión
              </button>
            </form>
            <div className="text-center mt-6 pt-4 border-t border-gray-200 animate-in fade-in duration-500 delay-500">
              <span className="text-gray-600">¿No tienes cuenta? </span>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Regístrate aquí
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignupModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-300"
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-gray-200 transform transition-all duration-300 animate-in slide-in-from-bottom-4 zoom-in-95"
            style={{
              animation: 'slideInUp 0.4s ease-out'
            }}
          >
            <button
              onClick={() => setShowSignupModal(false)}
              className="absolute top-4 right-4 text-black hover:text-gray-700 p-1 transition-all duration-200 hover:scale-110"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-6 animate-in fade-in slide-in-from-top-2 duration-500 delay-150">
              <img src={logo} alt="Diagramify" className="h-16 w-auto mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Crear Cuenta</h2>
              <p className="text-gray-600 mt-2">Únete a la comunidad de Diagramify</p>
            </div>
            <form onSubmit={handleSignup} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-300 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Crea una contraseña segura"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-300 text-gray-900 placeholder-gray-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] shadow-lg"
              >
                Crear Cuenta
              </button>
            </form>
            <div className="text-center mt-6 pt-4 border-t border-gray-200 animate-in fade-in duration-500 delay-500">
              <span className="text-gray-600">¿Ya tienes cuenta? </span>
              <button
                onClick={() => {
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Inicia sesión aquí
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}