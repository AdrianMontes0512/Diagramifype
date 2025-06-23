import { useState, useEffect } from 'react';
import { Code, Database, Zap, Users, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import template1 from '../assets/1.png';
import template2 from '../assets/2.png';
import template3 from '../assets/3.png';
import template4 from '../assets/4.png';
import template5 from '../assets/5.png';
import template6 from '../assets/6.png';
import DiagramEditor from '../components/DiagramEditor';
import { ValidateToken } from '../services/auth';

export default function MainPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('editor');
  const [editorCode, setEditorCode] = useState('');
  const [isValidatingToken, setIsValidatingToken] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/');
        return;
      }

      try {
        await ValidateToken(token);
        setIsValidatingToken(false);
      } catch (error) {
        console.error('Token inválido:', error);
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    validateSession();
  }, [navigate]);

  const tabs = [
    { id: 'editor', name: 'Editor', icon: <Code size={18} /> },
    { id: 'templates', name: 'Plantillas', icon: <Database size={18} /> },
    { id: 'tools', name: 'Herramientas', icon: <Zap size={18} /> },
    { id: 'community', name: 'Comunidad', icon: <Users size={18} /> }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleUseTemplate = (code: string) => {
    setEditorCode(code);
    setActiveTab('editor');
  };

  if (isValidatingToken) {
    return (
      <div className="min-h-screen w-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <img src={logo} alt="Diagramify" className="h-20 w-auto mx-auto mb-4" />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-screen bg-gray-50" 
      style={{ 
        overflowX: 'hidden', 
        maxWidth: '100vw',
        backgroundColor: '#f8f9fa',
        backgroundImage: `
          linear-gradient(rgba(200, 200, 200, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(200, 200, 200, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    >
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src={logo} alt="Diagramify" className="h-20 w-auto mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Diagramifype</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User size={20} />
                <span className="font-medium">Usuario</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-white px-6 py-2 rounded-lg transition-all hover:opacity-90"
                style={{ backgroundColor: '#dc2626' }}
              >
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="shadow-lg" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-12 py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 py-3 px-5 rounded-lg font-semibold text-base transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-white transform scale-105 shadow-lg'
                    : 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-102'
                }`}
                style={activeTab === tab.id ? { backgroundColor: '#0066CC' } : {}}
              >
                <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-white' : 'bg-gray-600'}`}>
                  <div className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-300'}>
                    {tab.icon}
                  </div>
                </div>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-full mx-auto px-4 py-6">
        <div 
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          style={{ height: '800px' }} 
        >
          {activeTab === 'editor' && (
            <DiagramEditor 
              className="w-full" 
              initialCode={editorCode}
              style={{ height: '100%' }}
            />
          )}
          {activeTab === 'templates' && (
            <div className="h-full overflow-y-auto">
              <TemplatesTab onUseTemplate={handleUseTemplate} />
            </div>
          )}
          {activeTab === 'tools' && (
            <div className="h-full overflow-y-auto">
              <ToolsTab />
            </div>
          )}
          {activeTab === 'community' && (
            <div className="h-full overflow-y-auto">
              <CommunityTab />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TemplatesTab({ onUseTemplate }: { onUseTemplate: (code: string) => void }) {
  const templates = [
    {
      id: 1,
      name: "Arquitectura AWS",
      description: "Load balancer distribuyendo tráfico a múltiples workers conectados a base de datos",
      preview: "ELB → [EC2 workers] → RDS",
      image: template1,
      code: `with Diagram("Grouped Workers", show=False, direction="TB"):
    ELB("lb") >> [EC2("worker1"),
                  EC2("worker2"),
                  EC2("worker3"),
                  EC2("worker4"),
                  EC2("worker5")] >> RDS("events")`
    },
    {
      id: 2,
      name: "Arquitectura AWS",
      description: "Servicios web clusterizados con DNS, load balancer, caché y cluster de base de datos",
      preview: "Route53 → ELB → [ECS Services] → RDS Cluster + Cache",
      image: template2,
      code: `with Diagram("Clustered Web Services", show=False):
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
    svc_group >> memcached`
    },
    {
      id: 3,
      name: "Arquitectura AWS",
      description: "Procesamiento de eventos con Kubernetes, workers, colas y funciones Lambda",
      preview: "EKS → ECS Workers → SQS → Lambda → S3/Redshift",
      image: template3,
      code: `with Diagram("Event Processing", show=False):
    source = EKS("k8s source")

    with Cluster("Event Flows"):
        with Cluster("Event Workers"):
            workers = [ECS("worker1"),
                       ECS("worker2"),
                       ECS("worker3")]

        queue = SQS("event queue")

        with Cluster("Processing"):
            handlers = [Lambda("proc1"),
                        Lambda("proc2"),
                        Lambda("proc3")]

    store = S3("events store")
    dw = Redshift("analytics")

    source >> workers >> queue >> handlers
    handlers >> store
    handlers >> dw`
    },
    {
      id: 4,
      name: "Arquitectura AWS",
      description: "Recolección de mensajes con IoT Core, PubSub y análisis de datos en tiempo real",
      preview: "IoT Core → PubSub → DataFlow → BigQuery/GCS/AppEngine",
      image: template4,
      code: `with Diagram("Message Collecting", show=False):
    pubsub = PubSub("pubsub")

    with Cluster("Source of Data"):
        [IotCore("core1"),
         IotCore("core2"),
         IotCore("core3")] >> pubsub

    with Cluster("Targets"):
        with Cluster("Data Flow"):
            flow = Dataflow("data flow")

        with Cluster("Data Lake"):
            flow >> [BigQuery("bq"),
                     GCS("storage")]

        with Cluster("Event Driven"):
            with Cluster("Processing"):
                flow >> AppEngine("engine") >> BigTable("bigtable")

            with Cluster("Serverless"):
                flow >> Functions("func") >> AppEngine("appengine")

    pubsub >> flow`
    },
    {
      id: 5,
      name: "Arquitectura AWS",
      description: "Servicio web avanzado con infraestructura on-premises, monitoreo y analytics",
      preview: "Nginx → [gRPC Services] → Redis HA + PostgreSQL HA → Kafka → Spark",
      image: template5,
      code: `with Diagram("Advanced Web Service with On-Premises", show=False):
    ingress = Nginx("ingress")

    metrics = Prometheus("metric")
    metrics << Grafana("monitoring")

    with Cluster("Service Cluster"):
        grpcsvc = [
            Server("grpc1"),
            Server("grpc2"),
            Server("grpc3")]

    with Cluster("Sessions HA"):
        primary = Redis("session")
        primary - Redis("replica") << metrics
        grpcsvc >> primary

    with Cluster("Database HA"):
        primary = PostgreSQL("users")
        primary - PostgreSQL("replica") << metrics
        grpcsvc >> primary

    aggregator = Fluentd("logging")
    aggregator >> Kafka("stream") >> Spark("analytics")

    ingress >> grpcsvc >> aggregator`
    },
    {
      id: 6,
      name: "Arquitectura AWS",
      description: "Arquitectura stateful con servicios, StatefulSet, pods y almacenamiento persistente",
      preview: "Service → [Pods + PVC] ← StatefulSet ← PV ← StorageClass",
      image: template6,
      code: `with Diagram("Stateful Architecture", show=False):
    with Cluster("Apps"):
        svc = Service("svc")
        sts = StatefulSet("sts")

        apps = []
        for _ in range(3):
            pod = Pod("pod")
            pvc = PVC("pvc")
            pod - sts - pvc
            apps.append(svc >> pod >> pvc)

    apps << PV("pv") << StorageClass("sc")`
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Plantillas de Diagramas AWS</h2>
        <p className="text-lg text-gray-600">
          Comienza rápidamente con nuestras plantillas de arquitecturas AWS
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-gray-600 text-sm">{template.description}</p>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Vista previa:</div>
              <div className="text-sm font-mono text-gray-700">{template.preview}</div>
            </div>

            <div className="mb-4">
              <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto max-h-32">
                {template.code}
              </pre>
            </div>

            <button 
              onClick={() => onUseTemplate(template.code)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors mb-4"
            >
              Usar Plantilla
            </button>

            {/* Imagen de la plantilla */}
            <div>
              <img 
                src={template.image} 
                alt={`Plantilla ${template.id}`}
                className="w-full h-40 object-cover rounded-lg border border-gray-200"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolsTab() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Herramientas y Utilidades</h2>
        <p className="text-lg text-gray-600">
          Herramientas adicionales para mejorar tu flujo de trabajo
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <Zap className="text-blue-600 mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Validador YAML</h3>
          <p className="text-gray-600 text-sm mb-4">
            Valida y formatea tu código YAML antes de generar diagramas
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
            Usar Herramienta
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <Code className="text-purple-600 mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Exportador</h3>
          <p className="text-gray-600 text-sm mb-4">
            Exporta diagramas en PNG, SVG, PDF y otros formatos
          </p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
            Usar Herramienta
          </button>
        </div>
      </div>
    </div>
  );
}

function CommunityTab() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Comunidad Diagramify</h2>
        <p className="text-lg text-gray-600">
          Conecta con otros usuarios, comparte tus diagramas y aprende de la comunidad
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Developers</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Luis Millones</h4>
                <p className="text-sm text-gray-600">luis.millones@utec.edu.pe</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">Paul Rios</h4>
                <p className="text-sm text-gray-600">paul.rios@utec.edu.pe</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-gray-900">Adrian Montes</h4>
                <p className="text-sm text-gray-600">adrian.montes@utec.edu.pe</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Recursos de la Comunidad</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                📚 Guías y Tutoriales
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                💬 Foro de Discusión
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                🎯 Desafíos Semanales
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                🏆 Galería de Proyectos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}