import { useState } from 'react';
import { ShoppingBag, ArrowRight, CheckCircle, Sparkles, Leaf, Heart, Brain, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bgFungi from "../../assets/bg-fungi.webp";
import Logo from "../../assets/alquemystic.jpg"
import Navbar from '../comon/Navbar';
import { SEO } from '../SEO';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeProduct, setActiveProduct] = useState(0);

  const products = [
    {
      name: "TREMELLA",
      benefits: [
        "Promueve la salud y belleza de la piel",
        "Antiinflamatorio",
        "Hidrata la piel y suaviza arrugas",
        "Regula la microbiota intestinal"
      ],
      color: "from-pink-500 to-purple-500",
      icon: "✨"
    },
    {
      name: "ASHWAGANDHA",
      benefits: [
        "Reduce el estrés y la ansiedad",
        "Antioxidante y antiinflamatorio",
        "Aumenta energía y resistencia",
        "Mejora función cognitiva",
        "Mejora el sueño"
      ],
      color: "from-green-500 to-emerald-500",
      icon: "🌿"
    },
    {
      name: "CORDYCEPS",
      benefits: [
        "Inmunoregulador",
        "Antiinflamatorio",
        "Acción antioxidante",
        "Mejora función respiratoria",
        "Energizante",
        "Combate la fatiga"
      ],
      color: "from-orange-500 to-red-500",
      icon: "⚡"
    },
    {
      name: "MELENA DE LEÓN",
      benefits: [
        "Neuroprotector y estimulante cognitivo",
        "Protector del sistema digestivo",
        "Previene Alzheimer y demencia",
        "Disminuye la ansiedad",
        "Protege el sistema nervioso"
      ],
      color: "from-amber-500 to-yellow-500",
      icon: "🧠"
    },
    {
      name: "CHAGA",
      benefits: [
        "Inmunoregulador",
        "Hepatoprotector",
        "Antiinflamatorio",
        "Antiviral y antitumoral",
        "Acción antioxidante",
        "Regula el colesterol"
      ],
      color: "from-slate-500 to-gray-500",
      icon: "🛡️"
    },
    {
      name: "ENOKI",
      benefits: [
        "Fortalece el sistema inmunológico",
        "Disminuye colesterol y presión alta",
        "Combate enfermedades hepáticas",
        "Alto contenido en antioxidantes",
        "Favorece la salud intestinal",
        "Disminuye cansancio y estrés"
      ],
      color: "from-blue-500 to-cyan-500",
      icon: "💙"
    },
    {
      name: "MAITAKE",
      benefits: [
        "Mejora la salud cardiovascular",
        "Inmunoregulador",
        "Regula la glucosa",
        "Estimula células benéficas",
        "Reduce lípidos y triglicéridos",
        "Reduce el colesterol",
        "Combate la fatiga"
      ],
      color: "from-indigo-500 to-purple-500",
      icon: "💜"
    },
    {
      name: "REISHI",
      benefits: [
        "Cardioprotector",
        "Relajante muscular",
        "Antiinflamatorio",
        "Antioxidante",
        "Mejora la calidad de sueño",
        "Fortalece el sistema inmune"
      ],
      color: "from-red-500 to-rose-500",
      icon: "❤️"
    },
    {
      name: "COLA DE PAVO",
      benefits: [
        "Antiviral y antibacterial natural",
        "Efectos antitumorales",
        "Apoya la salud digestiva",
        "Disminuye la fatiga crónica",
        "Fortalece el sistema inmune"
      ],
      color: "from-teal-500 to-green-500",
      icon: "🦚"
    }
  ];

  return (
    <div 
      className="min-h-screen text-white font-sans bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.85), rgba(2, 6, 23, 0.85)), url(${bgFungi})`
      }}
    ><SEO 
    title="Hongos Adaptógenos Medicinales de Alta Calidad"
    description="Descubre el poder de los hongos adaptógenos. Reishi, Ashwagandha, Cordyceps, Melena de León. Envíos a todo Argentina. Bienestar natural respaldado por ciencia."
    url="https://alquimystic.com.ar/"
  />
  
  <Navbar isLanding={true} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-6 py-2 rounded-full">
              <Sparkles className="text-indigo-400" size={16} />
              <span className="text-indigo-400 text-xs font-black uppercase tracking-widest">
                Bienestar Natural
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              Descubre el Poder de los
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Hongos Adaptógenos
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Potencia tu salud física y mental con los secretos ancestrales de la naturaleza. 
              Hongos medicinales cultivados con la más alta calidad.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <button
                onClick={() => navigate('/catalogo')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-12 py-5 rounded-2xl font-black text-base uppercase tracking-wider transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
              >
                Explorar Productos
              </button>
              <button
                onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 px-12 py-5 rounded-2xl font-black text-base uppercase tracking-wider transition-all active:scale-95"
              >
                Conocer Más
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section id="benefits" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-4">
              Beneficios <span className="text-indigo-400">Comprobados</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Respaldados por la ciencia y la tradición milenaria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Brain size={32} />,
                title: "Neuroprotección",
                description: "Mejora la función cognitiva y protege el sistema nervioso"
              },
              {
                icon: <Shield size={32} />,
                title: "Sistema Inmune",
                description: "Fortalece las defensas naturales del organismo"
              },
              {
                icon: <Heart size={32} />,
                title: "Salud Cardiovascular",
                description: "Regula colesterol, presión y mejora circulación"
              },
              {
                icon: <Zap size={32} />,
                title: "Energía & Vitalidad",
                description: "Combate la fatiga y aumenta la resistencia física"
              }
            ].map((benefit, i) => (
              <div
                key={i}
                className="group bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div className="text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-black uppercase mb-2">{benefit.title}</h3>
                <p className="text-slate-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-4">
              Nuestros <span className="text-indigo-400">Hongos</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Cada uno con propiedades únicas para tu bienestar
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Product List */}
            <div className="space-y-3">
              {products.map((product, i) => (
                <button
                  key={i}
                  onClick={() => setActiveProduct(i)}
                  className={`w-full text-left p-6 rounded-2xl transition-all ${
                    activeProduct === i
                      ? 'bg-gradient-to-r ' + product.color + ' shadow-2xl scale-105'
                      : 'bg-slate-900/50 border border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{product.icon}</span>
                    <div>
                      <h3 className="text-2xl font-black uppercase">{product.name}</h3>
                      <p className="text-xs opacity-80 font-bold uppercase tracking-wider">
                        {product.benefits.length} beneficios
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Product Details */}
            <div className="sticky top-24 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-6xl">{products[activeProduct].icon}</span>
                <h3 className="text-3xl font-black uppercase">{products[activeProduct].name}</h3>
              </div>
              
              <div className="space-y-3">
                {products[activeProduct].benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <CheckCircle className="text-indigo-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" size={20} />
                    <p className="text-slate-300">{benefit}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/catalogo')}
                className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-4 rounded-2xl font-black uppercase tracking-wider transition-all active:scale-95"
              >
                Ver en Catálogo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-4">
                ¿Por qué <span className="text-indigo-400">Alquimystic?</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Leaf size={40} />,
                  title: "100% Natural",
                  description: "Productos orgánicos de la más alta calidad, sin aditivos ni químicos"
                },
                {
                  icon: <Shield size={40} />,
                  title: "Calidad Garantizada",
                  description: "Procesos de cultivo y fermentación controlados y certificados"
                },
                {
                  icon: <Heart size={40} />,
                  title: "Tradición + Ciencia",
                  description: "Combinamos sabiduría ancestral con investigación moderna"
                }
              ].map((item, i) => (
                <div key={i} className="text-center space-y-4">
                  <div className="inline-flex p-4 bg-indigo-500/10 rounded-2xl text-indigo-400">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-black uppercase">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-black uppercase italic">
            Comienza tu viaje hacia
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Una Vida Más Saludable
            </span>
          </h2>
          <p className="text-xl text-slate-300">
            Descubre el poder transformador de los hongos adaptógenos
          </p>
          <button
            onClick={() => navigate('/catalogo')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-16 py-6 rounded-2xl font-black text-lg uppercase tracking-wider transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
          >
            Explorar Catálogo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <ShoppingBag className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase">Alquimystic</h3>
                <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                  Fermentos & Fungis
                </p>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-bold">
              © 2024 Morton Desarrollos - Dynamo Tech
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;