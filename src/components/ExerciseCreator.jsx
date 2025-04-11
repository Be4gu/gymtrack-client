import { useState } from 'react';

const ExerciseCreator = ({ muscleGroups, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [muscleGroupId, setMuscleGroupId] = useState(muscleGroups[0]?.id || '');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación
    if (!name.trim()) {
      setError('El nombre del ejercicio es obligatorio');
      return;
    }
    
    if (!muscleGroupId) {
      setError('Debes seleccionar un grupo muscular');
      return;
    }
    
    // Crear objeto de ejercicio
    const newExercise = {
      name: name.trim(),
      muscleGroupId: Number(muscleGroupId),
      isPublic
    };
    
    // Enviar al componente padre
    onSave(newExercise);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-gray-800 border-l-4 border-red-500 text-sm text-red-400">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm uppercase tracking-wider mb-2 text-textSecondary">
          Nombre del ejercicio
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          placeholder="Ej: Press banca inclinado"
        />
      </div>
      
      <div>
        <label className="block text-sm uppercase tracking-wider mb-2 text-textSecondary">
          Grupo muscular
        </label>
        <select
          value={muscleGroupId}
          onChange={(e) => setMuscleGroupId(e.target.value)}
          className="input-field"
        >
          {muscleGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="w-4 h-4 accent-primary bg-gray-800 border-gray-700"
        />
        <label htmlFor="isPublic" className="text-sm text-textSecondary">
          Hacer público (visible para otros usuarios)
        </label>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          Guardar ejercicio
        </button>
      </div>
    </form>
  );
};

export default ExerciseCreator;
