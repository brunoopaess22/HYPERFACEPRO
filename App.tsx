
import React, { useState } from 'react';
import { AppView, PhotoStyle, BackgroundStyle, OutfitStyle, HairColor, HairStyle, GeneratedPhoto, ClothingColor, PoseStyle } from './types';
import Layout from './components/Layout';
import Button from './components/Button';
import { Upload as UploadIcon, Check, Download, RefreshCw, AlertCircle, Trash2, Sparkles, Shirt, Scissors, Camera, MapPin, Move, Repeat, Zap, Palette, User } from 'lucide-react';
import { generateProfessionalHeadshot } from './services/geminiService';

// ----- COMPONENTS (Inlined for Single File Simplicity in this Context) -----

const Card: React.FC<{children: React.ReactNode; className?: string; onClick?: () => void; selected?: boolean}> = ({ children, className = '', onClick, selected }) => (
  <div 
    onClick={onClick}
    className={`rounded-2xl p-6 transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${selected ? 'bg-hyper-card border-hyper-blue shadow-[0_0_20px_rgba(0,240,255,0.15)] border' : 'bg-hyper-card/50 border border-gray-800 hover:border-gray-700 hover:bg-hyper-card'} ${className}`}
  >
    {children}
  </div>
);

// ----- VIEWS -----

const WelcomeView: React.FC<{onStart: () => void}> = ({ onStart }) => (
  <div className="flex-1 flex flex-col justify-center items-center p-8 text-center animate-in fade-in zoom-in-95 duration-700">
    <div className="relative w-32 h-32 mb-10 group">
      <div className="absolute inset-0 bg-gradient-to-r from-hyper-blue to-hyper-purple rounded-full blur-xl opacity-50 group-hover:opacity-80 transition duration-1000"></div>
      <div className="relative w-full h-full bg-black rounded-full flex items-center justify-center border border-gray-800 shadow-2xl">
        <Zap className="w-16 h-16 text-white" />
      </div>
    </div>
    <div className="mb-8">
        <h1 className="font-heading font-extrabold text-4xl md:text-6xl text-white mb-2 tracking-tight">
          HYPERFACE <span className="text-transparent bg-clip-text bg-gradient-to-r from-hyper-blue to-hyper-purple">PRO</span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.3em] text-gray-500 uppercase">
          <span>Engine V12.0 Official</span>
          <span className="w-1 h-1 bg-hyper-blue rounded-full"></span>
          <span>16K Ready</span>
        </div>
    </div>
    <Button onClick={onStart} fullWidth className="h-14 text-sm shadow-2xl max-w-xs mx-auto">
      <Sparkles className="w-4 h-4" /> ACESSAR SISTEMA
    </Button>
  </div>
);

const UploadView: React.FC<{onImageSelect: (img: string) => void}> = ({ onImageSelect }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) return alert("Imagem muito grande. Limite 50MB.");
      const reader = new FileReader();
      reader.onloadend = () => onImageSelect(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="flex-1 flex flex-col p-6 animate-in slide-in-from-right-8 duration-500">
      <h2 className="font-heading font-bold text-3xl mb-2 text-white">Upload</h2>
      <p className="text-gray-400 mb-8">Suporta 1 a 10 pessoas. 16K Nativo.</p>
      <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-3xl bg-hyper-card/30 hover:bg-hyper-card hover:border-hyper-blue/50 transition-all cursor-pointer group min-h-[350px] relative overflow-hidden">
        <div className="bg-black border border-gray-800 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform z-10 shadow-lg">
          <UploadIcon className="w-10 h-10 text-hyper-blue" />
        </div>
        <p className="font-bold text-xl text-white z-10">Toque para enviar</p>
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
};

