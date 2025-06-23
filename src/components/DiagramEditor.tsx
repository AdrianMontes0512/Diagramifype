import { useState, useRef, useEffect } from 'react';
import { Play, Download, Copy, FileText, Upload } from 'lucide-react';

interface DiagramEditorProps {
  className?: string;
  initialCode?: string;
  style?: React.CSSProperties;
}

export default function DiagramEditor({ className = '', initialCode = '', style }: DiagramEditorProps) {
  const [code, setCode] = useState('');
  
  const [diagramType] = useState('flowchart');
  const [generatedDiagram, setGeneratedDiagram] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasDiagramGenerated, setHasDiagramGenerated] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [showGithubInput, setShowGithubInput] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCode && initialCode.trim() !== '') {
      setCode(initialCode);
      setHasDiagramGenerated(false);
      setGeneratedDiagram('');
    }
  }, [initialCode]);

  const diagramTypes = [
    { value: 'flowchart', label: 'Diagrama de Flujo', placeholder: 'Describe el proceso paso a paso...' },
    { value: 'aws', label: 'Diagrama AWS', placeholder: 'Define la arquitectura AWS...' },
    { value: 'er', label: 'Diagrama ER', placeholder: 'Especifica entidades y relaciones...' },
    { value: 'sequence', label: 'Diagrama de Secuencia', placeholder: 'Define las interacciones...' },
    { value: 'class', label: 'Diagrama de Clases', placeholder: 'Define las clases y sus relaciones...' },
    { value: 'network', label: 'Diagrama de Red', placeholder: 'Especifica la topología de red...' }
  ];

  const validateCode = (code: string): string | null => {
    if (!code.trim()) {
      return 'El código no puede estar vacío';
    }
    if (code.trim().length < 10) {
      return 'El código debe tener al menos 10 caracteres';
    }
    return null;
  };

  const formatCodeToJSON = (code: string): string => {
    try {
      JSON.parse(code);
      return code;
    } catch {

      return JSON.stringify({
        code: code
      }, null, 2);
    }
  };

  const handleGenerateDiagram = async () => {
    const error = validateCode(code);
    if (error) {
      alert(error);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    setIsGenerating(true);
    try {
      const codeToSend = formatCodeToJSON(code);

      const response = await fetch('https://0fjtb5zfng.execute-api.us-east-1.amazonaws.com/diagram/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: codeToSend
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          window.location.href = '/';
          return;
        }
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      const result = await response.text();
      
      try {
        const jsonResult = JSON.parse(result);
        
        if (jsonResult.download_url) {
          setGeneratedDiagram(`<img src="${jsonResult.download_url}" alt="Diagrama generado" style="max-width: 100%; height: auto;" />`);
        } else {
          setGeneratedDiagram(JSON.stringify(jsonResult, null, 2));
        }
      } catch (parseError) {
        if (result.startsWith('data:image/') || result.startsWith('http')) {
          setGeneratedDiagram(`<img src="${result}" alt="Diagrama generado" style="max-width: 100%; height: auto;" />`);
        } else {
          setGeneratedDiagram(result);
        }
      }
      
      setHasDiagramGenerated(true);
      
    } catch (error) {
      console.error('Error al generar diagrama:', error);
      alert(`Error al generar el diagrama: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportDiagram = async () => {
    if (!generatedDiagram) {
      alert('Primero debes generar un diagrama');
      return;
    }

    try {
      if (generatedDiagram.includes('<img')) {
        const imgMatch = generatedDiagram.match(/src="([^"]+)"/);
        if (imgMatch && imgMatch[1]) {
          const imageUrl = imgMatch[1];
          
          const link = document.createElement('a');
          link.href = imageUrl;
          link.download = `diagrama-${Date.now()}.png`;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          
          document.body.appendChild(link);
          
          link.click();
          
          document.body.removeChild(link);
          
        }
      } else {
        const content = generatedDiagram;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `diagrama-${Date.now()}.txt`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar el diagrama');
    }
  };

  const loadFromGithub = async () => {
    if (!githubUrl.trim()) {
      alert('Por favor ingresa una URL de GitHub válida');
      return;
    }

    try {
      let rawUrl = githubUrl;
      if (githubUrl.includes('github.com') && !githubUrl.includes('raw.githubusercontent.com')) {
        rawUrl = githubUrl
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/');
      }

      const response = await fetch(rawUrl);
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo');
      }
      
      const content = await response.text();
      setCode(content);
      setShowGithubInput(false);
      setGithubUrl('');
    } catch (error) {
      alert('Error al cargar desde GitHub. Verifica la URL.');
    }
  };

  const getPlaceholderText = () => {
    return `Escribe tu código Python aquí, por ejemplo:

with Diagram("Clustered Web Services", show=False):
    dns = Route53("dns")
    lb = ELB("lb")

    with Cluster("Services"):
        svc_group = [ECS("web1"),
                     ECS("web2"),
                     ECS("web3")]

    dns >> lb >> svc_group`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['text/plain', 'application/json', 'text/yaml', 'application/x-yaml'];
      const validExtensions = ['.txt', '.json', '.yaml', '.yml'];
      
      const isValidType = validTypes.includes(file.type) || 
                         validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (isValidType) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setCode(content);
        };
        reader.readAsText(file);
      } else {
        alert('Por favor selecciona un archivo válido (.txt, .json, .yaml, .yml)');
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      const lineNumbersContent = lineNumbersRef.current.firstElementChild as HTMLElement;
      if (lineNumbersContent) {
        lineNumbersContent.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prev => Math.max(0.25, Math.min(3, prev + delta)));
  };

  return (
    <div className={`flex bg-gray-100 ${className}`} style={{ height: '100%', width: '100%', ...style }}>
      <div className="bg-white shadow-lg" style={{ height: '100%', width: '50%', minWidth: '50%', maxWidth: '50%' }}>
        <div className="text-white p-4 flex justify-between items-center" style={{ backgroundColor: '#0066CC' }}>
          <div className="flex items-center space-x-4">
            <FileText size={20} />
            <h2 className="text-lg font-semibold">Editor de Código JSON</h2>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowGithubInput(!showGithubInput)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded flex items-center space-x-2 transition-colors"
              title="Cargar desde GitHub"
            >
              <Upload size={16} />
              <span>GitHub</span>
            </button>
            <button 
              onClick={handleUploadClick}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded flex items-center space-x-2 transition-colors"
            >
              <Upload size={16} />
              <span>Subir</span>
            </button>
            <button 
              onClick={handleGenerateDiagram}
              disabled={isGenerating}
              className={`px-4 py-2 rounded flex items-center space-x-2 transition-colors ${
                isGenerating 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <Play size={16} className={isGenerating ? 'animate-spin' : ''} />
              <span>{isGenerating ? 'Generando...' : 'Generar'}</span>
            </button>
          </div>
        </div>

        {showGithubInput && (
          <div className="bg-blue-50 p-4 border-b">
            <div className="flex space-x-2">
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/usuario/repo/blob/main/archivo.txt"
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={loadFromGithub}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                Cargar
              </button>
              <button
                onClick={() => setShowGithubInput(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.json,.yaml,.yml"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        <div className="p-4" style={{ height: 'calc(100% - 140px)' }}>
          <div className="w-full bg-gray-900 rounded-lg h-full overflow-hidden">
            <div className="flex h-full">
              <div 
                ref={lineNumbersRef}
                className="bg-gray-800 text-gray-400 text-sm font-mono min-w-[60px] select-none flex-shrink-0"
                style={{ 
                  overflow: 'hidden', 
                  height: '100%',
                  position: 'relative'
                }}
              >
                <div 
                  className="pt-4 pb-4 pr-2 pl-2"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 'auto'
                  }}
                >
                  {code.split('\n').map((_, index) => (
                    <div key={index} className="text-right" style={{ lineHeight: '24px', height: '24px', fontSize: '14px' }}>
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
              
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={handleScroll}
                className="flex-1 font-mono text-sm bg-gray-900 text-gray-100 pt-4 pb-4 pl-4 pr-4 resize-none focus:outline-none border-none"
                placeholder={getPlaceholderText()}
                spellCheck={false}
                style={{ 
                  lineHeight: '24px',
                  fontSize: '14px',
                  height: '100%',
                  outline: 'none',
                  overflow: 'auto'
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-3 flex justify-between items-center border-t">
          <div className="text-sm text-gray-600">
            Líneas: {code.split('\n').length} | Caracteres: {code.length}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => navigator.clipboard.writeText(code)}
              className="text-gray-600 hover:text-gray-800 p-1"
              title="Copiar código"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="w-1 bg-gray-300" style={{ flexShrink: 0 }}></div>

      <div className="bg-white shadow-lg" style={{ height: '100%', width: '50%', minWidth: '50%', maxWidth: '50%' }}>
        <div className="text-white p-4 flex justify-between items-center" style={{ backgroundColor: '#0066CC' }}>
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${hasDiagramGenerated ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <h2 className="text-lg font-semibold">Diagrama AWS</h2>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleExportDiagram}
              disabled={!hasDiagramGenerated}
              className={`px-4 py-2 rounded flex items-center space-x-2 transition-colors ${
                hasDiagramGenerated 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-500 cursor-not-allowed'
              }`}
            >
              <Download size={16} />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-hidden" style={{ height: 'calc(100% - 140px)' }}>
          <div 
            ref={diagramRef}
            className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden"
            onWheel={handleWheel}
            style={{ 
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          >
            <div className="text-center w-full h-full">
              {hasDiagramGenerated && generatedDiagram ? (
                <div className="bg-gray-50 rounded-lg w-full h-full relative overflow-hidden" style={{ padding: '24px' }}>
                  {/* Controles de Zoom */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 bg-white rounded-lg shadow-lg p-2">
                    <button
                      onClick={handleZoomIn}
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      title="Zoom In"
                    >
                      +
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <button
                      onClick={handleResetZoom}
                      className="px-2 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs"
                      title="Reset Zoom"
                    >
                      ⌂
                    </button>
                    <div className="text-xs text-gray-600 text-center">
                      {Math.round(zoomLevel * 100)}%
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4 text-gray-800 relative z-10">
                    {diagramTypes.find(type => type.value === diagramType)?.label}
                  </h3>
                  
                  <div className="w-full h-full flex items-center justify-center relative" style={{ minHeight: 'calc(100% - 80px)' }}>
                    {generatedDiagram.includes('<img') ? (
                      <div 
                        className="flex items-center justify-center"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{
                          transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoomLevel})`,
                          transition: isDragging ? 'none' : 'transform 0.2s ease',
                          cursor: isDragging ? 'grabbing' : 'grab',
                          transformOrigin: 'center center'
                        }}
                      >
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: generatedDiagram.replace(
                              /style="[^"]*"/,
                              'style="max-width: none; height: auto; user-select: none; pointer-events: none; display: block;"'
                            )
                          }}
                        />
                      </div>
                    ) : (
                      <div 
                        className="w-full h-full overflow-auto"
                        style={{
                          transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoomLevel})`,
                          transition: isDragging ? 'none' : 'transform 0.2s ease',
                          transformOrigin: 'center center'
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        <pre className="text-sm text-gray-700 text-left whitespace-pre-wrap font-mono leading-relaxed">
                          {generatedDiagram}
                        </pre>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white px-2 py-1 rounded z-10">
                    💡 Usa la rueda del mouse para zoom, arrastra para mover
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <FileText size={32} />
                  </div>
                  <p className="text-lg font-medium">
                    {code.trim() ? 'Presiona "Generar" para crear el diagrama' : 'Escribe código para generar el diagrama'}
                  </p>
                  <p className="text-sm mt-2">
                    {validateCode(code) ? 
                      `⚠️ ${validateCode(code)}` : 
                      'El diagrama aparecerá aquí una vez generado'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-3 flex justify-between items-center border-t">
          <div className="text-sm text-gray-600">
            {hasDiagramGenerated ? 
              `Diagrama generado: ${new Date().toLocaleTimeString()}` : 
              'Esperando diagrama...'
            }
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${hasDiagramGenerated ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {hasDiagramGenerated ? 'Listo' : 'Pendiente'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
