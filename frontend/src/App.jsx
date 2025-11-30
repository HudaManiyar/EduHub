import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [tasks, setTasks] = useState([]);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [deadline, setDeadline] = useState('');

  // READ (Get Data)
  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8800/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // CREATE (Add Data)
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/tasks", {
        subject,
        topic,
        deadline
      });
      setSubject('');
      setTopic('');
      setDeadline('');
      fetchAllTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE Data
  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:8800/tasks/" + id);
      fetchAllTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // UPDATE Data (Mark as Done)
  const handleToggle = async (id, currentStatus) => {
    try {
      await axios.put("http://localhost:8800/tasks/" + id, {
        completed: !currentStatus
      });
      fetchAllTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen font-sans relative bg-gray-100">

      {/* --- LAYER 1: Background Image --- */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop')`,
        }} 
      />

      {/* --- LAYER 2: Overlay --- */}
      <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px]" />

      {/* --- LAYER 3: Content --- */}
      <div className="relative z-20 max-w-4xl mx-auto p-8">
        
        {/* FIX: Title is now inside a 'Glass Card' so it pops out */}
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg mb-8 border border-white/50 max-w-fit mx-auto">
          <h1 className="text-3xl font-bold text-center text-red-800">
            Student Assignment Board
          </h1>
        </div>

        {/* Input Form */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-lg shadow-lg mb-8 border border-white/50">
          <form onSubmit={handleAdd} className="flex flex-wrap gap-4">
            <input 
              required 
              type="text" 
              placeholder="Subject (e.g. Math)" 
              className="border border-gray-300 p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/90"
              onChange={e => setSubject(e.target.value)} 
              value={subject} 
            />
            
            <input 
              required 
              type="text" 
              placeholder="Topic (e.g. Algebra)" 
              className="border border-gray-300 p-2 rounded flex-[2] focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/90"
              onChange={e => setTopic(e.target.value)} 
              value={topic} 
            />
            
            <input 
              required 
              type="date" 
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/90 cursor-pointer"
              onChange={e => setDeadline(e.target.value)} 
              value={deadline} 
            />
            
            <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 font-bold transition-colors shadow-md">
              Add Task
            </button>
          </form>
        </div>

        {/* List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`p-4 rounded-lg shadow-md flex justify-between items-center border-l-8 backdrop-blur-sm transition-all hover:-translate-y-1 ${
                task.completed 
                  ? 'bg-green-50/90 border-green-500' 
                  : 'bg-white/90 border-amber-400'
              }`}
            >
              
              <div>
                <h3 className={`text-xl font-bold ${task.completed ? 'text-green-800 line-through decoration-2 decoration-green-600' : 'text-gray-800'}`}>
                  {task.subject}
                </h3>
                <p className="text-gray-700 font-medium">{task.topic}</p>
                <p className="text-sm text-gray-500 mt-1 font-semibold">
                  Due: {task.deadline ? task.deadline.split('T')[0] : 'No date'}
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleToggle(task.id, task.completed)}
                  className={`px-4 py-2 rounded text-sm font-bold transition-colors shadow-sm ${
                    task.completed 
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}>
                  {task.completed ? "Undo" : "Done"}
                </button>
                
                <button 
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-bold hover:bg-red-200 transition-colors shadow-sm">
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App