const CustomizeView: React.FC<{
  image: string; 
  onBack: () => void;
  onGenerate: (pStyle: PhotoStyle, bStyle: BackgroundStyle, outfit: OutfitStyle, cColor: ClothingColor, hColor: HairColor, hStyle: HairStyle, pose: PoseStyle) => void;
}> = ({ image, onBack, onGenerate }) => {
  
  const [photoStyle, setPhotoStyle] = useState<PhotoStyle>(PhotoStyle.HYPERFACE_ULTRA_2_0);
  const [bgStyle, setBgStyle] = useState<BackgroundStyle>(BackgroundStyle.AUTO_PREMIUM);
  const [outfit, setOutfit] = useState<OutfitStyle>(OutfitStyle.AUTO_PREMIUM);
  const [clothingColor, setClothingColor] = useState<ClothingColor>(ClothingColor.DEFAULT);
  const [hairColor, setHairColor] = useState<HairColor>(HairColor.KEEP_ORIGINAL);
  const [hairStyle, setHairStyle] = useState<HairStyle>(HairStyle.KEEP_ORIGINAL);
  const [poseStyle, setPoseStyle] = useState<PoseStyle>(PoseStyle.AUTO_POSE);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 animate-in slide-in-from-right-8 duration-500">
      <div className="flex gap-4 mb-6 items-center">
        <img src={image} alt="Preview" className="w-16 h-16 object-cover rounded-xl shadow-lg border border-gray-700" />
        <div>
          <h2 className="font-heading font-bold text-xl text-white">Configuração</h2>
          <button onClick={onBack} className="text-hyper-blue text-xs font-bold hover:underline uppercase">Trocar Foto</button>
        </div>
      </div>

      <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 pb-4 custom-scrollbar">
        <div className="bg-hyper-card p-4 rounded-2xl border border-gray-800">
          <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2 uppercase tracking-wider"><Move className="w-4 h-4 text-hyper-blue"/> Pose (Obrigatório)</h3>
          <select value={poseStyle} onChange={(e) => setPoseStyle(e.target.value as PoseStyle)} className="w-full p-3 rounded-xl bg-black border border-gray-800 text-sm text-white outline-none focus:border-hyper-blue">
            {Object.values(PoseStyle).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="bg-hyper-card p-4 rounded-2xl border border-gray-800">
          <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2 uppercase tracking-wider"><MapPin className="w-4 h-4 text-green-400"/> Cenário</h3>
          <select value={bgStyle} onChange={(e) => setBgStyle(e.target.value as BackgroundStyle)} className="w-full p-3 rounded-xl bg-black border border-gray-800 text-sm text-white outline-none focus:border-hyper-blue">
            {Object.values(BackgroundStyle).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="bg-hyper-card p-4 rounded-2xl border border-gray-800">
          <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2 uppercase tracking-wider"><Shirt className="w-4 h-4 text-hyper-purple"/> Roupa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select value={outfit} onChange={(e) => setOutfit(e.target.value as OutfitStyle)} className="w-full p-3 rounded-xl bg-black border border-gray-800 text-sm text-white outline-none focus:border-hyper-purple">
              {Object.values(OutfitStyle).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={clothingColor} onChange={(e) => setClothingColor(e.target.value as ClothingColor)} className="w-full p-3 rounded-xl bg-black border border-gray-800 text-sm text-white outline-none focus:border-hyper-purple">
              {Object.values(ClothingColor).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        
        {/* Advanced Options Hidden/Compact */}
        <div className="bg-hyper-card p-4 rounded-2xl border border-gray-800">
           <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2 uppercase tracking-wider"><Camera className="w-4 h-4 text-white"/> Estilo & Cabelo</h3>
           <div className="grid grid-cols-1 gap-3">
             <select value={photoStyle} onChange={(e) => setPhotoStyle(e.target.value as PhotoStyle)} className="w-full p-3 rounded-xl bg-black border border-gray-800 text-sm text-white outline-none">
               {Object.values(PhotoStyle).map(s => <option key={s} value={s}>{s}</option>)}
             </select>
             <div className="grid grid-cols-2 gap-2">
               <select value={hairColor} onChange={(e) => setHairColor(e.target.value as HairColor)} className="w-full p-2 rounded-lg bg-black border border-gray-800 text-xs text-white outline-none">
                 {Object.values(HairColor).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
               <select value={hairStyle} onChange={(e) => setHairStyle(e.target.value as HairStyle)} className="w-full p-2 rounded-lg bg-black border border-gray-800 text-xs text-white outline-none">
                 {Object.values(HairStyle).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
             </div>
           </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Button fullWidth onClick={() => onGenerate(photoStyle, bgStyle, outfit, clothingColor, hairColor, hairStyle, poseStyle)} className="shadow-2xl py-4 text-sm">
          <Sparkles className="w-4 h-4" /> RENDERIZAR
        </Button>
      </div>
    </div>
  );
};

const ProcessingView: React.FC = () => (
  <div className="flex-1 flex flex-col justify-center items-center p-8 text-center">
    <div className="relative w-32 h-32 mb-12">
       <div className="absolute inset-0 border-2 border-gray-800 rounded-full"></div>
       <div className="absolute inset-0 border-2 border-hyper-blue rounded-full border-t-transparent animate-spin"></div>
       <div className="absolute inset-0 border-2 border-hyper-purple rounded-full border-b-transparent animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
       <div className="absolute inset-0 flex items-center justify-center">
         <div className="bg-white p-3 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)] animate-pulse">
            <Sparkles className="w-6 h-6 text-black" />
         </div>
       </div>
    </div>
    <h2 className="font-heading font-bold text-2xl text-white mb-2 animate-pulse">CRIANDO REALIDADE...</h2>
    <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">Pode levar até 60s</p>
  </div>
);

const ResultView: React.FC<{
  resultImage: string; 
  onRetake: () => void;
  onReuseImage: () => void;
}> = ({ resultImage, onRetake, onReuseImage }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `HYPERFACE_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="flex-1 flex flex-col p-6 animate-in zoom-in-95 duration-500">
      <div className="relative bg-black p-1 rounded-3xl shadow-2xl mb-6 border border-gray-800 group overflow-hidden">
        <img src={resultImage} alt="Result" className="w-full rounded-3xl aspect-square object-cover" />
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur px-3 py-1 rounded-full border border-gray-700 text-[10px] font-bold text-white">16K READY</div>
      </div>
      <div className="space-y-3 mt-auto">
        <Button variant="primary" fullWidth onClick={handleDownload} className="h-14 text-sm shadow-lg shadow-hyper-blue/20">
          <Download className="w-4 h-4" /> BAIXAR
        </Button>
        <Button variant="secondary" fullWidth onClick={onReuseImage} className="text-hyper-blue border-hyper-blue/30">
          <Repeat className="w-4 h-4" /> USAR MESMA FOTO
        </Button>
        <Button variant="outline" fullWidth onClick={onRetake} className="text-gray-500">
          <RefreshCw className="w-4 h-4" /> NOVA FOTO
        </Button>
      </div>
    </div>
  );
};

// ----- MAIN APP CONTROLLER -----

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.WELCOME);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (pStyle: PhotoStyle, bStyle: BackgroundStyle, outfit: OutfitStyle, cColor: ClothingColor, hColor: HairColor, hStyle: HairStyle, pose: PoseStyle) => {
    if (!uploadedImage) return;
    setView(AppView.PROCESSING);
    setError(null);
    try {
      const generatedUrl = await generateProfessionalHeadshot(uploadedImage, pStyle, bStyle, outfit, cColor, hColor, hStyle, pose, true);
      setResultImage(generatedUrl);
      setHistory(prev => [{id: Date.now().toString(), originalUrl: uploadedImage, resultUrl: generatedUrl, date: new Date().toISOString(), style: pStyle}, ...prev]);
      setView(AppView.RESULT);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro desconhecido.");
      setView(AppView.CUSTOMIZE);
    }
  };

  return (
    <Layout currentView={view} onNavigate={setView} isLoggedIn={true} onLogout={() => setView(AppView.WELCOME)}>
      {error && (
        <div className="m-6 mb-0 p-4 bg-red-900/20 border border-red-900/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}
      {view === AppView.WELCOME && <WelcomeView onStart={() => setView(AppView.UPLOAD)} />}
      {view === AppView.UPLOAD && <UploadView onImageSelect={(img) => { setUploadedImage(img); setView(AppView.CUSTOMIZE); }} />}
      {view === AppView.CUSTOMIZE && uploadedImage && <CustomizeView image={uploadedImage} onBack={() => setView(AppView.UPLOAD)} onGenerate={handleGenerate} />}
      {view === AppView.PROCESSING && <ProcessingView />}
      {view === AppView.RESULT && resultImage && <ResultView resultImage={resultImage} onRetake={() => setView(AppView.UPLOAD)} onReuseImage={() => setView(AppView.CUSTOMIZE)} />}
      {view === AppView.PROFILE && (
        <div className="p-6 flex flex-col h-full">
          <h2 className="font-heading font-bold text-2xl mb-4">Galeria</h2>
          <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            {history.map(photo => (
              <Card key={photo.id} className="flex gap-4 items-center p-3 bg-hyper-card border-gray-800">
                <img src={photo.resultUrl} alt="Thumb" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1"><div className="text-xs text-gray-400">{new Date(photo.date).toLocaleTimeString()}</div></div>
                <button onClick={() => setHistory(h => h.filter(i => i.id !== photo.id))} className="p-2 text-red-500"><Trash2 className="w-4 h-4"/></button>
              </Card>
            ))}
            {history.length === 0 && <p className="text-gray-500 text-center mt-10">Sem histórico.</p>}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
