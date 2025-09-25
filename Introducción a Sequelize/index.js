import sequelize from "./config/config.js";
import { Autor, Editorial, Libro } from "./models/index.js";

(async () => {
  try {
    // Sincronizar tablas (desarrollo)
    await sequelize.sync({ force: true });
    console.log("Tablas creadas desde cero.");

    // Crear autores
    const autor1 = await Autor.create({ nombre: "Gabriel García Márquez", biografia: "Escritor colombiano" });
    const autor2 = await Autor.create({ nombre: "Isabel Allende" });

    // Crear editoriales
    const editorial1 = await Editorial.create({ nombre: "Sudamericana" });
    const editorial2 = await Editorial.create({ nombre: "Penguin Random House" });

    // Crear libros
    const libro1 = await Libro.create({ titulo: "Cien Años de Soledad", autorId: autor1.id, editorialId: editorial1.id });
    const libro2 = await Libro.create({ titulo: "La Casa de los Espíritus", autorId: autor2.id, editorialId: editorial2.id });

    console.log("Datos iniciales insertados.");

    // Consultar libros con relaciones
    const libros = await Libro.findAll({
      include: [
        { model: Autor, as: "autor" },
        { model: Editorial, as: "editorial" }
      ]
    });

    libros.forEach(l => {
      console.log(`Libro: ${l.titulo}, Autor: ${l.autor.nombre}, Editorial: ${l.editorial.nombre}`);
    });

    // Actualizar un libro
    await libro1.update({ titulo: "Cien Años de Soledad (Edición Especial)" });
    console.log("Libro actualizado:", libro1.titulo);

    // Eliminar un libro
    await libro2.destroy();
    console.log("Libro eliminado:", libro2.titulo);

  } catch (error) {
    console.error(" Error:", error);
  } finally {
    await sequelize.close();
  }
})();
