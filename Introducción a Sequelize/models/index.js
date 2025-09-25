import Autor from "./Autor.js";
import Editorial from "./Editorial.js";
import Libro from "./Libro.js";

// Relaciones
Autor.hasMany(Libro, { foreignKey: "autorId", as: "libros" });
Libro.belongsTo(Autor, { foreignKey: "autorId", as: "autor" });

Editorial.hasMany(Libro, { foreignKey: "editorialId", as: "libros" });
Libro.belongsTo(Editorial, { foreignKey: "editorialId", as: "editorial" });

export { Autor, Editorial, Libro };
