export interface Persona {
  id: string;
  nombre: string;
  rut: string;
  fechaNacimiento: string; // ISO 'YYYY-MM-DD'
  ciudad: string;
  gustos: string[];
}
