import { motion, AnimatePresence } from 'motion/react';
import { Car, Calendar, Users, DollarSign, Bell, Search, Plus, MoreVertical, CheckCircle2, AlertCircle, Clock, X, Save, Wrench, ShieldCheck, TrendingUp, FileText } from 'lucide-react';
import { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Finance Selection States
  const [selectedMonths, setSelectedMonths] = useState<number[]>([new Date().getMonth()]);

  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [isAddReservationModalOpen, setIsAddReservationModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  
  const [cars, setCars] = useState([
    { id: 1, model: "VW Golf 8", plate: "01-123-AB", service: "15,000 km", nextServiceAt: 50000, registration: "12.05.2026", activeKm: 42300, status: "Aktive", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400" },
    { id: 2, model: "Audi A3", plate: "01-456-CD", service: "12,500 km", nextServiceAt: 32000, registration: "20.08.2026", activeKm: 31200, status: "Aktive", image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80&w=400" },
    { id: 3, model: "Mercedes C-Class", plate: "01-789-EF", service: "8,000 km", nextServiceAt: 16000, registration: "15.03.2026", activeKm: 15400, status: "Në Servis", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400" },
    { id: 4, model: "Skoda Octavia", plate: "01-321-GH", service: "20,000 km", nextServiceAt: 60000, registration: "01.11.2026", activeKm: 58900, status: "Aktive", image: "https://images.unsplash.com/photo-1603811464303-999330953835?auto=format&fit=crop&q=80&w=400" },
    { id: 5, model: "BMW 3 Series", plate: "01-555-ZZ", service: "10,000 km", nextServiceAt: 25000, registration: "10.06.2026", activeKm: 21000, status: "Aktive", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400" },
    { id: 6, model: "VW Polo", plate: "01-999-KS", service: "15,000 km", nextServiceAt: 45000, registration: "13.03.2026", activeKm: 44200, status: "Aktive", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400" },
    { id: 7, model: "Audi Q5", plate: "01-222-QQ", service: "15,000 km", nextServiceAt: 80000, registration: "22.09.2026", activeKm: 79500, status: "Aktive", image: "https://images.unsplash.com/photo-1541348263662-e0c8643c610f?auto=format&fit=crop&q=80&w=400" },
    { id: 8, model: "Toyota Corolla", plate: "01-333-TT", service: "15,000 km", nextServiceAt: 40000, registration: "05.05.2026", activeKm: 35000, status: "Aktive", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=400" },
    { id: 9, model: "Hyundai Tucson", plate: "01-444-HH", service: "15,000 km", nextServiceAt: 55000, registration: "18.12.2026", activeKm: 48000, status: "Aktive", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=400" },
    { id: 10, model: "Dacia Duster", plate: "01-000-DD", service: "10,000 km", nextServiceAt: 30000, registration: "30.01.2027", activeKm: 25000, status: "Aktive", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400" }
  ]);

  const [reservations, setReservations] = useState([
    { id: 1, car: "VW Golf 8", plate: "01-123-AB", client: "Mërgim D.", phone: "+383 44 123 456", time: "2026-03-10", price: 45, status: "Në pritje", statusColor: "bg-orange-100 text-orange-700" },
    { id: 2, car: "Audi A3", plate: "01-456-CD", client: "Arben K.", phone: "+41 79 123 45 67", time: "2026-03-12", price: 50, status: "Në pritje", statusColor: "bg-orange-100 text-orange-700" },
    { id: 3, car: "Mercedes C-Class", plate: "01-789-EF", client: "Liridon M.", phone: "+49 152 1234567", time: "2026-03-09", price: 80, status: "E Kthyer", statusColor: "bg-emerald-100 text-emerald-700" },
    { id: 4, car: "Skoda Octavia", plate: "01-321-GH", client: "Blerim S.", phone: "+383 49 987 654", time: "2026-03-15", price: 40, status: "Aktive", statusColor: "bg-blue-100 text-blue-700" },
    { id: 5, car: "BMW 3 Series", plate: "01-555-ZZ", client: "Agon P.", phone: "+383 44 111 222", time: "2026-02-28", price: 60, status: "E Kthyer", statusColor: "bg-emerald-100 text-emerald-700" }
  ]);

  const [newCar, setNewCar] = useState({
    model: '',
    plate: '',
    service: '',
    registration: '',
    activeKm: '',
    nextServiceAt: '',
    image: ''
  });

  const [newReservation, setNewReservation] = useState({
    carId: '',
    client: '',
    phone: '',
    time: '',
    price: '',
    status: 'Në pritje'
  });

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    const carToAdd = {
      id: cars.length + 1,
      ...newCar,
      activeKm: Number(newCar.activeKm),
      nextServiceAt: Number(newCar.nextServiceAt),
      status: 'Aktive'
    };
    setCars([...cars, carToAdd]);
    setIsAddCarModalOpen(false);
    setNewCar({ model: '', plate: '', service: '', registration: '', activeKm: '', nextServiceAt: '', image: '' });
  };

  const handleUpdateCar = (e: React.FormEvent) => {
    e.preventDefault();
    setCars(cars.map(c => c.id === editingCar.id ? editingCar : c));
    setEditingCar(null);
  };

  const handleAddReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCar = cars.find(c => c.id === Number(newReservation.carId));
    const reservationToAdd = {
      id: reservations.length + 1,
      car: selectedCar?.model || 'E panjohur',
      plate: selectedCar?.plate || '',
      client: newReservation.client,
      phone: newReservation.phone,
      time: newReservation.time,
      price: Number(newReservation.price),
      status: newReservation.status,
      statusColor: newReservation.status === 'Aktive' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
    };
    setReservations([reservationToAdd, ...reservations]);
    setIsAddReservationModalOpen(false);
    setNewReservation({ carId: '', client: '', phone: '', time: '', price: '', status: 'Në pritje' });
  };

  const generatePDF = (reservation: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text("AUTORENT OS", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("AUTORIZIM PËR DREJTIMIN E AUTOMJETIT", 105, 35, { align: "center" });
    
    // Divider
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(20, 45, 190, 45);
    
    // Content
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105); // slate-600
    
    const today = new Date().toLocaleDateString('sq-AL');
    
    let yPos = 60;
    const lineHeight = 10;
    
    doc.setFont("helvetica", "bold");
    doc.text("TË DHËNAT E KLIENTIT:", 20, yPos);
    yPos += lineHeight;
    doc.setFont("helvetica", "normal");
    doc.text(`Emri dhe Mbiemri: ${reservation.client}`, 25, yPos);
    yPos += lineHeight;
    doc.text(`Telefoni: ${reservation.phone}`, 25, yPos);
    
    yPos += lineHeight * 2;
    
    doc.setFont("helvetica", "bold");
    doc.text("TË DHËNAT E AUTOMJETIT:", 20, yPos);
    yPos += lineHeight;
    doc.setFont("helvetica", "normal");
    doc.text(`Modeli: ${reservation.car}`, 25, yPos);
    yPos += lineHeight;
    doc.text(`Targat: ${reservation.plate}`, 25, yPos);
    
    yPos += lineHeight * 2;
    
    doc.setFont("helvetica", "bold");
    doc.text("BAZA LIGJORE:", 20, yPos);
    yPos += lineHeight;
    doc.setFont("helvetica", "normal");
    const legalText = "Mbështetur në Nenin 123 të Ligjit për Rregullat e Trafikut Rrugor, kompania 'AutoRent OS' autorizon personin e lartpërmendur për drejtimin e automjetit të specifikuar në këtë dokument.";
    const splitText = doc.splitTextToSize(legalText, 170);
    doc.text(splitText, 20, yPos);
    
    yPos += lineHeight * 4;
    
    doc.text(`Data e lëshimit: ${today}`, 20, yPos);
    doc.text(`Koha e kthimit: ${reservation.time}`, 120, yPos);
    
    yPos += lineHeight * 4;
    
    // Signatures
    doc.line(20, yPos, 80, yPos);
    doc.line(130, yPos, 190, yPos);
    yPos += 5;
    doc.setFontSize(10);
    doc.text("Nënshkrimi i Kompanisë", 30, yPos);
    doc.text("Nënshkrimi i Klientit", 145, yPos);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("Ky dokument është gjeneruar automatikisht nga AutoRent OS.", 105, 280, { align: "center" });
    
    doc.save(`Autorizim_${reservation.client.replace(/\s+/g, '_')}.pdf`);
  };

  const generateFinancePDF = (filteredReservations: any[], total: number) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("RAPORTI FINANCIAR - AUTORENT OS", 105, 20, { align: "center" });
    
    const monthNames = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];
    const selectedMonthNames = selectedMonths.sort((a, b) => a - b).map(m => monthNames[m]).join(", ");
    
    doc.setFontSize(12);
    doc.text(`Periudha: ${selectedMonthNames} ${selectedYear}`, 105, 30, { align: "center" });
    
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 40, 190, 40);
    
    let yPos = 55;
    doc.setFont("helvetica", "bold");
    doc.text("Vetura", 20, yPos);
    doc.text("Klienti", 70, yPos);
    doc.text("Data", 130, yPos);
    doc.text("Shuma", 170, yPos);
    
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    filteredReservations.forEach(r => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(r.car, 20, yPos);
      doc.text(r.client, 70, yPos);
      doc.text(r.time, 130, yPos);
      doc.text(`${r.price}€`, 170, yPos);
      yPos += 10;
    });
    
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTALI: ${total}€`, 170, yPos, { align: "right" });
    
    doc.save(`Raporti_Financiar_${selectedYear}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">AutoRent<span className="text-blue-400">OS</span></span>
        </div>
        
        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Menuja Kryesore</div>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('kalendari')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'kalendari' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Calendar className="w-5 h-5" /> Kalendari
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Clock className="w-5 h-5" /> Rezervimet
            </button>
            <button 
              onClick={() => setActiveTab('flota')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'flota' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Car className="w-5 h-5" /> Flota (Veturat)
            </button>
            <button 
              onClick={() => setActiveTab('klientet')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'klientet' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Users className="w-5 h-5" /> Klientët
            </button>
            <button 
              onClick={() => setActiveTab('financat')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'financat' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <DollarSign className="w-5 h-5" /> Financat
            </button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">
              AR
            </div>
            <div>
              <p className="text-sm font-medium">Auto Rent Prishtina</p>
              <p className="text-xs text-slate-400">Plani Pro</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-bold text-slate-800">
            {activeTab === 'flota' ? 'Menaxhimi i Flotës' : 
             activeTab === 'kalendari' ? 'Kalendari i Kthimeve' :
             activeTab === 'financat' ? 'Pasqyra Financiare' :
             'Pasqyra e Sotme'}
          </h1>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Kërko..." 
                className="pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none w-64 transition-all"
              />
            </div>
            <button className="relative text-slate-500 hover:text-slate-700">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            {activeTab === 'flota' ? (
              <button 
                onClick={() => setIsAddCarModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Shto Veturë
              </button>
            ) : (
              <button 
                onClick={() => setIsAddReservationModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Rezervim i Ri
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'flota' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cars.map((car) => {
                  const kmLeft = car.nextServiceAt - car.activeKm;
                  const isServiceDue = kmLeft <= 1000;
                  const isOverdue = kmLeft <= 0;

                  return (
                    <motion.div 
                      key={car.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`bg-white rounded-2xl border ${isOverdue ? 'border-red-200 ring-2 ring-red-100' : isServiceDue ? 'border-orange-200 ring-2 ring-orange-100' : 'border-slate-200'} shadow-sm overflow-hidden group`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={car.image || "https://picsum.photos/seed/car/400/250"} 
                          alt={car.model}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${car.status === 'Aktive' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
                            {car.status}
                          </span>
                          {isOverdue && (
                            <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase animate-pulse shadow-sm">Servisi!</span>
                          )}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{car.model}</h3>
                        <p className="text-sm font-mono text-slate-500 mb-4">{car.plate}</p>
                        
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" /> KM Aktive:
                            </span>
                            <span className="font-bold text-blue-600">{car.activeKm.toLocaleString()} km</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 flex items-center gap-2">
                              <Wrench className="w-4 h-4" /> Servisi i radhës:
                            </span>
                            <div className="text-right">
                              <p className={`font-bold ${isOverdue ? 'text-red-600' : isServiceDue ? 'text-orange-600' : 'text-slate-700'}`}>
                                {car.nextServiceAt.toLocaleString()} km
                              </p>
                              <p className={`text-[10px] font-medium ${isOverdue ? 'text-red-500' : isServiceDue ? 'text-orange-500' : 'text-slate-400'}`}>
                                {isOverdue ? `Tejkalim: ${Math.abs(kmLeft).toLocaleString()} km` : `Edhe: ${kmLeft.toLocaleString()} km`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4" /> Regjistrimi:
                            </span>
                            <span className="font-medium text-slate-700">{car.registration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between">
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Detajet</button>
                        <button 
                          onClick={() => setEditingCar(car)}
                          className="text-xs font-bold text-slate-400 hover:text-slate-600"
                        >
                          Edito
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : activeTab === 'kalendari' ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-800">Kthimet e Automjeteve</h2>
                <div className="flex gap-2">
                  <select 
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  >
                    {["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"].map((m, i) => (
                      <option key={i} value={i}>{m}</option>
                    ))}
                  </select>
                  <select 
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    {[2024, 2025, 2026, 2027].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
                {["Hën", "Mar", "Mër", "Enj", "Pre", "Sht", "Die"].map(d => (
                  <div key={d} className="bg-slate-50 p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{d}</div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i - 3; // Offset for demo
                  const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const dayReservations = reservations.filter(r => r.time === dateStr);
                  
                  return (
                    <div key={i} className="bg-white min-h-[120px] p-2 hover:bg-slate-50 transition-colors">
                      <span className={`text-sm font-medium ${day > 0 && day <= 31 ? 'text-slate-700' : 'text-slate-300'}`}>
                        {day > 0 && day <= 31 ? day : ''}
                      </span>
                      <div className="mt-2 space-y-1">
                        {dayReservations.map(r => (
                          <div key={r.id} className="text-[10px] p-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-bold truncate">
                            {r.car} - {r.client}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeTab === 'financat' ? (
            <div className="space-y-8">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-800">Pasqyra Financiare</h2>
                  <div className="flex gap-4 items-center">
                    <select 
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none shadow-sm"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                      {[2024, 2025, 2026, 2027].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => {
                        const filtered = reservations.filter(r => {
                          const rDate = new Date(r.time);
                          return selectedMonths.includes(rDate.getMonth()) && rDate.getFullYear() === selectedYear;
                        });
                        const total = filtered.reduce((acc, curr) => acc + curr.price, 0);
                        generateFinancePDF(filtered, total);
                      }}
                      className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <FileText className="w-4 h-4" /> PDF
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                  {["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Kor", "Gus", "Sht", "Tet", "Nën", "Dhj"].map((m, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (selectedMonths.includes(i)) {
                          setSelectedMonths(selectedMonths.filter(month => month !== i));
                        } else {
                          setSelectedMonths([...selectedMonths, i]);
                        }
                      }}
                      className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border-2 ${selectedMonths.includes(i) ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div className="bg-emerald-50 text-emerald-700 px-6 py-5 rounded-3xl border border-emerald-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-200">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase opacity-70">Fitimi i Përgjithshëm</p>
                      <p className="text-3xl font-black">
                        {reservations
                          .filter(r => {
                            const rDate = new Date(r.time);
                            return selectedMonths.includes(rDate.getMonth()) && rDate.getFullYear() === selectedYear;
                          })
                          .reduce((acc, curr) => acc + curr.price, 0)
                          .toLocaleString()}€
                      </p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-emerald-600 uppercase">Periudha e zgjedhur</p>
                    <p className="text-sm font-medium text-emerald-800">
                      {selectedMonths.length} muaj të selektuar
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Transaksionet në këtë periudhë</h3>
                  <div className="space-y-4">
                    {reservations
                      .filter(r => {
                        const rDate = new Date(r.time);
                        return selectedMonths.includes(rDate.getMonth()) && rDate.getFullYear() === selectedYear;
                      })
                      .map(r => (
                        <div key={r.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-4">
                            <div className="bg-white p-2.5 rounded-xl shadow-sm">
                              <Car className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{r.car}</p>
                              <p className="text-xs text-slate-500">{r.client} • {r.time}</p>
                            </div>
                          </div>
                          <p className="font-black text-emerald-600">+{r.price}€</p>
                        </div>
                      ))}
                    {reservations.filter(r => {
                      const rDate = new Date(r.time);
                      return selectedMonths.includes(rDate.getMonth()) && rDate.getFullYear() === selectedYear;
                    }).length === 0 && (
                      <div className="text-center py-8 text-slate-400 italic">Nuk ka transaksione për muajt e zgjedhur.</div>
                    )}
                  </div>
                </div>
                
                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-2">Statistikat e Qarkullimit</h3>
                    <p className="text-slate-400 text-sm mb-8">Pasqyra e performancës për periudhën e zgjedhur.</p>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Rezervime të përfunduara</span>
                          <span className="font-bold">12</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[75%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Mesatarja për rezervim</span>
                          <span className="font-bold">54€</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[60%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          ) : (
            /* Original Dashboard Content */
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: "Vetura të Lëshuara", value: "24", total: "/ 30", trend: "+2 nga dje", color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Kthehen Sot", value: "5", total: "vetura", trend: "3 paradite, 2 pasdite", color: "text-orange-600", bg: "bg-orange-50" },
                  { label: "Të Ardhura (Sot)", value: "450€", total: "", trend: "+15% nga java e kaluar", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Sinjalizime", value: "2", total: "servise", trend: "Skadime regjistrimi", color: "text-red-600", bg: "bg-red-50" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                  >
                    <p className="text-sm font-medium text-slate-500 mb-2">{stat.label}</p>
                    <div className="flex items-baseline gap-2 mb-2">
                      <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                      <span className="text-sm font-medium text-slate-400">{stat.total}</span>
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${stat.bg} ${stat.color}`}>
                      {stat.trend}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Active Rentals Table */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Veturat që kthehen së shpejti</h2>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Shiko të gjitha</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                          <th className="px-6 py-4 font-medium">Vetura</th>
                          <th className="px-6 py-4 font-medium">Klienti</th>
                          <th className="px-6 py-4 font-medium">Kthimi</th>
                          <th className="px-6 py-4 font-medium">Statusi</th>
                          <th className="px-6 py-4 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {reservations.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-800">{row.car}</p>
                              <p className="text-xs text-slate-500">{row.plate}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-slate-800">{row.client}</p>
                              <p className="text-xs text-slate-500">{row.phone}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                <Clock className="w-4 h-4 text-slate-400" /> {row.time}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.statusColor}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => generatePDF(row)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors title='Gjenero Autorizimin'"
                                >
                                  <FileText className="w-5 h-5" />
                                </button>
                                <button className="text-slate-400 hover:text-slate-600">
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Quick Actions & Alerts */}
                <div className="space-y-8">
                  {/* Alerts */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                  >
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500" /> Vëmendje
                    </h2>
                    <div className="space-y-4">
                      <div className="flex gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                        <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-red-900">Skadon Regjistrimi</p>
                          <p className="text-xs text-red-700 mt-0.5">VW Polo (01-999-KS) i skadon regjistrimi pas 3 ditësh.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="w-2 h-2 mt-2 rounded-full bg-orange-500 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-orange-900">Servisimi i rregullt</p>
                          <p className="text-xs text-orange-700 mt-0.5">Audi Q5 ka arritur 15,000km që nga servisi i fundit.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Car Modal */}
      <AnimatePresence>
        {isAddCarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddCarModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Shto Veturë të Re</h2>
                  <button 
                    onClick={() => setIsAddCarModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleAddCar} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Modeli i Veturës</label>
                      <input 
                        required
                        type="text" 
                        placeholder="p.sh. VW Golf 8"
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={newCar.model}
                        onChange={(e) => setNewCar({...newCar, model: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Tablat</label>
                      <input 
                        required
                        type="text" 
                        placeholder="01-123-AB"
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                        value={newCar.plate}
                        onChange={(e) => setNewCar({...newCar, plate: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">KM Aktive</label>
                      <input 
                        required
                        type="number" 
                        placeholder="p.sh. 42000"
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={newCar.activeKm}
                        onChange={(e) => setNewCar({...newCar, activeKm: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Servisi i radhës (KM)</label>
                      <input 
                        required
                        type="number" 
                        placeholder="p.sh. 50000"
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={newCar.nextServiceAt}
                        onChange={(e) => setNewCar({...newCar, nextServiceAt: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">URL e Fotos</label>
                      <input 
                        type="text" 
                        placeholder="p.sh. https://images.unsplash.com/..."
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={newCar.image}
                        onChange={(e) => setNewCar({...newCar, image: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsAddCarModalOpen(false)}
                      className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Anulo
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" /> Ruaj Veturën
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Car Modal */}
      <AnimatePresence>
        {editingCar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCar(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Edito Veturën</h2>
                  <button 
                    onClick={() => setEditingCar(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleUpdateCar} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Modeli i Veturës</label>
                      <input 
                        required
                        type="text" 
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={editingCar.model}
                        onChange={(e) => setEditingCar({...editingCar, model: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">URL e Fotos</label>
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={editingCar.image}
                        onChange={(e) => setEditingCar({...editingCar, image: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setEditingCar(null)}
                      className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Anulo
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" /> Ruaj Ndryshimet
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Reservation Modal */}
      <AnimatePresence>
        {isAddReservationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddReservationModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Rezervim i Ri</h2>
                  <button 
                    onClick={() => setIsAddReservationModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleAddReservation} className="space-y-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Zgjidh Veturën (Kliko mbi foto)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200">
                      {cars.map(car => (
                        <div 
                          key={car.id}
                          onClick={() => setNewReservation({...newReservation, carId: String(car.id)})}
                          className={`relative cursor-pointer rounded-xl border-2 transition-all overflow-hidden group ${newReservation.carId === String(car.id) ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-100 hover:border-slate-300'}`}
                        >
                          <div className="h-24 overflow-hidden">
                            <img 
                              src={car.image || "https://picsum.photos/seed/car/200/150"} 
                              alt={car.model}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="p-2 bg-white">
                            <p className="text-[10px] font-bold text-slate-800 truncate">{car.model}</p>
                            <p className="text-[8px] font-mono text-slate-500">{car.plate}</p>
                          </div>
                          {newReservation.carId === String(car.id) && (
                            <div className="absolute top-1 right-1 bg-blue-600 text-white p-1 rounded-full shadow-lg">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Emri i Klientit</label>
                      <input 
                        required
                        type="text" 
                        placeholder="p.sh. Filan Fisteku"
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={newReservation.client}
                        onChange={(e) => setNewReservation({...newReservation, client: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Telefoni</label>
                      <input 
                        required
                        type="text" 
                        placeholder="+383 44 123 456"
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={newReservation.phone}
                        onChange={(e) => setNewReservation({...newReservation, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Çmimi (€)</label>
                      <input 
                        required
                        type="number" 
                        placeholder="p.sh. 45"
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={newReservation.price}
                        onChange={(e) => setNewReservation({...newReservation, price: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Data e Kthimit</label>
                      <input 
                        required
                        type="date" 
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={newReservation.time}
                        onChange={(e) => setNewReservation({...newReservation, time: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsAddReservationModalOpen(false)}
                      className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Anulo
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" /> Ruaj Rezervimin
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
